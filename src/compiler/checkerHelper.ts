/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="utilities.ts"/>

module ts {
    export function findParent(node:Node, symbolFlag:SymbolFlags) {
        while (node.parent) {
            node = node.parent;
            if (node.symbol && node.symbol.flags & symbolFlag) {
                return node;
            }
        }
    }

    export function printNode(parent:Node) {
        var indent = 0;
        function print(node:Node, name:string) {
            var indentStr = '';
            for (var i = 0; i < indent; i++) {
                indentStr += '  ';
            }
            console.log(indentStr + name);
            indent++;
            forEachChild(node, printSwitch);
            indent--;
        }

        function printSwitch(node:Node) {
        switch (node.kind) {
            case SyntaxKind.BrandTypeDeclaration: return print(node, "BrandTypeDeclaration");
            case SyntaxKind.Identifier: return print(node, "Identifier");
            case SyntaxKind.Parameter: return print(node, "Parameter");
            case SyntaxKind.GetAccessor: return print(node, "GetAccessor");
            case SyntaxKind.SetAccessor: return print(node, "SetAccessor");
            case SyntaxKind.ThisKeyword: return print(node, "ThisKeyword");
            case SyntaxKind.SuperKeyword: return print(node, "SuperKeyword");
            case SyntaxKind.NullKeyword: return print(node, "NullKeyword");
            case SyntaxKind.TrueKeyword: return print(node, "TrueKeyword");
            case SyntaxKind.FalseKeyword: return print(node, "FalseKeyword");
            case SyntaxKind.NumericLiteral: return print(node, "NumericLiteral");
            case SyntaxKind.StringLiteral: return print(node, "StringLiteral");
            case SyntaxKind.RegularExpressionLiteral: return print(node, "RegularExpressionLiteral");
            case SyntaxKind.NoSubstitutionTemplateLiteral: return print(node, "NoSubstitutionTemplateLiteral");
            case SyntaxKind.TemplateHead: return print(node, "TemplateHead");
            case SyntaxKind.TemplateMiddle: return print(node, "TemplateMiddle");
            case SyntaxKind.TemplateTail: return print(node, "TemplateTail");
            case SyntaxKind.TemplateExpression: return print(node, "TemplateExpression");
            case SyntaxKind.TemplateSpan: return print(node, "TemplateSpan");
            case SyntaxKind.QualifiedName: return print(node, "QualifiedName");
            case SyntaxKind.ArrayLiteralExpression: return print(node, "ArrayLiteralExpression");
            case SyntaxKind.ObjectLiteralExpression: return print(node, "ObjectLiteralExpression");
            case SyntaxKind.PropertyAssignment: return print(node, "PropertyAssignment");
            case SyntaxKind.ComputedPropertyName: return print(node, "ComputedPropertyName");
            case SyntaxKind.PropertyAccessExpression: return print(node, "PropertyAccessExpression");
            case SyntaxKind.ElementAccessExpression: return print(node, "ElementAccessExpression");
            case SyntaxKind.CallExpression: return print(node, "CallExpression");
            case SyntaxKind.NewExpression: return print(node, "NewExpression");
            case SyntaxKind.TaggedTemplateExpression: return print(node, "TaggedTemplateExpression");
            case SyntaxKind.TypeAssertionExpression: return print(node, "TypeAssertionExpression");
            case SyntaxKind.ParenthesizedExpression: return print(node, "ParenthesizedExpression");
            case SyntaxKind.FunctionDeclaration: return print(node, "FunctionDeclaration");
            case SyntaxKind.FunctionExpression: return print(node, "FunctionExpression");
            case SyntaxKind.ArrowFunction: return print(node, "ArrowFunction");
            case SyntaxKind.DeleteExpression: return print(node, "DeleteExpression");
            case SyntaxKind.TypeOfExpression: return print(node, "TypeOfExpression");
            case SyntaxKind.VoidExpression: return print(node, "VoidExpression");
            case SyntaxKind.PrefixUnaryExpression: return print(node, "PrefixUnaryExpression");
            case SyntaxKind.PostfixUnaryExpression: return print(node, "PostfixUnaryExpression");
            case SyntaxKind.BinaryExpression: return print(node, "BinaryExpression");
            case SyntaxKind.ConditionalExpression: return print(node, "ConditionalExpression");
            case SyntaxKind.OmittedExpression: return print(node, "OmittedExpression");
            case SyntaxKind.Block: return print(node, "Block");
            case SyntaxKind.TryBlock: return print(node, "TryBlock");
            case SyntaxKind.FinallyBlock: return print(node, "FinallyBlock");
            case SyntaxKind.ModuleBlock: return print(node, "ModuleBlock");
            case SyntaxKind.VariableStatement: return print(node, "VariableStatement");
            case SyntaxKind.EmptyStatement: return print(node, "EmptyStatement");
            case SyntaxKind.ExpressionStatement: return print(node, "ExpressionStatement");
            case SyntaxKind.IfStatement: return print(node, "IfStatement");
            case SyntaxKind.DoStatement: return print(node, "DoStatement");
            case SyntaxKind.WhileStatement: return print(node, "WhileStatement");
            case SyntaxKind.ForStatement: return print(node, "ForStatement");
            case SyntaxKind.ForInStatement: return print(node, "ForInStatement");
            case SyntaxKind.ContinueStatement: return print(node, "ContinueStatement");
            case SyntaxKind.BreakStatement: return print(node, "BreakStatement");
            case SyntaxKind.ReturnStatement: return print(node, "ReturnStatement");
            case SyntaxKind.WithStatement: return print(node, "WithStatement");
            case SyntaxKind.SwitchStatement: return print(node, "SwitchStatement");
            case SyntaxKind.CaseClause: return print(node, "CaseClause");
            case SyntaxKind.DefaultClause: return print(node, "DefaultClause");
            case SyntaxKind.LabeledStatement: return print(node, "LabeledStatement");
            case SyntaxKind.ThrowStatement: return print(node, "ThrowStatement");
            case SyntaxKind.TryStatement: return print(node, "TryStatement");
            case SyntaxKind.CatchClause: return print(node, "CatchClause");
            case SyntaxKind.DebuggerStatement: return print(node, "DebuggerStatement");
            case SyntaxKind.VariableDeclaration: return print(node, "VariableDeclaration");
            case SyntaxKind.ClassDeclaration: return print(node, "ClassDeclaration");
            case SyntaxKind.InterfaceDeclaration: return print(node, "InterfaceDeclaration");
            case SyntaxKind.EnumDeclaration: return print(node, "EnumDeclaration");
            case SyntaxKind.ModuleDeclaration: return print(node, "ModuleDeclaration");
            case SyntaxKind.ImportDeclaration: return print(node, "ImportDeclaration");
            case SyntaxKind.SourceFile: return print(node, "SourceFile");
            default: return print(node, `<${node.kind}>`);
            }
        }
        printSwitch(parent);
    }

    // Screw efficiency for now...
    class NarrowNode {
        assignments:Node[] = [];
        branches:NarrowNode[] = [];
        next:NarrowNode[] = [];

        narrow(node: Node) : NarrowNode {
            return this;
        }
    }

    // Helper class represenitng an abstract assignment node:
    class HStatement {
        node:Node;
        child:HStatement;
        next:HStatement;
        breaksScope:boolean;
    }
    class HAssignStatement extends HStatement {
        assignment:Expression;
    }
    // Abstracts loops/ifs/ternary operator.
    // After a scope exit, the remaining nodes are 
    // marked with a 'HBranch' with an empty right
    class HBranchStatement extends HStatement {
        left:HStatement;
        right:HStatement;
    }

    export function getNarrowedTypeOfBrandProperty(propDecl:BrandPropertyDeclaration, location:Node) {
        var defBlock = findParent(propDecl.brandTypeDeclaration, SymbolFlags.HasLocals);
        var assignments = propDecl.bindingAssignments;
        var containerStack:Node[] = [];
        var blockWasExit:boolean[] = [];
        var blockWasExit:boolean[] = [];
        var resultListStack:Type[][] = [];

        function handleEarlyBlockExit(node:Node, blockTypeLow:SyntaxKind, blockTypeHigh = blockTypeLow) {
            for (var i = containerStack.length - 1; i >= 0; i--) {
                var container = containerStack[i];
                blockWasExit[i] = true;
                node = node.parent;
                if (node.kind >= blockTypeLow && node.kind <= blockTypeHigh) {
                    return;
                }
            }
        }
        function popContainer() {
            containerStack.pop();
            blockWasExit.pop();
        }
        function pushContainer(node:Node) {
            containerStack.push(node);
            blockWasExit.push(false);
        }

        function handleNode(node:Node) {
            if (node.kind == SyntaxKind.ReturnStatement) {
                console.log("Handling return");
                handleEarlyBlockExit(node, SyntaxKind.FunctionDeclaration, SyntaxKind.FunctionDeclaration);
            }
            // TODO: break loop; syntax not handled
            if (node.kind == SyntaxKind.ContinueStatement || node.kind == SyntaxKind.BreakStatement) {
                console.log("Handling break|continue");
                // Note: relies on While..ForIn being the beginning and end of a block of breakable syntax types
                handleEarlyBlockExit(node, SyntaxKind.WhileKeyword, SyntaxKind.ForInStatement);
            }
            // We have found one of our binding assignment statements:
            if (assignments.indexOf(<Expression>node) >= 0) {
                if (blockWasExit[blockWasExit.length - 1]) {
                    console.log("Block was exit during binding");
                } else {
                    console.log("Block was NOT exit during binding");
                }
            }
        }

        // Assignments are resolved as either definite assignments, or indefinite assignments.
        // The moment a 'return' or 'break' is iterated over, it makes the relevant block
        // indefinite. 
        // 
        // We end iteration either when we reach our 'location' Node, or are out of the
        // block where the brand type was declared/defined.
        function handleNodeAndChildren(node:Node) {
            if (node.symbol.flags & SymbolFlags.IsContainer) {
                pushContainer(node);
            }
            handleNode(node);
            forEachChild(node, handleNodeAndChildren);
            if (node.symbol.flags & SymbolFlags.IsContainer) {
                popContainer();
            }
        }
        // printNode(defBlock);
        handleNodeAndChildren(defBlock);
    }
}
