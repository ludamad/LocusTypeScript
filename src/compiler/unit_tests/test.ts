/// <reference path="./harness.d.ts"/>
require('./harness'); 

Harness.lightMode = true;

function paramTest(paramName: string, expectedKind: number) {
    let {sourceFiles: [rootNode], checker} = mockCompile([`
        function ParameterFunction(${paramName}: declare DeclaredParamType) {
            ${paramName}.x = 1;
            ${paramName}.y = 1;
        }`
    ]);

//    let declareNode = find<ts.DeclareTypeNode>(rootNode, ({kind}) => kind === ts.SyntaxKind.DeclareType);

    let firstInstanceOfParam = find<ts.Node>(rootNode,
        ({kind, parent}) => kind === expectedKind &&
            parent !== null && 
            (<any>parent).kind === ts.SyntaxKind.PropertyAccessExpression
    );
    assert(firstInstanceOfParam, "Did not find '"+paramName+"' node");
    let firstInstanceType = checker.getTypeAtLocation(firstInstanceOfParam);
    assert(!checker.isTypeAny(firstInstanceType), "Type of parameter should not resolve to 'any'!");
    let memberSet = checker.scanAssignedMemberTypes(firstInstanceOfParam);
    console.log(ts.flowMemberSetToString(checker, memberSet));
    //ts.printNodeDeep(rootNode);
    //console.log(checker.typeToString((checker.getTypeAtLocation(func))));
}

describe("DeclareTypeNode in parameter", () => {
//    it("'this' pseudo-parameter test", () => {
//        paramTest("this", ts.SyntaxKind.ThisKeyword);
//    });
    it("parameter test", () => {
        paramTest("param", ts.SyntaxKind.Identifier);
    });
});

/* Helper functions: */

type Filter<T extends ts.Node> = (node: T) => boolean;
function find<T extends ts.Node>(node: ts.Node, filter: Filter<T>): ts.Node {
    assert(node);
    function iter(node: ts.Node): T {
        // Unsafe cast, don't use members beyond Node in filter 
        // unless type has been discriminated:
        if (filter(<T>node)) return <T>node;
        return <T>ts.forEachChild(node, iter);
    }
    return iter(node);
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

