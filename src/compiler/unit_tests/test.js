/// <reference path="./harness.d.ts"/>
require('./harness');
Harness.lightMode = true;
describe("Calling functions with a declare parameter", function () {
    function callFunctionWithDeclareParameter(context, varName, expectedKind) {
        var calledFunction = "function calledFunction(funcParam: declare DeclaredType1) {\n            funcParam.x = 1;\n            funcParam.y = 1;\n            funcParam;\n        ";
        var referrer = context(varName, "DeclaredType2", "\n            calledFunction(" + varName + ");\n        ");
        var _a = compileOne(calledFunction + referrer), rootNode = _a.rootNode, checker = _a.checker;
        var callNode = findFirst(rootNode, 177 /* CallExpression */);
        if (expectedKind === 76 /* Identifier */) {
            var reference = findFirst(callNode, function (_a) {
                var text = _a.text;
                return text == varName;
            });
        }
        else {
            var reference = findFirst(callNode, expectedKind);
        }
        ts.printNodeDeep(reference);
        var _b = checker.getFinalFlowMembers(reference), x = _b.x, y = _b.y;
        assert(x && y, "Does not have 'x' and 'y' members.");
    }
    it("should bind through function call for a 'this' parameter", function () {
        callFunctionWithDeclareParameter(parameterFunctionContext, "this", 105 /* ThisKeyword */);
    });
    it("should bind through function call for a normal parameter", function () {
        callFunctionWithDeclareParameter(parameterFunctionContext, "testVar", 76 /* Identifier */);
    });
    it("should bind x and y to a 'var'-declared variable", function () {
        callFunctionWithDeclareParameter(varContext, "testVar", 76 /* Identifier */);
    });
    it("should bind x and y to a 'let'-declared variable", function () {
        callFunctionWithDeclareParameter(letContext, "testVar", 76 /* Identifier */);
    });
});
// TODO test getting the resolved members of an intermediate flow type
/*describe("Various resolution points", () => {
    it("", () => {
        
    });
});*/
describe("The stages of binding", function () {
    it("Should test the stages of binding", function () {
        var varName = "simpleBindingVar";
        var sourceText = "\n            var " + varName + " : declare DeclareType = {objProp1: 1, objProp2: \"string\"};\n            " + varName + ";\n            " + varName + ".x = 1;\n            " + varName + ".y = \"string\";\n            " + varName + ";\n        ";
        var _a = compileOne(sourceText), rootNode = _a.rootNode, checker = _a.checker;
        assertHasXAndY();
        assertLastRefIsDeclType();
        assert2ndRefHasBecomeTypeAndObjectLiteralElements();
        return;
        function getDeclType() {
            var varNode = findFirst(rootNode, 220 /* VariableDeclaration */);
            var declTypeNode = varNode.type;
            assert(declTypeNode.kind === 6 /* DeclareType */, "Should resolve to declare type");
            var intermediateType = checker.getTypeFromTypeNode(declTypeNode);
            assert(intermediateType.flags & 536870912 /* IntermediateFlow */, "Resulting type should have IntermediateFlow");
            var declType = intermediateType.targetType;
            return declType;
        }
        function get2ndVarRef() {
            var varRefs = find(rootNode, function (_a) {
                var text = _a.text;
                return text === varName;
            });
            ts.Debug.assert(varRefs.length >= 1);
            return varRefs[1];
        }
        function getLastVarRef() {
            var varRefs = find(rootNode, function (_a) {
                var text = _a.text;
                return text === varName;
            });
            ts.Debug.assert(varRefs.length >= 1);
            return varRefs[varRefs.length - 1];
        }
        function assert2ndRefHasBecomeTypeAndObjectLiteralElements() {
            var refType = checker.getTypeAtLocation(get2ndVarRef());
            assert(refType.flags & 536870912 /* IntermediateFlow */, "Resulting type should have IntermediateFlow");
            var flowMemberSet = refType.flowMemberSet;
            var objProp1 = flowMemberSet.objProp1, objProp2 = flowMemberSet.objProp2;
            console.log({ objProp1: objProp1, objProp2: objProp2 });
            assert(objProp1 && objProp2, "Should bind members from object literal.");
        }
        function assertHasXAndY() {
            var declType = getDeclType();
            assert(declType.flags & 268435456 /* Declare */, "Resulting type should have Declare");
            assert(checker.getPropertyOfType(declType, "x"), "Should infer 'x' attribute");
            assert(checker.getPropertyOfType(declType, "y"), "Should infer 'y' attribute");
        }
        function assertLastRefIsDeclType() {
            var refType = checker.getTypeAtLocation(getLastVarRef());
            console.log("WHATasda" + checker.typeToString(refType));
            assert(checker.isTypeIdenticalTo(getDeclType(), refType), "last ref should be decl type!");
        }
    });
});
describe("Simple sequential assignments", function () {
    function basicAssignmentTest(context, varName, expectedKind) {
        var sourceText = context(varName, "DeclaredType", "\n            " + varName + ".x = 1;\n            " + varName + ".y = 1;\n        ");
        var _a = compileOne(sourceText), rootNode = _a.rootNode, checker = _a.checker;
        var _b = find(rootNode, 175 /* PropertyAccessExpression */), xAssign = _b[0], yAssign = _b[1];
        var _c = checker.getFlowMembersAtLocation(findFirst(xAssign, expectedKind)), x1 = _c.x, y1 = _c.y;
        var _d = checker.getFlowMembersAtLocation(findFirst(yAssign, expectedKind)), x2 = _d.x, y2 = _d.y;
        var _e = checker.getFinalFlowMembers(findFirst(xAssign, expectedKind)), xFinal = _e.x, yFinal = _e.y;
        assert(!x1 && !y1, "Incorrect members before first assignment.");
        assert(x2 && !y2, "Incorrect members before second assignment.");
        assert(xFinal && yFinal, "Incorrect members before second assignment.");
    }
    it("should bind x and y to a 'this' parameter", function () {
        basicAssignmentTest(parameterFunctionContext, "this", 105 /* ThisKeyword */);
    });
    it("should bind x and y to a normal parameter", function () {
        basicAssignmentTest(parameterFunctionContext, "testVar", 76 /* Identifier */);
    });
    it("should bind x and y to a 'var'-declared variable", function () {
        basicAssignmentTest(varContext, "testVar", 76 /* Identifier */);
    });
    it("should bind x and y to a 'let'-declared variable", function () {
        basicAssignmentTest(letContext, "testVar", 76 /* Identifier */);
    });
});
function findFirst(node, filter) {
    var first = find(node, filter)[0];
    assert(first != null, "findFirst should not fail!");
    return first;
}
function find(node, filter) {
    assert(node);
    var ret = [];
    function collectRecursively(node) {
        // Unsafe cast, don't use members beyond Node in filter 
        // unless type has been discriminated:
        if (typeof filter === "number" ? node.kind === filter : filter(node)) {
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
function compileOne(inputContent, options) {
    if (options === void 0) { options = {}; }
    var _a = compile([inputContent], options), rootNode = _a.sourceFiles[0], checker = _a.checker;
    return { rootNode: rootNode, checker: checker };
}
function compile(inputContents, options) {
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
function parameterFunctionContext(varName, typeName, body) {
    return "function parameterFunction(" + varName + ": declare " + typeName + ") {\n        " + body + "\n    }";
}
function varContext(varName, typeName, body) {
    return "\n        var " + varName + ": declare " + typeName + " = {};\n        " + body + "\n    ";
}
function letContext(varName, typeName, body) {
    return "\n        let " + varName + ": declare " + typeName + " = {};\n        " + body + "\n    ";
}
//# sourceMappingURL=test.js.map