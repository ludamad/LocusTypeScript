/// <reference path="./harness.d.ts"/>
require('./harness'); 

Harness.lightMode = true;

describe("Calling functions with a declare parameter", () => {
    function callFunctionWithDeclareParameter(context, varName: string, expectedKind: number) {
        let calledFunction = `function calledFunction(funcParam: declare DeclaredType1) {
            funcParam.x = 1;
            funcParam.y = 1;
            funcParam;
        `;
        
        let referrer = context(varName, "DeclaredType2", `
            calledFunction(${varName});
        `)
        let {rootNode, checker} = compileOne(calledFunction + referrer);
        let callNode = findFirst(rootNode, ts.SyntaxKind.CallExpression);
        if (expectedKind === ts.SyntaxKind.Identifier) {
            var reference = findFirst(callNode, ({text}:any) => text == varName);
        } else {
            var reference = findFirst(callNode, expectedKind);
        }
        ts.printNodeDeep(reference);
        let {x, y} = checker.getFinalFlowMembers(reference);
        assert(x && y, "Does not have 'x' and 'y' members.");
    }

    it("should bind through function call for a 'this' parameter", () => {
        callFunctionWithDeclareParameter(parameterFunctionContext, "this", ts.SyntaxKind.ThisKeyword);
    });
    it("should bind through function call for a normal parameter", () => {
        callFunctionWithDeclareParameter(parameterFunctionContext, "testVar", ts.SyntaxKind.Identifier);
    });
    it("should bind x and y to a 'var'-declared variable", () => {
        callFunctionWithDeclareParameter(varContext, "testVar", ts.SyntaxKind.Identifier);
    });
    it("should bind x and y to a 'let'-declared variable", () => {
        callFunctionWithDeclareParameter(letContext, "testVar", ts.SyntaxKind.Identifier);
    });
});

// TODO test getting the resolved members of an intermediate flow type

/*describe("Various resolution points", () => {
    it("", () => {
        
    });
});*/

describe("The stages of binding", () => {
    it("Should test the stages of declare-type binding", () => {
        testBindingStages(/*Do not use becomes*/ false);
    });

    it("Should test the stages of becomes-type binding", () => {
        testBindingStages(/*Use becomes*/ true);
    });
    return;
    function testBindingStages(useBecomes:boolean) {
        const varName = "simpleBindingVar";
        const varType = (useBecomes ? "becomes BecomesType" : "declare DeclareType");
        let sourceText = `
            interface BecomesType {
                objProp1: number; objProp2: string;
                x: number; y: string;
            }
            var ${varName} : ${varType} = {objProp1: 1, objProp2: "string"};
            ${varName};
            ${varName}.x = 1;
            ${varName}.y = "string";
            ${varName};
        `;

        let {rootNode, checker} = compileOne(sourceText);
        assertHasXAndY();
        assertLastRefIsTargetType();
        assert2ndRefHasBecomeTypeAndObjectLiteralElements();
        return;

        function getTargetType() : ts.Type {
            let varNode = <ts.VariableLikeDeclaration> findFirst(rootNode, ts.SyntaxKind.VariableDeclaration);
            let targetTypeNode = varNode.type;
            if (useBecomes) {
                assert(targetTypeNode.kind === ts.SyntaxKind.BecomesType, "Should resolve to becomes type");
            } else {
                assert(targetTypeNode.kind === ts.SyntaxKind.DeclareType, "Should resolve to declare type");
            }
            let intermediateType = checker.getTypeFromTypeNode(targetTypeNode);
            console.log(checker.typeToString(intermediateType))
            assert(intermediateType.flags & ts.TypeFlags.IntermediateFlow, "Resulting type should have IntermediateFlow");
            let targetType = (<ts.IntermediateFlowType> intermediateType).targetType;
            return targetType;
        }

        function get2ndVarRef() : ts.Node {
            let varRefs = find(rootNode, ({text}:any) => text === varName); 
            ts.Debug.assert(varRefs.length >= 1);
            return varRefs[1];
        }

        function getLastVarRef() : ts.Node {
            let varRefs = find(rootNode, ({text}:any) => text === varName); 
            ts.Debug.assert(varRefs.length >= 1);
            return varRefs[varRefs.length - 1];
        }

        function assert2ndRefHasBecomeTypeAndObjectLiteralElements() {
            let refType = checker.getTypeAtLocation(get2ndVarRef())
            console.log(checker.typeToString(refType));
            assert(refType.flags & ts.TypeFlags.IntermediateFlow, "Resulting type should have IntermediateFlow");
            let {flowMemberSet} = <ts.IntermediateFlowType>refType;
            let {objProp1, objProp2} = flowMemberSet;
            assert(objProp1 && objProp2, "Should bind members from object literal.");
        }

        function assertHasXAndY() {
            let targetType = getTargetType();
            if (!useBecomes) {
                assert(targetType.flags & ts.TypeFlags.Declare, "Resulting type should have Declare");
            }
            assert(checker.getPropertyOfType(targetType, "x"), "Should infer 'x' attribute");
            assert(checker.getPropertyOfType(targetType, "y"), "Should infer 'y' attribute");
        }

        function assertLastRefIsTargetType() {
            let refType = checker.getTypeAtLocation(getLastVarRef())
            console.log("WHATasda" + checker.typeToString(refType));
            assert(checker.isTypeIdenticalTo(getTargetType(), refType),
                    "last ref should be decl type!");
        }
    }

});

describe("Simple sequential assignments", () => {
    function basicAssignmentTest(context, varName: string, expectedKind: number) {
        let sourceText = context(varName, "DeclaredType", `
            ${varName}.x = 1;
            ${varName}.y = 1;
        `);
        
        let {rootNode, checker} = compileOne(sourceText);

        let [xAssign, yAssign] = find(rootNode, ts.SyntaxKind.PropertyAccessExpression);

        let {x: x1, y: y1} = checker.getFlowMembersAtLocation(findFirst(xAssign, expectedKind));
        let {x: x2, y: y2} = checker.getFlowMembersAtLocation(findFirst(yAssign, expectedKind));

        let {x: xFinal, y: yFinal} = checker.getFinalFlowMembers(findFirst(xAssign, expectedKind));

        assert(!x1 && !y1, "Incorrect members before first assignment.");
        assert(x2 && !y2, "Incorrect members before second assignment.");
        assert(xFinal && yFinal, "Incorrect members before second assignment.");
    }

    it("should bind x and y to a 'this' parameter", () => {
        basicAssignmentTest(parameterFunctionContext, "this", ts.SyntaxKind.ThisKeyword);
    });
    it("should bind x and y to a normal parameter", () => {
        basicAssignmentTest(parameterFunctionContext, "testVar", ts.SyntaxKind.Identifier);
    });
    it("should bind x and y to a 'var'-declared variable", () => {
        basicAssignmentTest(varContext, "testVar", ts.SyntaxKind.Identifier);
    });
    it("should bind x and y to a 'let'-declared variable", () => {
        basicAssignmentTest(letContext, "testVar", ts.SyntaxKind.Identifier);
    });
});

/* Helper functions: */

type Filter = ts.SyntaxKind | ((node: ts.Node) => boolean);
function findFirst(node: ts.Node, filter: Filter): ts.Node {
    let [first] = find(node, filter);
    assert(first != null, "findFirst should not fail!");
    return first;
}

function find(node: ts.Node, filter: Filter): ts.Node[] {
    assert(node);
    let ret:ts.Node[] = [];
    function collectRecursively(node: ts.Node) {
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

type HarnessFile = {unitName: string, content: string};
function filterSourceFiles(inputFiles:HarnessFile[], sourceFiles:ts.SourceFile[]) { 
    return sourceFiles.filter(({fileName}) => {
        for (let {unitName} of inputFiles) {
            if (unitName === fileName) {
                return true;
            }
        }
        return false;
    });
}

function compileOne(inputContent: string, options: ts.CompilerOptions & Harness.Compiler.HarnessOptions = {}) {
    let {sourceFiles: [rootNode], checker} = compile([inputContent], options);
    return {rootNode, checker};
}

function compile(inputContents: string[], options: ts.CompilerOptions & Harness.Compiler.HarnessOptions = {}) {
    let compilerResult = null;
    let harnessCompiler = Harness.Compiler.getCompiler();
    let nUnits = 0;
    let inputFiles: HarnessFile[] = inputContents.map(content => ({unitName: `simulated_file${++nUnits}.ts`, content}));
    let {program, emit} = harnessCompiler.createProgram(
        inputFiles,
        /* otherFiles: */ [],
        newCompilerResults => { compilerResult = newCompilerResults; },
        /*settingsCallback*/ undefined, options
    );

    // Rely on knowledge that the harness is not actually asynchronous (otherwise 'program' may be null)
    return {
        sourceFiles: filterSourceFiles(inputFiles, program.getSourceFiles()),
        checker: program.getTypeChecker()
    };
}

function parameterFunctionContext(varName: string, typeName: string, body: string) {
    return `function parameterFunction(${varName}: declare ${typeName}) {
        ${body}
    }`;
}

function varContext(varName: string, typeName: string, body: string) {
    return `
        var ${varName}: declare ${typeName} = {};
        ${body}
    `;
}

function letContext(varName: string, typeName: string, body: string) {
    return `
        let ${varName}: declare ${typeName} = {};
        ${body}
    `;
}

