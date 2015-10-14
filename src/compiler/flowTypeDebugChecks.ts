/// <reference path="binder.ts"/>
/// <reference path="types.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="flowAnalysis.ts"/>

/// <reference path="brandTypeQueries.ts"/>
/// <reference path="ctsTypes.ts"/>


/* @internal */
namespace ts {

    export function debugPass(sourceFile: SourceFile) {
        // Don't debug ambient declarations:
        if (sourceFile.fileName.indexOf(".d.ts") != -1) {
            return;
        }
        let sourceText = sourceFile.text;
        pass(sourceFile);
        return;
        function pass(node:Node) {
            for (let annotation of getAnnotationsForNode(sourceFile)) {
                printNodeDeep(node)
                console.log(annotation);
            }
            forEachChild(node, pass);
        }
        function getAnnotationsFromComment(range: CommentRange):string[] {
            let comment = sourceText.substring(range.pos, range.end);
            // Match strings that start with '@', and drop the '@'.
            return comment.match(/@[a-zA-Z0-9]+)/g).map(s => s.substring(1, s.length));
        }
        function getAnnotationsForNode(node: Node):string[] {
            let leadingCommentRanges = getLeadingCommentRanges(sourceText, node.pos);
            return [].concat(...leadingCommentRanges.map(getAnnotationsFromComment));
        }
    }
}