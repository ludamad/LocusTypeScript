/// <reference path="./harness.d.ts"/>
require('./harness');
Harness.lightMode = true;
function paramTest(varName, expectedKind) {
    var _a = mockCompile([("\n        function ParameterFunction(" + varName + ": declare DeclaredParamType) {\n            " + varName + ".x = 1;\n            " + varName + ".y = 1;\n        }")
    ]), rootNode = _a.sourceFiles[0], checker = _a.checker;
    var x, y;
    var getFlowMembersAtLocation = checker.getFlowMembersAtLocation, typeToString = checker.typeToString, getFinalFlowMembers = checker.getFinalFlowMembers;
    //    let declareNode = find<ts.DeclareTypeNode>(rootNode, ({kind}) => kind === ts.SyntaxKind.DeclareType);
    var propertyAcceses = find(rootNode, function (_a) {
        var kind = _a.kind;
        return kind === 175 /* PropertyAccessExpression */;
    });
    var varRefs = findForEach(propertyAcceses, function (_a) {
        var kind = _a.kind;
        return kind === expectedKind;
    });
    var flowMemberSets = varRefs.map(getFlowMembersAtLocation);
    assert(flowMemberSets[0] && flowMemberSets[1], "getFlowMembersAtLocation should never return null!");
    (_b = flowMemberSets[0], x = _b.x, y = _b.y, _b);
    assert(!x && !y, "Incorrect members before first assignment.");
    (_c = flowMemberSets[1], x = _c.x, y = _c.y, _c);
    assert(x && !y, "Incorrect members before second assignment.");
    var _b, _c;
    // let firstInstanceType = checker.getTypeAtLocation(firstInstanceOfParam);
    // assert(!checker.isTypeAny(firstInstanceType), "Type of parameter should not resolve to 'any'!");
    // let memberSet = checker.getFlowMembersAtLocation(xAssignment);
    // assert(memberSet)
    // console.log(ts.flowMemberSetToString(checker, memberSet));
    //ts.printNodeDeep(rootNode);
    //console.log(checker.typeToString((checker.getTypeAtLocation(func))));
}
describe("DeclareTypeNode in parameter", function () {
    //    it("'this' pseudo-parameter test", () => {
    //        paramTest("this", ts.SyntaxKind.ThisKeyword);
    //    });
    it("'this' pseudo-parameter test", function () {
        paramTest("this", 105 /* ThisKeyword */);
    });
    it("parameter test", function () {
        paramTest("param", 76 /* Identifier */);
    });
});
function findFirst(node, filter) {
    var first = find(node, filter)[0];
    return first;
}
function findForEach(nodes, filter) {
    return nodes.map(function (node) { return findFirst(node, filter); });
}
function find(node, filter) {
    assert(node);
    var ret = [];
    function collectRecursively(node) {
        // Unsafe cast, don't use members beyond Node in filter 
        // unless type has been discriminated:
        if (filter(node)) {
            ret.push(node);
        }
        ts.forEachChild(node, collectRecursively);
    }
    collectRecursively(node);
    return ret;
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
