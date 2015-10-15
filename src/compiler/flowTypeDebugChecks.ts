/// <reference path="binder.ts"/>
/// <reference path="types.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="flowAnalysis.ts"/>

/// <reference path="brandTypeQueries.ts"/>
/// <reference path="ctsTypes.ts"/>

declare var require;

/* @internal */
namespace ts {
    interface PassArgs {
        passType:string;
        recurse:boolean;
        /* For checking pass: */
        checker:TypeChecker;
        /* For binding pass: */
        /* For emitting pass: */
        emittedText:string;
    }
    export function debugPass(sourceFile: SourceFile, passArgs:PassArgs, root:Node=sourceFile) {
        let {checker, passType, recurse} = passArgs;
        // Don't debug the same pass twice, and don't debug ambient declarations:
        if ((passType !== "emit" && (<any>sourceFile)[`ctsDidDebug${passType}`]) || sourceFile.fileName.indexOf(".d.ts") != -1) {
            return;
        }
        let lines = [];
        if (!(<any>sourceFile)[`ctsDidDebug${passType}`]) {
            try {
                require("fs").unlinkSync(`${sourceFile.fileName.split("/").pop()}.${passType}.output`);
            } catch (err){}; 
        }
        // Mark that we need not debug this further
        (<any>sourceFile)[`ctsDidDebug${passType}`] = true;
        let sourceText = sourceFile.text;
        pass(root);
        if (lines.length > 0) {
            require("fs").appendFileSync(`${sourceFile.fileName.split("/").pop()}.${passType}.output`, lines.join('\n')+'\n');
        }
        return;
        function pass(node:Node) {
            for (let annotation of getAnnotationsForNode(node)) {
                let args:string[] = annotation.split(" ");
                let funcName = args.shift();
                processTestAnnotation(node, funcName, args);
            }
            if (recurse) {
                forEachChild(node, pass);
            }
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
        
        function processTestAnnotation(node:Node, funcName:string, args:string[]) {
            // Supported checks:
            function resolveType(typeName:string):Type {
                let [left, right] = typeName.split(".");
                typeName = left;
                let isConcrete = (typeName.indexOf("!") === 0);
                if (isConcrete) {
                    typeName = typeName.substring(1);
                }
                let typeSymbol = checker.resolveName(node, typeName, SymbolFlags.Type, null, typeName);
                let type = checker.getDeclaredTypeOfSymbol(typeSymbol);
                // Special case .prototype:
                if (right === "prototype" && getSymbolDecl(typeSymbol, SyntaxKind.BrandTypeDeclaration)) {
                    let decl = <BrandTypeDeclaration> getSymbolDecl(typeSymbol, SyntaxKind.BrandTypeDeclaration);
                    type = checker.getDeclaredTypeOfSymbol(decl.prototypeBrandDeclaration.symbol);
                }
                if (isConcrete) {
                    type.concreteType = <ConcreteType>checker.createType(TypeFlags.Concrete);
                    type.concreteType.baseType = type;
                    return type.concreteType;
                }
                return type;
            }
            let lineNum = getLineOfLocalPosition(sourceFile, node.pos);
            let linePos = node.pos - getLineStarts(sourceFile)[lineNum];
            // Various assertions go here:
            const handlers = {
                check: {
                    assertType(node:Node, typeName:string) {
                        let typeA = checker.getTypeAtLocation(node), typeB = resolveType(typeName);
                        let tstrA =  checker.typeToString(typeA), tstrB = checker.typeToString(typeB);
                        if (checker.isTypeIdenticalTo(typeA, typeB)) {
                            succeed(`'${tstrA}'`);
                        } else {
                            fail(`'${tstrA}' != '${tstrB}'`);
                        }
                    }
                },
                emit: {
                    assertEmit(node:Node, ...matches:string[]) {
                        let emittedText = passArgs.emittedText;
                        let failedMatches = matches.filter(match => emittedText.indexOf(match) === -1);
                        if (failedMatches.length === 0) {
                            succeed(`'${matches.join(' ')}'`);
                        } else {
                            fail(`'${failedMatches.join(' ')}' in ${JSON.stringify(emittedText)}`);
                        }
                    }
                },
                bind: {
                    
                }
            };
            let keys = [].concat(...[handlers.check, handlers.emit, handlers.bind].map(Object.keys));
            if (!isStatement(node) || passType === "emit") {
                if (keys.indexOf(funcName) === -1) {
                    fail(`Function not defined anywhere.`);
                }
                // Call the handler:
                let func = handlers[passType][funcName];
                // if (args.indexOf("[wholeFile]") === 0) {
                //     // Remove the [wholeFile] attribute
                //     args.splice(args.indexOf("[wholeFile]"), 1);
                //     if (node !== sourceFile) return;
                // } else 
                if (passType === "emit" && sourceFile === node) {
                    return;
                }
                // TODO Clean
                if (func) func(node, ...(args.map(s => s.replace(/\\s/g, ' '))));
            }
            return; 
            // Helpers
            function fail(...args) {
                lines.push(`FAILURE executing '${funcName}' at (${getNodeKindAsString(node)}) ${sourceFile.fileName}:${lineNum}:${linePos}, ` + args.join("\t"));
            }
            function succeed(...args) {
                lines.push(`Passes '${funcName}' at (${getNodeKindAsString(node)}) ${sourceFile.fileName}:${lineNum}:${linePos}, ` + args.join("\t"));
            }
        }
    }
}