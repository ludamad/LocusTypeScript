/// <reference path="core.ts"/>
/// <reference path="sys.ts"/>
/// <reference path="types.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="commandLineParser.ts"/>

module ts {
    var version = "1.1.0.0";

    /**
     * Checks to see if the locale is in the appropriate format,
     * and if it is, attempts to set the appropriate language.
     */
    function validateLocaleAndSetLanguage(locale: string, errors: Diagnostic[]): boolean {
        var matchResult = /^([a-z]+)([_\-]([a-z]+))?$/.exec(locale.toLowerCase());

        if (!matchResult) {
            errors.push(createCompilerDiagnostic(Diagnostics.Locale_must_be_of_the_form_language_or_language_territory_For_example_0_or_1, 'en', 'ja-jp'));
            return false;
        }

        var language = matchResult[1];
        var territory = matchResult[3];

        // First try the entire locale, then fall back to just language if that's all we have.
        if (!trySetLanguageAndTerritory(language, territory, errors) &&
            !trySetLanguageAndTerritory(language, undefined, errors)) {

            errors.push(createCompilerDiagnostic(Diagnostics.Unsupported_locale_0, locale));
            return false;
        }

        return true;
    }

    function trySetLanguageAndTerritory(language: string, territory: string, errors: Diagnostic[]): boolean {
        var compilerFilePath = sys.getExecutingFilePath();
        var containingDirectoryPath = getDirectoryPath(compilerFilePath);

        var filePath = combinePaths(containingDirectoryPath, language);

        if (territory) {
            filePath = filePath + "-" + territory;
        }

        filePath = sys.resolvePath(combinePaths(filePath, "diagnosticMessages.generated.json"));

        if (!sys.fileExists(filePath)) {
            return false;
        }

        // TODO: Add codePage support for readFile?
        try {
            var fileContents = sys.readFile(filePath);
        }
        catch (e) {
            errors.push(createCompilerDiagnostic(Diagnostics.Unable_to_open_file_0, filePath));
            return false;
        }
        try {
            localizedDiagnosticMessages = JSON.parse(fileContents);
        }
        catch (e) {
            errors.push(createCompilerDiagnostic(Diagnostics.Corrupted_locale_file_0, filePath));
            return false;
        }

        return true;
    }

    function countLines(program: Program): number {
        var count = 0;
        forEach(program.getSourceFiles(), file => {
            count += file.getLineAndCharacterFromPosition(file.end).line;
        });
        return count;
    }

    function getDiagnosticText(message: DiagnosticMessage, ...args: any[]): string {
        var diagnostic: Diagnostic = createCompilerDiagnostic.apply(undefined, arguments);
        return diagnostic.messageText;
    }

    function reportDiagnostic(diagnostic: Diagnostic) {
        if (diagnostic.file) {
            var loc = diagnostic.file.getLineAndCharacterFromPosition(diagnostic.start);
            sys.write(diagnostic.file.filename + "(" + loc.line + "," + loc.character + "): " + diagnostic.messageText + sys.newLine);
        }
        else {
            sys.write(diagnostic.messageText + sys.newLine);
        }
    }

    function reportDiagnostics(diagnostics: Diagnostic[]) {
        for (var i = 0; i < diagnostics.length; i++) {
            reportDiagnostic(diagnostics[i]);
        }
    }

    function padLeft(s: string, length: number) {
        while (s.length < length) {
            s = " " + s;
        }
        return s;
    }

    function padRight(s: string, length: number) {
        while (s.length < length) {
            s = s + " ";
        }

        return s;
    }

    function reportStatisticalValue(name: string, value: string) {
        sys.write(padRight(name + ":", 12) + padLeft(value.toString(), 10) + sys.newLine);
    }

    function reportCountStatistic(name: string, count: number) {
        reportStatisticalValue(name, "" + count);
    }

    function reportTimeStatistic(name: string, time: number) {
        reportStatisticalValue(name, (time / 1000).toFixed(2) + "s");
    }

    function createCompilerHost(options: CompilerOptions): CompilerHost {
        var currentDirectory: string;
        var existingDirectories: Map<boolean> = {};

        function getSourceFile(filename: string, languageVersion: ScriptTarget, onError?: (message: string) => void): SourceFile {
            try {
                var text = sys.readFile(filename, options.charset);
            }
            catch (e) {
                if (onError) {
                    onError(e.message);
                }
                text = "";
            }
            return text !== undefined ? createSourceFile(filename, text, languageVersion) : undefined;
        }

        function writeFile(fileName: string, data: string, onError?: (message: string) => void) {

            function directoryExists(directoryPath: string): boolean {
                if (hasProperty(existingDirectories, directoryPath)) {
                    return true;
                }
                if (sys.directoryExists(directoryPath)) {
                    existingDirectories[directoryPath] = true;
                    return true;
                }
                return false;
            }

            function ensureDirectoriesExist(directoryPath: string) {
                if (directoryPath.length > getRootLength(directoryPath) && !directoryExists(directoryPath)) {
                    var parentDirectory = getDirectoryPath(directoryPath);
                    ensureDirectoriesExist(parentDirectory);
                    sys.createDirectory(directoryPath);
                }
            }

            try {
                ensureDirectoriesExist(getDirectoryPath(normalizePath(fileName)));
                sys.writeFile(fileName, data);
            }
            catch (e) {
                if (onError) onError(e.message);
            }
        }

        return {
            getSourceFile: getSourceFile,
            getDefaultLibFilename: () => combinePaths(getDirectoryPath(normalizePath(sys.getExecutingFilePath())), "lib.d.ts"),
            writeFile: writeFile,
            getCurrentDirectory: () => currentDirectory || (currentDirectory = sys.getCurrentDirectory()),
            useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames,
            getCanonicalFileName: getCanonicalFileName
        };
    }

    export function executeCommandLine(args: string[]): void {
        var exitCode = 0;
        var commandLine = parseCommandLine(args);

        if (commandLine.options.locale) {
            validateLocaleAndSetLanguage(commandLine.options.locale, commandLine.errors);
        }

        // Report all errors at this point, even if there are none.
        if (commandLine.errors.length > 0) {
            reportDiagnostics(commandLine.errors);
            exitCode = 1;
        }

        if (commandLine.options.version) {
            reportDiagnostic(createCompilerDiagnostic(Diagnostics.Version_0, version));
            sys.exit(exitCode);
        }

        if (commandLine.options.help || commandLine.filenames.length === 0) {
            printVersion();
            printHelp();
            sys.exit(exitCode);
        }

        // If we encountered an error before we even started compiling, just bail out.
        if (exitCode !== 0) {
            sys.exit(exitCode);
        }

        var defaultCompilerHost = createCompilerHost(commandLine.options);

        if (commandLine.options.watch) {
            if (!sys.watchFile) {
                reportDiagnostic(createCompilerDiagnostic(Diagnostics.The_current_host_does_not_support_the_0_option, "--watch"));
                sys.exit(1);
            }

            watchProgram(commandLine, defaultCompilerHost);
        }
        else {
            sys.exit(compile(commandLine, defaultCompilerHost).errors.length > 0 ? 1 : 0);
        }
    }

    /**
     * Compiles the program once, and then watches all given and referenced files for changes.
     * Upon detecting a file change, watchProgram will queue up file modification events for the next
     * 250ms and then perform a recompilation. The reasoning is that in some cases, an editor can
     * save all files at once, and we'd like to just perform a single recompilation.
     */
    function watchProgram(commandLine: ParsedCommandLine, compilerHost: CompilerHost): void {
        var watchers: Map<FileWatcher> = {};
        var updatedFiles: Map<boolean> = {};

        // Compile the program the first time and watch all given/referenced files.
        var program = compile(commandLine, compilerHost).program;
        reportDiagnostic(createCompilerDiagnostic(Diagnostics.Compile_complete_Listening_for_changed_files));
        addWatchers(program);
        return;

        function addWatchers(program: Program) {
            forEach(program.getSourceFiles(), f => {
                var filename = f.filename;
                watchers[filename] = sys.watchFile(filename, fileUpdated);
            });
        }

        function removeWatchers(program: Program) {
            forEach(program.getSourceFiles(), f => {
                var filename = f.filename;
                if (hasProperty(watchers, filename)) {
                    watchers[filename].close();
                }
            });

            watchers = {};
        }

        // Fired off whenever a file is changed.
        function fileUpdated(filename: string) {
            var firstNotification = isEmpty(updatedFiles);

            updatedFiles[filename] = true;

            // Only start this off when the first file change comes in,
            // so that we can batch up all further changes.
            if (firstNotification) {
                setTimeout(() => {
                    var changedFiles = updatedFiles;
                    updatedFiles = {};

                    recompile(changedFiles);
                }, 250);
            }
        }

        function recompile(changedFiles: Map<boolean>) {
            var oldProgram = program;
            reportDiagnostic(createCompilerDiagnostic(Diagnostics.File_Changed_Compiling));
            // Remove all the watchers, since we may not be watching every file
            // specified since the last recompilation cycle.
            removeWatchers(oldProgram);

            // We create a new compiler host for this compilation cycle.
            // This new host is effectively the same except that 'getSourceFile'
            // will try to reuse the SourceFiles from the last compilation cycle
            // so long as they were not modified.
            var newCompilerHost = clone(compilerHost);
            newCompilerHost.getSourceFile = (fileName, languageVersion, onError) => {
                if (!hasProperty(changedFiles, fileName)) {
                    var sourceFile = oldProgram.getSourceFile(fileName);
                    if (sourceFile) {
                        return sourceFile;
                    }
                }

                return compilerHost.getSourceFile(fileName, languageVersion, onError);
            };

            program = compile(commandLine, newCompilerHost).program;
            reportDiagnostic(createCompilerDiagnostic(Diagnostics.Compile_complete_Listening_for_changed_files));
            addWatchers(program);
        }
    }

    function compile(commandLine: ParsedCommandLine, compilerHost: CompilerHost) {
        var parseStart = new Date().getTime();
        var program = createProgram(commandLine.filenames, commandLine.options, compilerHost);
        var bindStart = new Date().getTime();
        var errors = program.getDiagnostics();
        if (errors.length) {
            var checkStart = bindStart;
            var emitStart = bindStart;
            var reportStart = bindStart;
        }
        else {
            var checker = program.getTypeChecker();
            var checkStart = new Date().getTime();
            var semanticErrors = checker.getDiagnostics();
            var emitStart = new Date().getTime();
            var emitErrors = checker.emitFiles().errors;
            var reportStart = new Date().getTime();
            errors = concatenate(semanticErrors, emitErrors);
        }

        reportDiagnostics(errors);
        if (commandLine.options.diagnostics) {
            reportCountStatistic("Files", program.getSourceFiles().length);
            reportCountStatistic("Lines", countLines(program));
            reportCountStatistic("Nodes", checker ? checker.getNodeCount() : 0);
            reportCountStatistic("Identifiers", checker ? checker.getIdentifierCount() : 0);
            reportCountStatistic("Symbols", checker ? checker.getSymbolCount() : 0);
            reportCountStatistic("Types", checker ? checker.getTypeCount() : 0);
            reportTimeStatistic("Parse time", bindStart - parseStart);
            reportTimeStatistic("Bind time", checkStart - bindStart);
            reportTimeStatistic("Check time", emitStart - checkStart);
            reportTimeStatistic("Emit time", reportStart - emitStart);
            reportTimeStatistic("Total time", reportStart - parseStart);
        }

        return { program: program, errors: errors };

    }

    function printVersion() {
        sys.write(getDiagnosticText(Diagnostics.Version_0, version) + sys.newLine);
    }

    function printHelp() {
        var output = "";

        // We want to align our "syntax" and "examples" commands to a certain margin.
        var syntaxLength = getDiagnosticText(Diagnostics.Syntax_Colon_0, "").length
        var examplesLength = getDiagnosticText(Diagnostics.Examples_Colon_0, "").length
        var marginLength = Math.max(syntaxLength, examplesLength);

        // Build up the syntactic skeleton.
        var syntax = makePadding(marginLength - syntaxLength);
        syntax += "tsc [" + getDiagnosticText(Diagnostics.options) + "] [" + getDiagnosticText(Diagnostics.file) + " ...]";

        output += getDiagnosticText(Diagnostics.Syntax_Colon_0, syntax);
        output += sys.newLine + sys.newLine;

        // Build up the list of examples.
        var padding = makePadding(marginLength);
        output += getDiagnosticText(Diagnostics.Examples_Colon_0, makePadding(marginLength - examplesLength) + "tsc hello.ts") + sys.newLine;
        output += padding + "tsc --out foo.js foo.ts" + sys.newLine;
        output += padding + "tsc @args.txt" + sys.newLine;
        output += sys.newLine;

        output += getDiagnosticText(Diagnostics.Options_Colon) + sys.newLine;

        // Sort our options by their names, (e.g. "--noImplicitAny" comes before "--watch")
        var optsList = optionDeclarations.slice();
        optsList.sort((a, b) => compareValues(a.name.toLowerCase(), b.name.toLowerCase()));

        // We want our descriptions to align at the same column in our output,
        // so we keep track of the longest option usage string.
        var marginLength = 0;
        var usageColumn: string[] = []; // Things like "-d, --declaration" go in here.
        var descriptionColumn: string[] = [];

        for (var i = 0; i < optsList.length; i++) {
            var option = optsList[i];

            // If an option lacks a description,
            // it is not officially supported.
            if (!option.description) {
                continue;
            }

            var usageText = " ";
            if (option.shortName) {
                usageText += "-" + option.shortName;
                usageText += getParamName(option);
                usageText += ", ";
            }

            usageText += "--" + option.name;
            usageText += getParamName(option);

            usageColumn.push(usageText);
            descriptionColumn.push(getDiagnosticText(option.description));

            // Set the new margin for the description column if necessary.
            if (usageText.length > marginLength) {
                marginLength = usageText.length;
            }
        }

        // Special case that can't fit in the loop.
        var usageText = " @<" + getDiagnosticText(Diagnostics.file) + ">";
        usageColumn.push(usageText);
        descriptionColumn.push(getDiagnosticText(Diagnostics.Insert_command_line_options_and_files_from_a_file));
        if (usageText.length > marginLength) {
            marginLength = usageText.length;
        }

        // Print out each row, aligning all the descriptions on the same column.
        for (var i = 0; i < usageColumn.length; i++) {
            var usage = usageColumn[i];
            var description = descriptionColumn[i];
            output += usage + makePadding(marginLength - usage.length + 2) + description + sys.newLine;
        }

        sys.write(output);
        return;

        function getParamName(option: CommandLineOption) {
            if (option.paramName !== undefined) {
                return " " + getDiagnosticText(option.paramName);
            }
            return "";
        }

        function makePadding(paddingLength: number): string {
            return Array(paddingLength + 1).join(" ");
        }
    }
}

ts.executeCommandLine(sys.args);
