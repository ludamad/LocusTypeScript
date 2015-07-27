/// <reference path="..\..\..\src\harness\harness.ts" />
/// <reference path="..\..\..\src\compiler\emitter.ts" />
/// <reference path="..\..\..\src\compiler\commandLineParser.ts" />

module ts {
    describe('Project initializer', () => {
        interface ExpectedCompilerOptionsOutput {
            [option: string]: string | boolean;
        }

        function assertConfigFile(
            compilerOptions: CompilerOptions,
            fileNames: string[],
            excludes: string[],
            expectedCompilerOptionOutput: ExpectedCompilerOptionsOutput): void {

            let writer = createTextWriter("\n");
            let optionNameMap = getOptionNameMap().optionNameMap;

            buildConfigFile(writer, compilerOptions, fileNames, excludes);

            let expectedOutput = `{\n    "compilerOptions": {\n`;
            for (let option in expectedCompilerOptionOutput) {
                let lowerCaseOption = option.toLowerCase()
                if (optionNameMap[lowerCaseOption].description &&
                    optionNameMap[lowerCaseOption].description.key) {

                    expectedOutput += `        // ${optionNameMap[lowerCaseOption].description.key}\n`;
                }

                expectedOutput += `        "${option}": `;
                if (typeof expectedCompilerOptionOutput[option] === "string") {
                     expectedOutput += `"${expectedCompilerOptionOutput[option]}",\n`;
                }
                else {
                    expectedOutput += expectedCompilerOptionOutput[option].toString() + ",\n";
                }
            }
            expectedOutput += "    }";

            if (fileNames) {
                expectedOutput += ",\n";
                expectedOutput += `    "files": [\n`;
                for (let fileName of fileNames) {
                    expectedOutput += `        "${fileName}",\n`;
                }
                expectedOutput += "    ]";
            }

            if (excludes) {
                expectedOutput += ",\n";
                expectedOutput += `    "exclude": [\n`;
                for (let exclude of excludes) {
                    expectedOutput += `        "${exclude}",\n`;
                }
                expectedOutput += "    ]";
            }
            expectedOutput += "\n}";

            expect(writer.getText()).to.equal(expectedOutput);
        }

        it("should generate default compiler options @projectInit", () => {
            assertConfigFile(
                {},
                null,
                null,
                {
                    module: "commonjs",
                    target: "es3",
                    noImplicitAny: true,
                    outDir: "built",
                    rootDir: ".",
                    sourceMap: false,
                });
        });

        it("should override default compiler options @projectInit", () => {
            assertConfigFile(
                {
                    module: ModuleKind.AMD,
                    target: ScriptTarget.ES5,
                },
                null,
                null,
                {
                    module: "amd", // overrides commonjs
                    target: "es5", // overrides es3
                    noImplicitAny: true,
                    outDir: "built",
                    rootDir: ".",
                    sourceMap: false,
                });
        });

        it("should be able to generate newline option @projectInit", () => {
            assertConfigFile(
                {
                    newLine: NewLineKind.CarriageReturnLineFeed
                },
                null,
                null,
                {
                    newLine: "CRLF",
                    module: "commonjs",
                    target: "es3",
                    noImplicitAny: true,
                    outDir: "built",
                    rootDir: ".",
                    sourceMap: false,
                });

            assertConfigFile(
                {
                    newLine: NewLineKind.LineFeed
                },
                null,
                null,
                {
                    newLine: "LF",
                    module: "commonjs",
                    target: "es3",
                    noImplicitAny: true,
                    outDir: "built",
                    rootDir: ".",
                    sourceMap: false,
                });
        });

        it("should generate a `files` property @projectInit", () => {
            assertConfigFile(
                {},
                ["file1.ts", "file2.ts"],
                null,
                {
                    module: "commonjs",
                    target: "es3",
                    noImplicitAny: true,
                    outDir: "built",
                    rootDir: ".",
                    sourceMap: false
                });
        });

        it("should generete exclude options @projectInit", () => {
            assertConfigFile(
                {},
                null,
                ["node_modules"],
                {
                    module: "commonjs",
                    target: "es3",
                    noImplicitAny: true,
                    outDir: "built",
                    rootDir: ".",
                    sourceMap: false
                });
        });

        it("should not genereate compiler options for `version`, `watch`, `init` and `help` @projectInit", () => {
            assertConfigFile(
                {
                    version: true,
                    watch: true,
                    init: true,
                    help: true,
                },
                null,
                null,
                {
                    module: "commonjs",
                    target: "es3",
                    noImplicitAny: true,
                    outDir: "built",
                    rootDir: ".",
                    sourceMap: false
                });
        });
    });
}