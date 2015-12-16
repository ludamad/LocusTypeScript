/// <reference path="./harness.d.ts"/>

type MockFile = {unitName: string, content: string};

function mockCompile(inputFiles:MockFile[], options: ts.CompilerOptions & Harness.Compiler.HarnessOptions = {}) {
    let compilerResult = null;
    let harnessCompiler = Harness.Compiler.getCompiler();
    let {program, emit} = harnessCompiler.createProgram(
        inputFiles,
        /* otherFiles: */ [],
        newCompilerResults => { compilerResult = newCompilerResults; },
        /*settingsCallback*/ undefined, options
    );

    // Rely on knowledge that the harness is not actually asynchronous:
    return program;
}

let result = mockCompile([{
    unitName: "myFile.ts",
    content: "let a = 1;"
}]);

let checker = result.getTypeChecker();


checker.getTypeAtLocation(result.getSourceFiles()[0]);
/*
for (let key of Object.keys(result)) {
    console.log(key, result[key]);
}*/

