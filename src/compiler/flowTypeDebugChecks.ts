/// <reference path="binder.ts"/>
/// <reference path="types.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="flowAnalysis.ts"/>

/// <reference path="brandTypeQueries.ts"/>
/// <reference path="ctsTypes.ts"/>


/* @internal */
namespace ts {
    interface PassArgs {
        passType:string;
        /* For checking pass: */
        checker:TypeChecker;
        /* For binding pass: */
    }
    
    export function debugPass(sourceFile: SourceFile, passArgs:PassArgs) {
        // Don't debug ambient declarations:
        if (sourceFile.fileName.indexOf(".d.ts") != -1) {
            return;
        }
        let {checker} = passArgs;
        let sourceText = sourceFile.text;
        pass(sourceFile);
        return;
        function pass(node:Node) {
            for (let annotation of getAnnotationsForNode(node)) {
                let args:string[] = annotation.split(" ");
                let funcName = args.shift();
                callMethod(node, funcName, args);
            }
            forEachChild(node, pass);
        }
        function getAnnotationsFromComment(range: CommentRange):string[] {
            let comment = sourceText.substring(range.pos, range.end);
            // Match strings within @{}, and drop the '@{}'.
            return (comment.match(/@\{[a-zA-Z0-9 !]+\}/g) || []).map(s => s.substring(2, s.length-1));
        }
        function getAnnotationsForNode(node: Node):string[] {
            let leadingCommentRanges = getLeadingCommentRanges(sourceText, node.pos);
            if (!leadingCommentRanges) return [];
            return [].concat(...leadingCommentRanges.map(getAnnotationsFromComment));
        }
        
        function callMethod(node, funcName, args) {
            // Supported checks:
            function resolveType(typeName:string):Type {
                let isConcrete = (typeName.indexOf("!") === 0);
                if (isConcrete) {
                    typeName = typeName.substring(1);
                }
                let typeSymbol = checker.resolveName(node, typeName, SymbolFlags.Type, null, typeName);
                let type = checker.getTypeOfSymbol(typeSymbol);
                return isConcrete ? checker.createConcreteType(type) : type;
            }
            const debugFuncs = {
                check: {
                    assertType(node:Node, typeName:string) {
                        let typeA = checker.getTypeAtLocation(node), typeB = resolveType(typeName);
                        let areIdentical = checker.isTypeIdenticalTo(typeA, typeB);
                        console.log(typeA, typeB)
                        console.log("ART IDENTICAL???", typeName, areIdentical, checker.typeToString(typeA), checker.typeToString(typeB));
                    }
                },
                bind: {
                    
                }
            };        
            debugFuncs[passArgs.passType][funcName](node, ...args);
        }
    }
}