/// <reference path="./harness.d.ts"/>
require('./harness'); 

Harness.lightMode = true;

describe("Suite", () => {
    it("Test", () => {
        let {sourceFiles: [rootNode], checker} = mockCompile([`
            function ParameterFunction(param: declare DeclaredParamType) {
                param.x = 1;
                param.y = 1;
            }`
        ]);

        let declareNode = find<ts.DeclareTypeNode>(rootNode, ({kind}) => kind === ts.SyntaxKind.DeclareType);
        ts.printNodeDeep(declareNode);
        return;

        let firstThisNode = find<ts.Node>(rootNode,
            ({kind, parent}) => kind === ts.SyntaxKind.ThisKeyword &&
                parent != null && 
                (<any>parent).kind === ts.SyntaxKind.PropertyAccessExpression
        );
        let memberSet = checker.scanAssignedMemberTypes(firstThisNode);
        console.log(memberSet);
        //ts.printNodeDeep(rootNode);
        //console.log(checker.typeToString((checker.getTypeAtLocation(func))));
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
    console.log(inputFiles);
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

