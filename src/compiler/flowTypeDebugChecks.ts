// TODO rename to ctsDebugChecks
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

    interface DebugAnnotation {
        annotationCode:string;
        nodeKindRegex?:string;
    }

    function dropFirstAndLastChars(str:string) {
        return str.substring(1, str.length - 1);
    }
    function getAnnotationsFromComment(sourceText:string, type:string, range: CommentRange):DebugAnnotation[] {
        let comment = sourceText.substring(range.pos, range.end);
        let annotations:DebugAnnotation[] = [];
        // Handle debug annotations with a node type filter:
        let withFilterRegex = new RegExp(`@${type}\\[[\\S]+\\]\\{[^]+\\}`, 'g');
        for (let match of comment.match(withFilterRegex) || []) {
            annotations.push({
                annotationCode: dropFirstAndLastChars(match.match(/{[^]+}/)[0]),
                nodeKindRegex: dropFirstAndLastChars(match.match(/\[[\S]+\]/)[0])
            });
        }
        // Handle uncoditional debug annotations:
        let withoutFilterRegex = new RegExp(`@${type}\{[^]+\}`, 'g');
        for (let match of comment.match(withoutFilterRegex) || []) {
            annotations.push({
                annotationCode: dropFirstAndLastChars(match.match(/{[^]+}/)[0]),
            });
        }
        return annotations;
    }
    function getAnnotationsForNode(sourceText:string, type:string, node: Node):DebugAnnotation[] {
        let annotations:DebugAnnotation[] = [];
        let ranges = getLeadingCommentRanges(sourceText, node.pos);
        if (ranges) {
            for (let range of ranges) {
                annotations = annotations.concat(getAnnotationsFromComment(sourceText, type, range));
            }
        }
        return annotations;
    }

    function wrapAsFunc(code:string, injectedValues) {
        return `(function(${Object.keys(injectedValues).join(',')}) {${code}})`;
    }
    function wrapEvaler(evaler, code:string, injectedValues) {
        let args = Object.keys(injectedValues).map(key => injectedValues[key]);
        let funcBody = wrapAsFunc(code,injectedValues);
        try {
            return evaler(funcBody).apply(null, args);
        } catch(err) {
            console.log(err, "When executing " + code)
        }
    }

    let filesWrittenTo = {};
    function writeLineToFile(fileName:string, line:string) {
        if (!filesWrittenTo[fileName]) {
            try { require("fs").unlinkFileSync(fileName); } catch(err) {}
            filesWrittenTo[fileName] = true;
        }
        require("fs").appendFileSync(fileName, line + '\n');
    }

    function merge(a,b) {
        let ret = {};
        for (let k of Object.keys(a)) ret[k] = a[k];
        for (let k of Object.keys(b)) ret[k] = b[k];
        return ret;
    }

    let STORAGE = {}; // For storing for multipart tests
    function getEvaluationScope(node:Node, pass:string, checker?:TypeChecker) {
        let sourceFile = getSourceFileOfNode(node);
        let resultFileName = `${sourceFile.fileName.split("/").pop()}.${pass}.output`;
        function writeLine(line:string) {
            writeLineToFile(resultFileName, line);
        }
        function toType(str:string) {
            return resolveType(checker, node, str);
        }
        function assert(message:string, condition:boolean) {
            let prefix = condition ? "FAILURE executing": "Passes";
            let lineNum = getLineOfLocalPosition(sourceFile, node.pos);
            let linePos = node.pos - getLineStarts(sourceFile)[lineNum];                
            let line = `${prefix} at (${getNodeKindAsString(node)}) ${sourceFile.fileName}:${lineNum}:${linePos}, ${message}`;
            writeLine(line);
        }
        return merge(checker, {
            STORAGE, sourceFile, node, checker,
            sourceText: sourceFile.text,
            toType,
            assert,
            writeLine,
            hasType: (type) => checker.isTypeIdenticalTo(checker.getTypeAtLocation(node), typeof type !== "string" ? type : toType(type))
        });
    }

    function onPass(node: Node, prefix:string, evaler: (string)=>void, functions) {
        let sourceFile = getSourceFileOfNode(node);
        if (sourceFile.fileName.indexOf(".d.ts") >= 0) {
            return;
        }
        let sourceText = sourceFile.text;
        for (let {annotationCode,nodeKindRegex} of getAnnotationsForNode(sourceText, prefix, node)) {
            if (!nodeKindRegex) {
                wrapEvaler(evaler, annotationCode, functions);
                continue;
            }
            let dontMatch = (nodeKindRegex.charAt(0) === "~");
            let regex = new RegExp(dontMatch ? nodeKindRegex.substring(1) : nodeKindRegex);
            let matched = !!getNodeKindAsString(node).match(regex);
            if (dontMatch !== matched) { // Does the matchness match?
                wrapEvaler(evaler, annotationCode, functions);;
            }
        }
    }
    export function beforeCheckPass(node, checker, evaler) {
        if (!node.__wasVisitedBeforeCheck) {
            onPass(node, "beforeCheck", evaler, getEvaluationScope(node, "beforeCheck", checker));
            node.__wasVisitedBeforeCheck = true;
        }
    }
    export function afterCheckPass(node, checker, evaler) {
        if (!node.__wasVisitedAfterCheck) {
            onPass(node, "afterCheck", evaler, getEvaluationScope(node, "afterCheck", checker));
            node.__wasVisitedAfterCheck = true;
        }
    }
    // Supported checks:
    function resolveType(checker:TypeChecker, node:Node, typeName:string):Type {
        let [left, right] = typeName.split(".");
        typeName = left;
        let isConcrete = (typeName.indexOf("!") === 0);
        if (isConcrete) {
            typeName = typeName.substring(1);
        }
        let typeSymbol = checker.resolveName(node, typeName, SymbolFlags.Type, null, typeName);
        var type = checker.getDeclaredTypeOfSymbol(typeSymbol);
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
}