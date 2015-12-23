/// <reference path="./harness.d.ts"/>
require('./harness');
describe("Suite", function () {
    it("Test", function () {
        var _a = mockCompile(["\n            function ParameterFunction(param: declare DeclaredParamType) {\n                param.x = 1;\n                param.y = 1;\n            }"
        ]), rootNode = _a.sourceFiles[0], checker = _a.checker;
        var firstThisNode = find(rootNode, function (_a) {
            var kind = _a.kind, parent = _a.parent;
            return kind === 105 /* ThisKeyword */ &&
                parent != null &&
                parent.kind === 175 /* PropertyAccessExpression */;
        });
        var memberSet = checker.scanAssignedMemberTypes(firstThisNode);
        console.log(memberSet);
        //ts.printNodeDeep(rootNode);
        //console.log(checker.typeToString((checker.getTypeAtLocation(func))));
    });
});
function find(node, filter) {
    assert(node);
    function iter(node) {
        // Unsafe cast, don't use members beyond Node in filter 
        // unless type has been discriminated:
        if (filter(node))
            return node;
        return ts.forEachChild(node, iter);
    }
    return iter(node);
}
function filterSourceFiles(inputFiles, sourceFiles) {
    return sourceFiles.filter(function (_a) {
        var fileName = _a.fileName;
        for (var _i = 0; _i < inputFiles.length; _i++) {
            var unitName = inputFiles[_i].unitName;
            if (unitName === fileName) {
                return true;
            }
        }
        return false;
    });
}
function mockCompile(inputContents, options) {
    if (options === void 0) { options = {}; }
    var compilerResult = null;
    var harnessCompiler = Harness.Compiler.getCompiler();
    var nUnits = 0;
    var inputFiles = inputContents.map(function (content) { return ({ unitName: "simulated_file" + ++nUnits + ".ts", content: content }); });
    console.log(inputFiles);
    var _a = harnessCompiler.createProgram(inputFiles, 
    /* otherFiles: */ [], function (newCompilerResults) { compilerResult = newCompilerResults; }, 
    /*settingsCallback*/ undefined, options), program = _a.program, emit = _a.emit;
    // Rely on knowledge that the harness is not actually asynchronous (otherwise 'program' may be null)
    return {
        sourceFiles: filterSourceFiles(inputFiles, program.getSourceFiles()),
        checker: program.getTypeChecker()
    };
}
