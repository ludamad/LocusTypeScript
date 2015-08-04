/// <reference path='harness.ts'/>
/// <reference path='runnerbase.ts' />
/// <reference path='loggedIO.ts' />
/// <reference path='..\compiler\commandLineParser.ts'/>

module RWC {
    function runWithIOLog(ioLog: IOLog, fn: () => void) {
        let oldSys = ts.sys;

        let wrappedSys = Playback.wrapSystem(ts.sys);
        wrappedSys.startReplayFromData(ioLog);
        ts.sys = wrappedSys;

        try {
            fn();
        } finally {
            wrappedSys.endReplay();
            ts.sys = oldSys;
        }
    }

    export function runRWCTest(jsonPath: string) {
        describe("Testing a RWC project: " + jsonPath, () => {
            let inputFiles: { unitName: string; content: string; }[] = [];
            let otherFiles: { unitName: string; content: string; }[] = [];
            let compilerResult: Harness.Compiler.CompilerResult;
            let compilerOptions: ts.CompilerOptions;
            let baselineOpts: Harness.Baseline.BaselineOptions = {
                Subfolder: 'rwc',
                Baselinefolder: 'internal/baselines'
            };
            let baseName = /(.*)\/(.*).json/.exec(ts.normalizeSlashes(jsonPath))[2];
            let currentDirectory: string;
            let useCustomLibraryFile: boolean;

            after(() => {
                // Mocha holds onto the closure environment of the describe callback even after the test is done.
                // Therefore we have to clean out large objects after the test is done.
                inputFiles = undefined;
                otherFiles = undefined;
                compilerResult = undefined;
                compilerOptions = undefined;
                baselineOpts = undefined;
                baseName = undefined;
                currentDirectory = undefined;
                // useCustomLibraryFile is a flag specified in the json object to indicate whether to use built/local/lib.d.ts
                // or to use lib.d.ts inside the json object. If the flag is true, use the lib.d.ts inside json file
                // otherwise use the lib.d.ts from built/local
                useCustomLibraryFile = undefined;
            });

            it('can compile', () => {
                let harnessCompiler = Harness.Compiler.getCompiler();
                let opts: ts.ParsedCommandLine;

                let ioLog: IOLog = JSON.parse(Harness.IO.readFile(jsonPath));
                currentDirectory = ioLog.currentDirectory;
                useCustomLibraryFile = ioLog.useCustomLibraryFile;
                runWithIOLog(ioLog, () => {
                    opts = ts.parseCommandLine(ioLog.arguments);
                    assert.equal(opts.errors.length, 0);

                    // To provide test coverage of output javascript file,
                    // we will set noEmitOnError flag to be false.
                    opts.options.noEmitOnError = false;
                });

                runWithIOLog(ioLog, () => {
                    harnessCompiler.reset();

                    // Load the files
                    ts.forEach(opts.fileNames, fileName => {
                        inputFiles.push(getHarnessCompilerInputUnit(fileName));
                    });

                    // Add files to compilation
                    let isInInputList = (resolvedPath: string) => (inputFile: { unitName: string; content: string; }) => inputFile.unitName === resolvedPath;
                    for (let fileRead of ioLog.filesRead) {
                        // Check if the file is already added into the set of input files.
                        const resolvedPath = ts.normalizeSlashes(ts.sys.resolvePath(fileRead.path));
                        let inInputList = ts.forEach(inputFiles, isInInputList(resolvedPath));

                        if (!Harness.isLibraryFile(fileRead.path)) {
                            if (inInputList) {
                                continue;
                            }
                            otherFiles.push(getHarnessCompilerInputUnit(fileRead.path));
                        }
                        else if (!opts.options.noLib && Harness.isLibraryFile(fileRead.path)){
                            if (!inInputList) {
                                // If useCustomLibraryFile is true, we will use lib.d.ts from json object
                                // otherwise use the lib.d.ts from built/local
                                // Majority of RWC code will be using built/local/lib.d.ts instead of
                                // lib.d.ts inside json file. However, some RWC cases will still use
                                // their own version of lib.d.ts because they have customized lib.d.ts
                                if (useCustomLibraryFile) {
                                    inputFiles.push(getHarnessCompilerInputUnit(fileRead.path));
                                }
                                else {
                                    inputFiles.push(Harness.getDefaultLibraryFile());
                                }
                            }
                        }
                    }

                    // do not use lib since we already read it in above
                    opts.options.noLib = true;

                    // Emit the results
                    compilerOptions = harnessCompiler.compileFiles(
                        inputFiles,
                        otherFiles,
                        newCompilerResults => { compilerResult = newCompilerResults; },
                        /*settingsCallback*/ undefined, opts.options,
                        // Since each RWC json file specifies its current directory in its json file, we need
                        // to pass this information in explicitly instead of acquiring it from the process.
                        currentDirectory);
                });

                function getHarnessCompilerInputUnit(fileName: string) {
                    let unitName = ts.normalizeSlashes(ts.sys.resolvePath(fileName));
                    let content: string = null;
                    try {
                        content = ts.sys.readFile(unitName);
                    }
                    catch (e) {
                        content = ts.sys.readFile(fileName);
                    }
                    return { unitName, content };
                }
            });


            it('has the expected emitted code', () => {
                Harness.Baseline.runBaseline('has the expected emitted code', baseName + '.output.js', () => {
                    return Harness.Compiler.collateOutputs(compilerResult.files);
                }, false, baselineOpts);
            });

            it('has the expected declaration file content', () => {
                Harness.Baseline.runBaseline('has the expected declaration file content', baseName + '.d.ts', () => {
                    if (!compilerResult.declFilesCode.length) {
                        return null;
                    }

                    return Harness.Compiler.collateOutputs(compilerResult.declFilesCode);
                }, false, baselineOpts);
            });

            it('has the expected source maps', () => {
                Harness.Baseline.runBaseline('has the expected source maps', baseName + '.map', () => {
                    if (!compilerResult.sourceMaps.length) {
                        return null;
                    }

                    return Harness.Compiler.collateOutputs(compilerResult.sourceMaps);
                }, false, baselineOpts);
            });

            /*it('has correct source map record', () => {
                if (compilerOptions.sourceMap) {
                    Harness.Baseline.runBaseline('has correct source map record', baseName + '.sourcemap.txt', () => {
                        return compilerResult.getSourceMapRecord();
                    }, false, baselineOpts);
                }
            });*/

            it('has the expected errors', () => {
                Harness.Baseline.runBaseline('has the expected errors', baseName + '.errors.txt', () => {
                    if (compilerResult.errors.length === 0) {
                        return null;
                    }

                    return Harness.Compiler.getErrorBaseline(inputFiles.concat(otherFiles), compilerResult.errors);
                }, false, baselineOpts);
            });

            // Ideally, a generated declaration file will have no errors. But we allow generated
            // declaration file errors as part of the baseline.
            it('has the expected errors in generated declaration files', () => {
                if (compilerOptions.declaration && !compilerResult.errors.length) {
                    Harness.Baseline.runBaseline('has the expected errors in generated declaration files', baseName + '.dts.errors.txt', () => {
                        let declFileCompilationResult = Harness.Compiler.getCompiler().compileDeclarationFiles(inputFiles, otherFiles, compilerResult,
                            /*settingscallback*/ undefined, compilerOptions, currentDirectory);
                        if (declFileCompilationResult.declResult.errors.length === 0) {
                            return null;
                        }

                        return Harness.Compiler.minimalDiagnosticsToString(declFileCompilationResult.declResult.errors) +
                            ts.sys.newLine + ts.sys.newLine +
                            Harness.Compiler.getErrorBaseline(declFileCompilationResult.declInputFiles.concat(declFileCompilationResult.declOtherFiles), declFileCompilationResult.declResult.errors);
                    }, false, baselineOpts);
                }
            });

            // TODO: Type baselines (need to refactor out from compilerRunner)
        });
    }
}

class RWCRunner extends RunnerBase {
    private static sourcePath = "internal/cases/rwc/";

    /** Setup the runner's tests so that they are ready to be executed by the harness
     *  The first test should be a describe/it block that sets up the harness's compiler instance appropriately
     */
    public initializeTests(): void {
        // Read in and evaluate the test list
        let testList = Harness.IO.listFiles(RWCRunner.sourcePath, /.+\.json$/);
        for (let i = 0; i < testList.length; i++) {
            this.runTest(testList[i]);
        }
    }

    private runTest(jsonFileName: string) {
        RWC.runRWCTest(jsonFileName);
    }
}