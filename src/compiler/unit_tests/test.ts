/// <reference path="./harness.d.ts"/>
require('./harness'); 

Harness.lightMode = true;

describe("getPropertyOfType", () => {
    let sourceText = `var foo: declare Foo = {};
        foo.x = 1;
        foo.y = 1;
        /*foo*/ foo;`;
    let {rootNode: sourceFile, checker} = compileOne(sourceText);
    findWithComment(sourceFile, "foo", ts.isExpression).map(checker.getTypeAtLocation).forEach(testFooPropertiesAreXAndY);
    return;
    // Where:
    function testFooPropertiesAreXAndY(ref) {
        it("testFooPropertiesAreXAndY", () => {
            assert(!!checker.getPropertyOfType(ref, 'x'),
                "getPropertyOfType('x')");
            assert(!!checker.getPropertyOfType(ref, 'y'),
                "getPropertyOfType('y')");
            assert(checker.getPropertiesOfType(ref).length === 2,
                "getPropertiesOfType()");
        });
    }
});


// use ./run.sh 'brand i'
describe("emitBrandInterface", () => {
    let implicitSource = `var bar: declare Bar = {};
        var foo: declare Foo = bar;
        foo.x = 1;
        foo.y = 1;
        /*foo*/ foo;`;

    let explicitSource = implicitSource + `\nbrand interface Foo {
    x: !number;
}`;
    // TODO organize this better:
    it("should emit brand interface with x and y", () => {
        let {rootNode: sourceFile, checker} = compileOne(implicitSource);
        let [ref] = findWithComment(sourceFile, "foo", ts.isExpression);
        let {replaceText, replaceSpan} = checker.getBrandInterfaceRefactorData(ref);
        console.log(replaceText);
        assert(replaceSpan.start === 0);
    });

    // TODO organize this better:
    it("should update brand interface with x and y", () => {
        let {rootNode: sourceFile, checker} = compileOne(explicitSource);
        let [ref] = findWithComment(sourceFile, "foo", ts.isExpression);
        let {replaceText, replaceSpan} = checker.getBrandInterfaceRefactorData(ref);
        console.log(replaceText);
        assert(replaceSpan.length == 40);
    });
});

describe("Nominal this", () => {
    let sourceText = `function Foo(this: declare Foo) {
        /* first */ /*x*/ (this.x); 
        this.y = 1;
        /*y*/ (this.y);
        /*x*/ (this.x);
    }
    Foo.prototype.x = 1;
    function useFoo() {
        var foo = new Foo();
        /*x*/ (foo.x);
        /*x*/ (Foo.prototype.x);
        /*y*/ (foo.y);
    }
    `;
    let {rootNode: sourceFile, checker} = compileOne(sourceText);
    findWithComment(sourceFile, "x", ts.isExpression).forEach(testRefIsNumber);
    findWithComment(sourceFile, "y", ts.isExpression).forEach(testRefIsNumber);
    return;
    // Where:
    function testRefIsNumber(ref) {
        it(`"${sourceFile.text.substring(ref.pos, ref.end).trim()}" @${ts.nodePosToString(ref)} should be a !number`, () => {
            let type = checker.getTypeAtLocation(ref);
            let strippedType = checker.unconcrete(type);
            assert(strippedType.flags & ts.TypeFlags.NumberLike,
                "Not a number, was " + checker.typeToString(type)
            );
            assert(type !== strippedType, "Should be concrete, was " + checker.typeToString(type));
        });
    }
});

describe("Compilation tests", () => {
    it ("simple becomes", () => {
        let sourceText = `function test(funcParam: becomes {x: number}) {
            funcParam.x = 1;
        }
        `;

        let {rootNode, checker} = compileOne(sourceText);
    });
    it ("brand interface", () => {
        let sourceText = `brand interface Foo {
            x: number;
            y: number;
        }
        
        function foo(obj: !Foo) {
            /*x*/ (obj.x);
            /*y*/ (obj.y);
        }`;

        let {rootNode, checker} = compileOne(sourceText);
        let [objXRefType] = findWithComment(rootNode, "x", ts.isExpression)
            .map(checker.getTypeAtLocation);
        let [objYRefType] = findWithComment(rootNode, "y", ts.isExpression)
            .map(checker.getTypeAtLocation);

        assert(objXRefType.flags & ts.TypeFlags.NumberLike, "should have x : number");
        assert(objYRefType.flags & ts.TypeFlags.NumberLike, "should have y : number");
    });
});

describe("Calling functions mutually recursive", () => {
    it("should test mutually recursive functions", () => {
        function smartPrint(object, name) {
            console.log("<V" + name + "V>");
            if (object != null && object.kind) {
                ts.printNodeDeep(object);
            }
            else if (object != null && object.flags) {
                console.log(checker.typeToString(object));
            }
            else {
                console.log(object);
            }
            console.log("<*" + name + "*>");
        }
 
        let sourceText = `
            function Foo(foo : declare Foo) {
                foo.barMember = Bar({});
                foo.field1 = 1;
                /*Lookup*/ (foo.barMember.field2);
                /*After*/ foo;
                return foo;
            }
            function Bar(bar : declare Bar) {
                bar.fooMember = Foo({});
                bar.field2 = 1;
                /*Lookup*/ (bar.fooMember.field1);
                /*After*/ bar;
                return bar;
            }
        `;
        
        var {rootNode, checker} = compileOne(sourceText);
        let [type1, type2] = findWithComment(rootNode, "Lookup", ts.isExpression)
            .map(checker.getTypeAtLocation);
        let [lastRefType1, lastRefType2] = findWithComment(rootNode, "After", ts.isExpression)
            .map(checker.getTypeAtLocation);
        smartPrint(type1, "type1");
        smartPrint(type2, "type2");
        smartPrint(lastRefType1, "lastRefType1");
        smartPrint(lastRefType2, "lastRefType2");
        assert(checker.getPropertyOfType(lastRefType1, "field1"), "Should have 'field1' member.");
        assert(checker.getPropertyOfType(lastRefType1, "barMember"), "Should have 'barMember' member.");
        assert(!checker.getPropertyOfType(lastRefType1, "control"), "Should not have 'control' member.!");
        assert(checker.getPropertyOfType(lastRefType2, "fooMember"), "Should have 'fooMember' member.");
        assert(checker.unconcrete(type1).flags & ts.TypeFlags.NumberLike, "foo.barMember.field2 should be of type number");
        assert(checker.unconcrete(type2).flags & ts.TypeFlags.NumberLike, "bar.fooMember.field1 should be of type number");
    });
});


describe("Calling functions with a declare parameter", () => {
    function callFunctionWithDeclareParameter(context, varName: string, expectedKind: number) {
        let calledFunction = `function calledFunction(funcParam: declare DeclaredType1) {
            funcParam.x = 1;
            funcParam.y = 1;
            funcParam;
        `;
        
        let referrer = context(varName, "DeclaredType2", `
            calledFunction(${varName});
            ${varName};
        `)
        let {rootNode, checker} = compileOne(calledFunction + referrer);
        let callNode = findFirst(rootNode, ts.SyntaxKind.CallExpression);
        if (expectedKind === ts.SyntaxKind.Identifier) {
            var reference = findFirst(callNode, ({text}:any) => text === varName);
            var refAfter = findFirst(rootNode, ({text, pos}:any) => text === varName && pos > reference.pos);
        } else {
            var reference = findFirst(callNode, expectedKind);
            var refAfter = findFirst(rootNode, ({kind, pos}) => kind === expectedKind && pos > reference.pos);
        }
        let typeAfter = checker.getTypeAtLocation(refAfter);
        console.log(checker.typeToString(typeAfter))
        assert(!!(checker.unconcrete(typeAfter).flags & ts.TypeFlags.Locus), "Should resolve to locus type!");
        console.log(checker.getBaseTypes(<any>checker.unconcrete(typeAfter)).map(<any>checker.typeToString))
        assert(checker.getPropertyOfType(typeAfter, "x"), "Does not have 'x' member.");
        assert(checker.getPropertyOfType(typeAfter, "y"), "Does not have 'y' member.");
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

// TODO test ensure variable not assignable
describe("Type relations of ConcreteTypeScript", () => {

    it("DTRTB: test relationships for Locus types related through 'becomes'", () => {
        let varName = 'variable';
        let {checker, rootNode} = compileOne(becomesSource(varName));
        let nodes = findWithComment(rootNode, "Member1Ref", ts.isExpression)
        for (let node of nodes) ts.printNodeDeep(node);
        let refTypes:ts.Type[] = <ts.Type[]>findWithComment(rootNode, "Member1Ref", ts.isExpression)
            .map(checker.getTypeAtLocation)
            .map(checker.unconcrete);
        let idTypes = findWithComment(rootNode, "Member1Ref", ts.isExpression)
            .map(n => findFirst(n, ({text}:any) => text && !!text.match(varName)))
            .map(checker.getTypeAtLocation)
        console.log(idTypes.map(<any>checker.typeToString));
        assert(refTypes[0].flags & ts.TypeFlags.NumberLike, "Type 1 inherited through becomes relationship should be a number!");
        assert(refTypes[1].flags & ts.TypeFlags.NumberLike, "Type 2 inherited through becomes relationship should be a number!");
    });

    it("test relationships for IntermediateFlowType's and their parts", () => {
        let {checker, declType1, intermType1} = getLocusTypes(disjointSource);
        let targetType1 = (<ts.IntermediateFlowType>intermType1).targetType;
        let startingType1 = (<ts.IntermediateFlowType>intermType1).flowData.flowTypes[0].type;
        let {isTypeIdenticalTo, checkTypeSubtypeOf, checkTypeAssignableTo} = checker;
        assert(checkTypeAssignableTo(intermType1, startingType1, undefined), "Should be assignable to starting type!");
        assert(checkTypeAssignableTo(targetType1, startingType1, undefined), "Should be assignable to starting type!");
        // Make sure that our intermediate result is not reassignable, as this would invalidate analysis:
        assert(!checkTypeAssignableTo(targetType1, intermType1, undefined), "Should not be assignable to starting type!");
        assert(!checkTypeAssignableTo(startingType1, intermType1, undefined), "Should not be assignable from starting type!");
    });


    it("test relationships for disjoint Locus-types", () => {
        let {checker, declType1, declType2} = getLocusTypes(disjointSource);
        let {isTypeIdenticalTo, checkTypeSubtypeOf, checkTypeAssignableTo} = checker;
        assert(!isTypeIdenticalTo(declType1, declType2));
        assert(!isTypeIdenticalTo(declType2, declType1));
        assert(!checkTypeSubtypeOf(declType1, declType2, undefined));
        assert(!checkTypeSubtypeOf(declType2, declType1, undefined));
        assert(!checkTypeAssignableTo(declType1, declType2, undefined));
        assert(!checkTypeAssignableTo(declType2, declType1, undefined));
    });

    it("test relationships for 'Decl1 declare Decl2' Declare-types", () => {
        let {checker, declType1, declType2} = getLocusTypes(impliedBaseSource);
        let {getBaseTypes, isTypeIdenticalTo, checkTypeSubtypeOf, checkTypeAssignableTo} = checker;
        let [baseType] = getBaseTypes(<ts.InterfaceType> declType2);
        assert(checker.unconcrete(baseType) === declType1, "Base type should be declType1");
        assert(!isTypeIdenticalTo(declType1, declType2), "Types should not be identical");
        assert(!isTypeIdenticalTo(declType2, declType1), "Types should not be identical");
        assert(checkTypeSubtypeOf(declType2, declType1, undefined), "declType2 should be a subtype of declType1");
        assert(!checkTypeSubtypeOf(declType1, declType2, undefined));
        assert(!checkTypeAssignableTo(declType1, declType2, undefined));
        assert(checkTypeAssignableTo(declType2, declType1, undefined));
    });

    return;
    function impliedBaseSource(varName) {
        return `
            var ${varName}1 : declare DeclareType1 = {};
            ${varName}1.member1 = "string";
            var ${varName}2 : DeclareType1 declare DeclareType2 = ${varName}1;
            ${varName}2.member2 = "string";
        `;
    }

    function becomesSource(varName) {
        return `
            function becomeFoo1(${varName}1: declare Foo1): void {
                ${varName}1.member1 = 1;
            }
            function Foo2(${varName}2 : declare Foo2): void {
                becomeFoo1(${varName}2);
                /*Member1Ref*/ (${varName}2.member1);
                ${varName}2.member2 = 1;
                /*Member1Ref*/ (${varName}2.member1);
            }
        `;
    }
    function disjointSource(varName) {
        return `
            var ${varName}1 : declare DeclareType1 = {};
            var ${varName}2 : declare DeclareType2 = {};
            ${varName}1.member = "string";
            ${varName}2.member = "string";
        `;
    }
    function getLocusTypes(source) {
        const varName = "simpleBindingVar";
        let sourceText = source(varName);
        let {rootNode, checker} = compileOne(sourceText);
        let [varNode1, varNode2] = getVarRefs();

        return {checker, 
            rootNode,
            intermType1: getIntermediateType(varNode1), 
            intermType2: getIntermediateType(varNode2), 
            declType1: getDeclType(varNode1), 
            declType2: getDeclType(varNode2)
        };

        function getVarRefs() : ts.Node[] {
            return [
                findFirst(rootNode, ({text}:any) => text === `${varName}1`),
                findFirst(rootNode, ({text}:any) => text === `${varName}2`)
            ];
        }
        // Will not depend on whether resolves correctly:
        function getDeclType(node:ts.Node) {
            let type = getIntermediateType(node);
            let declType = checker.unconcrete((<ts.IntermediateFlowType>type).targetType);
            assert(!!(declType.flags & ts.TypeFlags.Locus), "getDeclType failure");
            return declType;
        }
        function getIntermediateType(node:ts.Node) {
            let intermediate = checker.getTypeAtLocation(node);
            assert(!!(intermediate.flags & ts.TypeFlags.IntermediateFlow), "getIntermediateType failure");
            return intermediate;
        }
    }

});

describe("The stages of binding", () => {
    it("Should test the stages of locus-type binding", () => {
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
                assert(targetTypeNode.kind === ts.SyntaxKind.LocusType, "Should resolve to locus type");
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
            let {flowData} = <ts.IntermediateFlowType>refType;
            let {memberSet: {objProp1, objProp2}} = flowData;
            assert(objProp1 && objProp2, "Should bind members from object literal.");
        }

        function assertHasXAndY() {
            let targetType = getTargetType();
            if (!useBecomes) {
                assert(checker.unconcrete(targetType).flags & ts.TypeFlags.Locus, "Resulting type should have Locus");
            }
            assert(checker.getPropertyOfType(targetType, "x"), "Target type should have 'x' attribute");
            assert(checker.getPropertyOfType(targetType, "y"), "Target type should have 'y' attribute");
            let refType = checker.getTypeAtLocation(getLastVarRef())
            //console.log(checker.getFlowDataAtLocation(getLastVarRef(), refType));
            assert(checker.getPropertyOfType(refType, "x"), "Should infer 'x' attribute");
            assert(checker.getPropertyOfType(refType, "y"), "Should infer 'y' attribute");
        }

        function assertLastRefIsTargetType() {
            let refType = checker.getTypeAtLocation(getLastVarRef())
            console.log("WHATasda" + checker.typeToString(refType));
            console.log("//WHATasda" + checker.typeToString(refType));
            assert(checker.checkTypeSubtypeOf(refType, getTargetType(), undefined),
                    "last ref should be target type!");
        }
    }

});

describe("Simple sequential assignments", () => {
    function basicAssignmentTest(context, varName: string, expectedKind: number) {
        let sourceText = context(varName, "DeclaredType", `
            /*Before*/ ${varName};
            ${varName}.x = 1;
            ${varName}.y = 1;
        `);
        
        let {rootNode, checker} = compileOne(sourceText);
        let [before] = findWithComment(rootNode, "Before", expectedKind);
        let [xAssign, yAssign] = find(rootNode, ts.SyntaxKind.PropertyAccessExpression);

        let varType = checker.getTypeAtLocation(before);
        assert(!!(<ts.IntermediateFlowType>varType).targetType, "Must be IntermediateFlowType with targetType");
        let {memberSet: {x: x0, y: y0}} = checker.getFlowDataAtLocation(before, varType);
        let {memberSet: {x: x1, y: y1}} = checker.getFlowDataAtLocation(findFirst(xAssign, expectedKind), varType);
        let {memberSet: {x: x2, y: y2}} = checker.getFlowDataAtLocation(findFirst(yAssign, expectedKind), varType);
        let {memberSet: {x: x3, y: y3}} = checker.getFlowDataForType((<ts.IntermediateFlowType>varType).targetType);

        assert(!x0 && !y0, "Incorrect members before first assignment.");
        assert( x1 && !y1, "Incorrect members during first assignment.");
        assert( x2 &&  y2, "Incorrect members during second assignment.");
        assert( x3 &&  y3, "Incorrect members after second assignment.");
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
function findWithComment(rootNode: ts.Node, label:string, filter:Filter): ts.Node[] {
    return find(rootNode, (node) => {
        if (typeof filter === "number" ? node.kind === filter : filter(node)) {
            let sourceFile = ts.getSourceFileOfNode(node);
            let leadingCommentRanges = ts.getLeadingCommentRanges(sourceFile.text, node.pos) ;
            if (!leadingCommentRanges) return false;
            let comments = leadingCommentRanges.map(({pos, end}) => sourceFile.text.substring(pos, end));
            for (let comment of comments) {
                if (comment.match(label)) {
                    return true;
                }
            }
        }
        return false;
    });
}
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

