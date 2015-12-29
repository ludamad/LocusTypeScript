/// <reference path="./harness.d.ts"/>
require('./harness'); 

Harness.lightMode = true;

function paramTest(varName: string, expectedKind: number) {
    let {sourceFiles: [rootNode], checker} = mockCompile([`
        function ParameterFunction(${varName}: declare DeclaredParamType) {
            ${varName}.x = 1;
            ${varName}.y = 1;
        }`
    ]);
    let x, y;
    let {getFlowMembersAtLocation, typeToString, getFinalFlowMembers} = checker;
//    let declareNode = find<ts.DeclareTypeNode>(rootNode, ({kind}) => kind === ts.SyntaxKind.DeclareType);
    let propertyAcceses = find<ts.Node>(rootNode, ({kind}) => kind === ts.SyntaxKind.PropertyAccessExpression);
    let varRefs = findForEach<ts.Node>(propertyAcceses, ({kind}) => kind === expectedKind);
    let flowMemberSets = varRefs.map(getFlowMembersAtLocation);
    assert(flowMemberSets[0] && flowMemberSets[1], "getFlowMembersAtLocation should never return null!");
    ({x, y} = flowMemberSets[0]);
    assert(!x && !y, "Incorrect members before first assignment.");
    ({x, y} = flowMemberSets[1]);
    assert(x && !y, "Incorrect members before second assignment.");
    
    // let firstInstanceType = checker.getTypeAtLocation(firstInstanceOfParam);
    // assert(!checker.isTypeAny(firstInstanceType), "Type of parameter should not resolve to 'any'!");
    // let memberSet = checker.getFlowMembersAtLocation(xAssignment);
    // assert(memberSet)
    // console.log(ts.flowMemberSetToString(checker, memberSet));
    //ts.printNodeDeep(rootNode);
    //console.log(checker.typeToString((checker.getTypeAtLocation(func))));
}

describe("DeclareTypeNode in parameter", () => {
//    it("'this' pseudo-parameter test", () => {
//        paramTest("this", ts.SyntaxKind.ThisKeyword);
//    });
    it("'this' pseudo-parameter test", () => {
        paramTest("this", ts.SyntaxKind.ThisKeyword);
    });
    it("parameter test", () => {
        paramTest("param", ts.SyntaxKind.Identifier);
    });
});

/* Helper functions: */

type Filter<T extends ts.Node> = (node: T) => boolean;
function findFirst<T extends ts.Node>(node: ts.Node, filter: Filter<T>): T {
    let [first] = find<T>(node, filter);
    return first;
}
function findForEach<T extends ts.Node>(nodes: ts.Node[], filter: Filter<T>): T[] {
    return nodes.map(node => findFirst<T>(node, filter));
}
function find<T extends ts.Node>(node: ts.Node, filter: Filter<T>): T[] {
    assert(node);
    let ret:T[] = [];
    function collectRecursively(node: ts.Node) {
        // Unsafe cast, don't use members beyond Node in filter 
        // unless type has been discriminated:
        if (filter(<T>node)) {
            ret.push(<T>node);
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

function mockCompile(inputContents: string[], options: ts.CompilerOptions & Harness.Compiler.HarnessOptions = {}) {
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

