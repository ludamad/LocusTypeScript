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
        filterFunctionCode?:string;
    }

    function dropFirstAndLastChars(str:string) {
        return str.substring(1, str.length - 1);
    }
    
    // Let the default be on expressions, except if its assertEmitted:
    let macros = {
        "@assertEmitted\\[([^\\]]+)\\]\\(([^]+)\\)": (c,s) => `@afterEmit[${c}]{assertEmitted(${s})}`,
        "@assertEmitted\\(([^]+)\\)": s => `@afterEmit{assertEmitted(${s})}`,
        "@([a-zA-Z]+)\\(([^]+)\\)": (f,s) => `@afterCheck[isExpression]{${f}(${s})}`
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
        let withFilterRegex = new RegExp(`@${type}\\[[\\S]+\\]\\{[^]+\\}`, 'g');
        for (let match of comment.match(withFilterRegex) || []) {
            annotations.push({
                annotationCode: dropFirstAndLastChars(match.match(/{[^]+}/)[0]),
                filterFunctionCode: dropFirstAndLastChars(match.match(/\[[\S]+\]/)[0])
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
            try { require("fs").unlinkSync(fileName); } catch(err) {}
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
        let resultFileName = `${sourceFile.fileName}.${pass}.output`;
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
        function assertEmitted(string) {
            let emitted = (<any>node).DEBUG_emitted_text;
            return assert(emitted.match(string) >= 0, `Expected to emit '${string}'.`);
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
        function hasType(type) {
            return checker.isTypeIdenticalTo(getType(), toType(type));
        }
        function concrete(type) {
            return checker.createConcreteType(type);
        }
        // Expose all of the 'ts' namespace:
        return merge(ts, {
            concrete, STORAGE, sourceFile, node,
            sourceText: sourceFile.text,
            toType,
            assert,
            getType,
            hasType,
            writeLine,
            assertEmitted,
            assertError,
            assertType: (type) => assert(hasType(type), `Should be type ${checker.typeToString(toType(type))}, was type ${checker.typeToString(getType())}`)
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
            if (!filterFunctionCode || wrapEvaler(evaler, `return ${filterFunctionCode};`, ts)(node)) {
                wrapEvaler(evaler, annotationCode, functions);
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
    function evalInLocalScope(s) {
        return eval(s);
    }
    export function afterParsePass(node) {
        if (!node.__wasVisitedAfterParse) {
            onPass(node, "afterParse", evalInLocalScope, getEvaluationScope(node, "afterParse"));
            node.__wasVisitedAfterParse = true;
        }
    }
    export function afterEmitPass(node, evaler) {
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
