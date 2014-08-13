///<reference path="harness.ts" />
///<reference path="runnerbase.ts" />

// Test case is json of below type in tests/cases/project/
interface ProjectRunnerTestCase {
    scenario: string;
    projectRoot: string; // project where it lives - this also is the current dictory when compiling
    inputFiles: string[]; // list of input files to be given to program
    out?: string; // --out
    outDir?: string; // --outDir
    sourceMap?: boolean; // --map
    mapRoot?: string; // --mapRoot
    resolveMapRoot?: boolean; // should we resolve this map root and give compiler the absolute disk path as map root?
    sourceRoot?: string; // --sourceRoot
    resolveSourceRoot?: boolean; // should we resolve this source root and give compiler the absolute disk path as map root?
    declaration?: boolean; // --d
    baselineCheck?: boolean; // Verify the baselines of output files, if this is false, we will write to output to the disk but there is no verification of baselines
    runTest?: boolean; // Run the resulting test
    bug?: string; // If there is any bug associated with this test case
}

interface ProjectRunnerTestCaseResolutionInfo extends ProjectRunnerTestCase {
    // Apart from actual test case the results of the resolution
    resolvedInputFiles: string[]; // List of files that were asked to read by compiler
    emittedFiles: string[]; // List of files that wre emitted by the compiler
}

interface BatchCompileProjectTestCaseEmittedFile extends Harness.Compiler.GeneratedFile {
    emittedFileName: string;
}

interface BatchCompileProjectTestCaseResult {
    moduleKind: ts.ModuleKind;
    program: ts.Program;
    readInputFiles: ts.SourceFile[];
    sourceMapData: ts.SourceMapData[];
    outputFiles: BatchCompileProjectTestCaseEmittedFile[];
    errors: ts.Diagnostic[];
    nonSubfolderDiskFiles: number;
}

class ProjectRunner extends RunnerBase {
    public initializeTests() {
        if (this.tests.length === 0) {
            var testFiles = this.enumerateFiles("tests/cases/project", /\.json$/, { recursive: true });
            testFiles.forEach(fn => {
                fn = fn.replace(/\\/g, "/");
                this.runProjectTestCase(fn);
            });
        }
        else {
            this.tests.forEach(test => this.runProjectTestCase(test));
        }
    }

    private runProjectTestCase(testCaseFileName: string) {
        var testCase: ProjectRunnerTestCase;

        try {
            var testFileText = sys.readFile(testCaseFileName);
        }
        catch (e) {
            assert(false, "Unable to open testcase file: " + testCaseFileName + ": " + e.message);
        }

        try {
            testCase = <ProjectRunnerTestCase>JSON.parse(testFileText);
        }
        catch (e) {
            assert(false, "Testcase: " + testCaseFileName + " doesnt not contain valid json format: " + e.message);
        }
        var testCaseJustName = testCaseFileName.replace(/^.*[\\\/]/, '').replace(/\.json/, "");

        function moduleNameToString(moduleKind: ts.ModuleKind) {
            return moduleKind === ts.ModuleKind.AMD
                ? "amd"
                : moduleKind === ts.ModuleKind.CommonJS
                ? "node"
                : "none";
        }

        // Project baselines verified go in project/testCaseName/moduleKind/
        function getBaselineFolder(moduleKind: ts.ModuleKind) {
            return "project/" + testCaseJustName + "/" + moduleNameToString(moduleKind) + "/";
        }

        // When test case output goes to tests/baselines/local/projectOutput/testCaseName/moduleKind/
        // We have these two separate locations because when compairing baselines the baseline verifier will delete the existing file 
        // so even if it was created by compiler in that location, the file will be deleted by verified before we can read it
        // so lets keep these two locations separate
        function getProjectOutputFolder(filename: string, moduleKind: ts.ModuleKind) {
            return Harness.Baseline.localPath("projectOutput/" + testCaseJustName + "/" + moduleNameToString(moduleKind) + "/" + filename);
        }

        function cleanProjectUrl(url: string) {
            var diskProjectPath = ts.normalizeSlashes(sys.resolvePath(testCase.projectRoot));
            var projectRootUrl = "file:///" + diskProjectPath;
            var normalizedProjectRoot = ts.normalizeSlashes(testCase.projectRoot);
            diskProjectPath = diskProjectPath.substr(0, diskProjectPath.lastIndexOf(normalizedProjectRoot));
            projectRootUrl = projectRootUrl.substr(0, projectRootUrl.lastIndexOf(normalizedProjectRoot));
            if (url && url.length) {
                if (url.indexOf(projectRootUrl) === 0) {
                    // replace the disk specific project url path into project root url
                    url = "file:///" + url.substr(projectRootUrl.length);
                }
                else if (url.indexOf(diskProjectPath) === 0) {
                    // Replace the disk specific path into the project root path
                    url = url.substr(diskProjectPath.length);
                    if (url.charCodeAt(0) != ts.CharacterCodes.slash) {
                        url = "/" + url;
                    }
                }
            }

            return url;
        }
       
        function batchCompilerProjectTestCase(moduleKind: ts.ModuleKind): BatchCompileProjectTestCaseResult{
            var nonSubfolderDiskFiles = 0;

            var readInputFiles: ts.SourceFile[] = [];
            var sourceMapData: ts.SourceMapData[] = null;
            var outputFiles: BatchCompileProjectTestCaseEmittedFile[] = [];

            function createCompilerOptions(): ts.CompilerOptions {
                return {
                    declaration: !!testCase.declaration,
                    sourceMap: !!testCase.sourceMap,
                    out: testCase.out,
                    outDir: testCase.outDir,
                    mapRoot: testCase.resolveMapRoot && testCase.mapRoot ? sys.resolvePath(testCase.mapRoot) : testCase.mapRoot,
                    sourceRoot: testCase.resolveSourceRoot && testCase.sourceRoot ? sys.resolvePath(testCase.sourceRoot) : testCase.sourceRoot,
                    module: moduleKind
                };
            }

            function getSourceFile(filename: string, languageVersion: ts.ScriptTarget): ts.SourceFile {
                var sourceFile: ts.SourceFile = undefined;
                if (filename === Harness.Compiler.defaultLibFileName) {
                    sourceFile = Harness.Compiler.defaultLibSourceFile;
                }
                else {
                    assert.isTrue(!ts.filter(readInputFiles, sourceFile => sourceFile.filename == filename).length, "Compiler trying to read same file again: " + filename);

                    try {
                        var text = sys.readFile(ts.isRootedDiskPath(filename)
                            ? filename
                            : ts.normalizeSlashes(testCase.projectRoot) + "/" + ts.normalizeSlashes(filename));
                    }
                    catch (e) {
                        // text doesn't get defined.
                    }

                    if (text !== undefined) {
                        sourceFile = ts.createSourceFile(filename, text, languageVersion, /*version:*/ "0");
                    }
                }

                if (sourceFile) {
                    readInputFiles.push(sourceFile);
                }
                return sourceFile;
            }

            function writeFile(filename: string, data: string, writeByteOrderMark: boolean) {
                var diskFileName = ts.isRootedDiskPath(filename)
                    ? filename
                    : ts.normalizeSlashes(testCase.projectRoot) + "/" + ts.normalizeSlashes(filename);

                var diskRelativeName = ts.getRelativePathToDirectoryOrUrl(testCase.projectRoot, diskFileName, getCurrentDirectory(), false);
                if (ts.isRootedDiskPath(diskRelativeName) || diskRelativeName.substr(0, 3) === "../") {
                    // If the generated output file recides in the parent folder or is rooted path, 
                    // we need to instead create files that can live in the project reference folder
                    // but make sure extension of these files matches with the filename the compiler asked to write
                    diskRelativeName = "diskFile" + nonSubfolderDiskFiles++ +
                    (Harness.Compiler.isDTS(filename) ? ".d.ts" :
                    Harness.Compiler.isJS(filename) ? ".js" : ".js.map");
                }

                if (Harness.Compiler.isJS(filename)) {
                    // Make sure if there is URl we have it cleaned up
                    var indexOfSourceMapUrl = data.lastIndexOf("//# sourceMappingURL=");
                    if (indexOfSourceMapUrl != -1) {
                        data = data.substring(0, indexOfSourceMapUrl + 21) + cleanProjectUrl(data.substring(indexOfSourceMapUrl + 21));
                    }
                }
                else if (Harness.Compiler.isJSMap(filename)) {
                    // Make sure sources list is cleaned
                    var sourceMapData = JSON.parse(data);
                    for (var i = 0; i < sourceMapData.sources.length; i++) {
                        sourceMapData.sources[i] = cleanProjectUrl(sourceMapData.sources[i]);
                    }
                    sourceMapData.sourceRoot = cleanProjectUrl(sourceMapData.sourceRoot);
                    data = JSON.stringify(sourceMapData);
                }

                var outputFilePath = getProjectOutputFolder(diskRelativeName, moduleKind);
                // Actual writing of file as in tc.ts
                function ensureDirectoryStructure(directoryname: string) {
                    if (directoryname) {
                        if (!sys.directoryExists(directoryname)) {
                            ensureDirectoryStructure(ts.getDirectoryPath(directoryname));
                            sys.createDirectory(directoryname);
                        }
                    }
                }
                ensureDirectoryStructure(ts.getDirectoryPath(ts.normalizePath(outputFilePath)));
                sys.writeFile(outputFilePath, data, writeByteOrderMark);

                outputFiles.push({ emittedFileName: filename, code: data, fileName: diskRelativeName, writeByteOrderMark: writeByteOrderMark });
            }

            function getCurrentDirectory() {
                return sys.resolvePath(testCase.projectRoot);
            }

            function createCompilerHost(): ts.CompilerHost {
                return {
                    getSourceFile: getSourceFile,
                    getDefaultLibFilename: () => Harness.Compiler.defaultLibFileName,
                    writeFile: writeFile,
                    getCurrentDirectory: getCurrentDirectory,
                    getCanonicalFileName: ts.getCanonicalFileName,
                    useCaseSensitiveFileNames: () => sys.useCaseSensitiveFileNames,
                    getNewLine:()=> sys.newLine
                };
            }

            var program = ts.createProgram(testCase.inputFiles, createCompilerOptions(), createCompilerHost());
            var errors = program.getDiagnostics();
            if (!errors.length) {
                var checker = program.getTypeChecker();
                errors = checker.getDiagnostics();
                var emitResult = checker.emitFiles();
                errors = ts.concatenate(errors, emitResult.errors);
                sourceMapData = emitResult.sourceMaps;

                // Clean up source map data that will be used in baselining
                if (sourceMapData) {
                    for (var i = 0; i < sourceMapData.length; i++) {
                        for (var j = 0; j < sourceMapData[i].sourceMapSources.length; j++) {
                            sourceMapData[i].sourceMapSources[j] = cleanProjectUrl(sourceMapData[i].sourceMapSources[j]);
                        }
                        sourceMapData[i].jsSourceMappingURL = cleanProjectUrl(sourceMapData[i].jsSourceMappingURL);
                        sourceMapData[i].sourceMapSourceRoot = cleanProjectUrl(sourceMapData[i].sourceMapSourceRoot);
                    }
                }
            }

            return {
                moduleKind: moduleKind,                
                program: program,
                readInputFiles: readInputFiles,
                sourceMapData: sourceMapData,
                outputFiles: outputFiles,
                errors: errors,
                nonSubfolderDiskFiles: nonSubfolderDiskFiles,
            };
        }

        describe('Compiling project for ' + testCase.scenario +': testcase ' + testCaseFileName, () => {
            function verifyCompilerResults(compilerResult: BatchCompileProjectTestCaseResult) {
                function getCompilerResolutionInfo() {
                    var resolutionInfo: ProjectRunnerTestCaseResolutionInfo = {
                        scenario: testCase.scenario,
                        projectRoot: testCase.projectRoot,
                        inputFiles: testCase.inputFiles,
                        out: testCase.out,
                        outDir: testCase.outDir,
                        sourceMap: testCase.sourceMap,
                        mapRoot: testCase.mapRoot,
                        resolveMapRoot: testCase.resolveMapRoot,
                        sourceRoot: testCase.sourceRoot,
                        resolveSourceRoot: testCase.resolveSourceRoot,
                        declaration: testCase.declaration,
                        baselineCheck: testCase.baselineCheck,
                        runTest: testCase.runTest,
                        bug: testCase.bug,
                        resolvedInputFiles: ts.map(compilerResult.readInputFiles, inputFile => inputFile.filename),
                        emittedFiles: ts.map(compilerResult.outputFiles, outputFile => outputFile.emittedFileName)
                    };

                    return resolutionInfo;
                }

                it('Resolution information of (' + moduleNameToString(compilerResult.moduleKind) + '): ' + testCaseFileName, () => {
                    assert.equal(compilerResult.program.getSourceFiles().length, compilerResult.readInputFiles.length, "Compiler missing/has extra source files that were read during compilation");
                    Harness.Baseline.runBaseline('Resolution information of (' + moduleNameToString(compilerResult.moduleKind) + '): ' + testCaseFileName, getBaselineFolder(compilerResult.moduleKind) + testCaseJustName + '.json', () => {
                        return JSON.stringify(getCompilerResolutionInfo(), undefined, "    ");
                    });
                });

                if (compilerResult.errors.length) {
                    it('Errors for (' + moduleNameToString(compilerResult.moduleKind) + '): ' + testCaseFileName, () => {
                        Harness.Baseline.runBaseline('Errors for (' + moduleNameToString(compilerResult.moduleKind) + '): ' + testCaseFileName, getBaselineFolder(compilerResult.moduleKind) + testCaseJustName + '.errors.txt', () => {
                            // This is copied from tc.ts's reportError to replicate what tc does
                            var errors = "";
                            for (var i = 0; i < compilerResult.errors.length; i++) {
                                var error = compilerResult.errors[i];
                                // TODO(jfreeman): Remove assert
                                ts.Debug.assert(error.messageText.indexOf("{NL}") < 0);
                                if (error.file) {
                                    var loc = error.file.getLineAndCharacterFromPosition(error.start);
                                    errors += error.file.filename + "(" + loc.line + "," + loc.character + "): " + error.messageText + sys.newLine;
                                }
                                else {
                                    errors += error.messageText + sys.newLine;
                                }
                            }

                            return errors;
                        });
                    });
                }

                if (testCase.baselineCheck) {
                    ts.forEach(compilerResult.outputFiles, outputFile => {
                        it('Baseline of emitted result (' + moduleNameToString(compilerResult.moduleKind) + '): ' + testCaseFileName, () => {
                            Harness.Baseline.runBaseline('Baseline of emitted result (' + moduleNameToString(compilerResult.moduleKind) + '): ' + testCaseFileName, getBaselineFolder(compilerResult.moduleKind) + outputFile.fileName, () => {
                                try {
                                    return sys.readFile(getProjectOutputFolder(outputFile.fileName, compilerResult.moduleKind));
                                }
                                catch (e) {
                                    return undefined;
                                }
                            });
                        });
                    });

                    if (compilerResult.sourceMapData) {
                        it('SourceMapRecord for (' + moduleNameToString(compilerResult.moduleKind) + '): ' + testCaseFileName, () => {
                            Harness.Baseline.runBaseline('SourceMapRecord for (' + moduleNameToString(compilerResult.moduleKind) + '): ' + testCaseFileName, getBaselineFolder(compilerResult.moduleKind) + testCaseJustName + '.sourcemap.txt', () => {
                                return Harness.SourceMapRecoder.getSourceMapRecord(compilerResult.sourceMapData, compilerResult.program,
                                    ts.filter(compilerResult.outputFiles, outputFile => Harness.Compiler.isJS(outputFile.emittedFileName)));
                            });
                        });
                    }
                }
            }

            // Compile using node
            var nodeCompilerResult = batchCompilerProjectTestCase(ts.ModuleKind.CommonJS);
            verifyCompilerResults(nodeCompilerResult);

            // Compile using amd
            var amdCompilerResult = batchCompilerProjectTestCase(ts.ModuleKind.AMD);
            verifyCompilerResults(amdCompilerResult);

            if (testCase.runTest) {
                //TODO(ryanca/danquirk): Either support this or remove this option from the interface as well as test case json files
                // Node results
                assert.isTrue(!nodeCompilerResult.nonSubfolderDiskFiles, "Cant run test case that generates parent folders/absolute path");
                //it("runs without error: (" + moduleNameToString(nodeCompilerResult.moduleKind) + ')', function (done: any) {
                //    Exec.exec("node.exe", ['"' + baseLineLocalPath(nodeCompilerResult.outputFiles[0].diskRelativeName, nodeCompilerResult.moduleKind) + '"'], function (res) {
                //        Harness.Assert.equal(res.stdout, "");
                //        Harness.Assert.equal(res.stderr, "");
                //        done();
                //    })
                //});

                // Amd results
                assert.isTrue(!amdCompilerResult.nonSubfolderDiskFiles, "Cant run test case that generates parent folders/absolute path");
                //var amdDriverTemplate = "var requirejs = require('../r.js');\n\n" +
                //    "requirejs.config({\n" +
                //    "    nodeRequire: require\n" +
                //    "});\n\n" +
                //    "requirejs(['{0}'],\n" +
                //    "function ({0}) {\n" +
                //    "});";
                //var moduleName = baseLineLocalPath(amdCompilerResult.outputFiles[0].diskRelativeName, amdCompilerResult.moduleKind).replace(/\.js$/, "");
                //sys.writeFile(testCase.projectRoot + '/driver.js', amdDriverTemplate.replace(/\{0}/g, moduleName));
                //it("runs without error (" + moduleNameToString(amdCompilerResult.moduleKind) + ')', function (done: any) {
                //    Exec.exec("node.exe", ['"' + testCase.projectRoot + '/driver.js"'], function (res) {
                //        Harness.Assert.equal(res.stdout, "");
                //        Harness.Assert.equal(res.stderr, "");
                //        done();
                //    })
                //});
            }
        });
    }
}