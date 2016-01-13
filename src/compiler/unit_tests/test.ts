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
        console.log("WHUT");
        console.log(""+checker.getFinalFlowMembers);
        let {x, y} = checker.getFinalFlowMembers(reference);
        console.log("WAT");
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

describe("Simple binding", () => {
    it("Should return x and y when getPropertiesOfObjectType called", () => {
        const varName = "simpleBindingVar";
        let sourceText = `
            var ${varName} : declare DeclareType = {};
            ${varName}.x = 1;
            ${varName}.y = 1;
        `;
        
        let {rootNode, checker} = compileOne(sourceText);
        let varNode = <ts.VariableLikeDeclaration> findFirst(rootNode, ts.SyntaxKind.VariableDeclaration);
        let declTypeNode = varNode.type;
        assert(declTypeNode.kind === ts.SyntaxKind.DeclareType, "Should resolve to declare type");
        let intermediateType = checker.getTypeFromTypeNode(declTypeNode);
        assert(intermediateType.flags & ts.TypeFlags.IntermediateFlow, "Resulting type should have IntermediateFlow");
        let declType = (<ts.IntermediateFlowType> intermediateType).targetType;
        assert(declType.flags & ts.TypeFlags.Declare, "Resulting type should have Declare");
        console.log(checker.getPropertiesOfType(declType));
        assert(checker.getPropertyOfType(declType, "x"), "Should infer 'x' attribute");
        assert(checker.getPropertyOfType(declType, "y"), "Should infer 'y' attribute");
    });
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

