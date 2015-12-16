/// <reference path="./harness.d.ts"/>
function mockCompile(inputFiles, options) {
    if (options === void 0) { options = {}; }
    var compilerResult = null;
    var harnessCompiler = Harness.Compiler.getCompiler();
    var _a = harnessCompiler.createProgram(inputFiles, 
    /* otherFiles: */ [], function (newCompilerResults) { compilerResult = newCompilerResults; }, 
    /*settingsCallback*/ undefined, options), program = _a.program, emit = _a.emit;
    // Rely on knowledge that the harness is not actually asynchronous:
    return program;
}
var result = mockCompile([{
        unitName: "myFile.ts",
        content: "let a = 1;"
    }]);
var checker = result.getTypeChecker();
checker.getTypeAtLocation(result.getSourceFiles()[0]);
/*
for (let key of Object.keys(result)) {
    console.log(key, result[key]);
}*/
