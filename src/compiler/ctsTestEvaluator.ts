// This file is part of ConcreteTypeScript.

/// <reference path="binder.ts"/>
/// <reference path="types.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="printNode.ts"/>
/// <reference path="ctsUtilities.ts"/>
/// <reference path="ctsTypes.ts"/>

declare var require: { (id: string): any; resolve(id: string): string; cache: any; extensions: any; main: any; };
/* @internal */
namespace ts {

    interface DebugAnnotation {
        annotationCode:string;
        filterFunctionCode?:string;
    }

    function dropFirstAndLastChars(str:string) {
        return str.substring(1, str.length - 1);
    }
    
    let AT_NAME = "@([a-zA-Z]+)";
    let SQUARE_PARAMS = "\\[([^{\\(]+)\\]";
    let PARAMS = "\\(([^]+)\\)";
    // Let the default be on expressions, except if its assertEmitted:
    let macros = {
        [`${AT_NAME}${PARAMS}`]: (f,s) => {        
            if (f.match(/assert[a-zA-Z]*Emitted/)) {
                return `@afterEmit{${f}(${s})}`;
            } else {
                return `@afterCheck[isExpression]{${f}(${s})}`;
            }
        },
        [`${AT_NAME}${SQUARE_PARAMS}${PARAMS}`]: (f, c, s) => {        
            if (f.match(/assert[a-zA-Z]*Emitted/)) {
                return `@afterEmit[${c}]{${f}(${s})}`;
            } else {
                return `@afterCheck[${c}]{${f}(${s})}`;
            }
        }
    };

    function getAnnotationsFromComment(sourceText:string, type:string, range: CommentRange):DebugAnnotation[] {
        let comment = sourceText.substring(range.pos, range.end);
        
        for (let key of Object.keys(macros)) {
            let match = null;
            while (match = comment.match(new RegExp(key))) {
                let prevString = match.shift();
                comment = comment.replace(prevString, macros[key](...match));
            }
        }
        let annotations:DebugAnnotation[] = [];
        // Handle debug annotations with a node type filter:
        let withFilterRegex = new RegExp(`@${type}\\[[^{]+\\]\\{[^]+\\}`, 'g');
        for (let match of comment.match(withFilterRegex) || []) {
            annotations.push({
                annotationCode: dropFirstAndLastChars(match.match(/{[^]+}/)[0]),
                filterFunctionCode: dropFirstAndLastChars(match.match(/\[[^{]+\]/)[0])
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
            console.log(err.stack)
        }
    }

    let filesWrittenTo = {};
    function writeLineToFile(fileName:string, line:string) {
        if (!filesWrittenTo[fileName]) {
            try { require("fs").unlinkSync(fileName); } catch(err) {}
            filesWrittenTo[fileName] = true;
        }
        console.log(line)
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
        Debug.assert(!!sourceFile);
        let resultFileName = `${sourceFile.fileName}.${pass}.output`;
        let emittedText = (<any>node).DEBUG_emitted_text;
        // Remove comments:
        emittedText = emittedText && emittedText.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');

        function writeLine(line:string) {
            writeLineToFile(resultFileName, line);
        }
        function getType() {
            return checker.getTypeAtLocation(node);
        }
        function toType(str) {
            if (typeof str !== "string") return str;
            return resolveType(checker, node, str);
        }
        function assert(condition:boolean, message:string = "assert failed") {
            let prefix = condition ? "Passes" : "FAILURE executing";
            let lineNum = getLineOfLocalPosition(sourceFile, node.pos);
            let linePos = node.pos - getLineStarts(sourceFile)[lineNum];                
            let line = `${prefix} at (${getNodeKindAsString(node)}) ${sourceFile.fileName}:${lineNum}:${linePos}, ${message}`;
            writeLine(line);
        }
        
        function assertNotEmitted(string) {
            let matched = emittedText.match(string);
            return assert(!matched, `Expected to NOT emit '${string}'.`);
        }
        function assertEmitted(string) {
            let matched = emittedText.match(string);
            return assert(matched, `Expected to emit '${string}'.`);
        }
        function assertError(string) {
            let errors = (<any>node).DEBUG_check_diagonistics;
            if (!errors) {
                return assert(false, `Asserted that we have an error containing '${string}', but had no errors.`);
            }
            for (let error of errors) {
                if (error.match(string)) {
                    return assert(true, `Found error containing '${string}'.`);
                }
            }
            return assert(false, `Asserted that we have an error containing '${string}', but no errors matched.`);

        }
        function assertNotError() {
            let errors = (<any>node).DEBUG_check_diagonistics;
            if (!errors || errors.length === 0) {
                return;
            }
            assert(false, `Asserted that we have no errors, but had ${errors.join('\n')}.`);
        }
        function hasType(type) {
            if (typeof type === "string") {
                let actualType = getType();
                let typeString = checker.typeToString(actualType)
                return typeString.replace(/\s/g, '') === type.replace(/\s/g, '');
            }
            return checker.isTypeIdenticalTo(getType(), toType(type));
        }
        function concrete(type) {
            return checker.createConcreteType(type);
        }
        // Expose all of the 'ts' namespace:
        return merge(ts, {
            concrete, STORAGE, sourceFile, node,
            sourceText: sourceFile.text,
            emittedText,
            isSourceFile(node:Node) {
                return node.kind === SyntaxKind.SourceFile;
            },
            toType,
            getType,
            hasType,
            writeLine,
            assert,
            assertEmitted,
            assertNotEmitted,
            assertError,
            assertNotError,
            assertType: (type) => assert(hasType(type), `Should have type equal to '${typeof type === "string" ? type : checker.typeToString(toType(type))}', has type '${checker.typeToString(getType())}'`)
        });
    }

    function onPass(node: Node, prefix:string, evaler: (string)=>any, functions) {
        let sourceFile = getSourceFileOfNode(node);
        // if (sourceFile.fileName.indexOf(".d.ts") >= 0) {
        //     return;
        // }
        let sourceText = sourceFile.text;
        for (let {annotationCode,filterFunctionCode} of getAnnotationsForNode(sourceText, prefix, node)) {
            // If a filter is specified with [], use this before executing the code in {}
            if (!filterFunctionCode || wrapEvaler(evaler, `return ${filterFunctionCode};`, functions)(node)) {
                wrapEvaler(evaler, annotationCode, functions);
            }
        }
    }
    export function beforeCheckPass(node, checker, evaler) {
        if (!ENABLE_DEBUG_ANNOTATIONS) return;
        if (!node.__wasVisitedBeforeCheck) {
            onPass(node, "beforeCheck", evaler, getEvaluationScope(node, "beforeCheck", checker));
            node.__wasVisitedBeforeCheck = true;
        }
    }
    export function afterCheckPass(node, checker, evaler) {
        if (!ENABLE_DEBUG_ANNOTATIONS) return;
        if (!node.__wasVisitedAfterCheck) {
            onPass(node, "afterCheck", evaler, getEvaluationScope(node, "afterCheck", checker));
            node.__wasVisitedAfterCheck = true;
        }
    }
    function evalInLocalScope(s) {
        return eval(s);
    }
    export function afterParsePass(node) {
        if (!ENABLE_DEBUG_ANNOTATIONS) return;
        if (!node.__wasVisitedAfterParse) {
            onPass(node, "afterParse", evalInLocalScope, getEvaluationScope(node, "afterParse"));
            node.__wasVisitedAfterParse = true;
        }
    }
    export function afterEmitPass(node, evaler) {
        if (!ENABLE_DEBUG_ANNOTATIONS) return;
        if (!node.__wasVisitedAfterEmit) {
            onPass(node, "afterEmit", evaler, getEvaluationScope(node, "afterEmit"));
            node.__wasVisitedAfterEmit = true;
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
        if (right === "prototype" && getSymbolDecl(typeSymbol, SyntaxKind.LocusTypeDeclaration)) {
            let decl = <LocusTypeNode> getSymbolDecl(typeSymbol, SyntaxKind.LocusTypeDeclaration);
            type = checker.getDeclaredTypeOfSymbol(decl.prototypeBrandDeclaration.symbol);
        }
        if (isConcrete) {
            return checker.createConcreteType(type);
        }
        return type;
    }
}
