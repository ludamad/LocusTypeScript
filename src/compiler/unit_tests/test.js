/// <reference path="./harness.d.ts"/>
require('./harness');
Harness.lightMode = true;
function paramTest(paramName, expectedKind) {
    var _a = mockCompile([("\n        function ParameterFunction(" + paramName + ": declare DeclaredParamType) {\n            " + paramName + ".x = 1;\n            " + paramName + ".y = 1;\n        }")
    ]), rootNode = _a.sourceFiles[0], checker = _a.checker;
    //    let declareNode = find<ts.DeclareTypeNode>(rootNode, ({kind}) => kind === ts.SyntaxKind.DeclareType);
    var firstInstanceOfParam = find(rootNode, function (_a) {
        var kind = _a.kind, parent = _a.parent;
        return kind === expectedKind &&
            parent !== null &&
            parent.kind === 175 /* PropertyAccessExpression */;
    });
    assert(firstInstanceOfParam, "Did not find '" + paramName + "' node");
    var firstInstanceType = checker.getTypeAtLocation(firstInstanceOfParam);
    assert(!checker.isTypeAny(firstInstanceType), "Type of parameter should not resolve to 'any'!");
    var memberSet = checker.scanAssignedMemberTypes(firstInstanceOfParam);
    console.log(ts.flowMemberSetToString(checker, memberSet));
    //ts.printNodeDeep(rootNode);
    //console.log(checker.typeToString((checker.getTypeAtLocation(func))));
}
describe("DeclareTypeNode in parameter", function () {
    //    it("'this' pseudo-parameter test", () => {
    //        paramTest("this", ts.SyntaxKind.ThisKeyword);
    //    });
    it("parameter test", function () {
        paramTest("param", 76 /* Identifier */);
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
    var _a = harnessCompiler.createProgram(inputFiles, 
    /* otherFiles: */ [], function (newCompilerResults) { compilerResult = newCompilerResults; }, 
    /*settingsCallback*/ undefined, options), program = _a.program, emit = _a.emit;
    // Rely on knowledge that the harness is not actually asynchronous (otherwise 'program' may be null)
    return {
        sourceFiles: filterSourceFiles(inputFiles, program.getSourceFiles()),
        checker: program.getTypeChecker()
    };
}
