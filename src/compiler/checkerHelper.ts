/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="utilities.ts"/>

module ts {
    export function findContainerParent(node:Node) {
        while (node.parent) {
            node = node.parent;
            if (node.symbol && node.symbol.flags & SymbolFlags.HasLocals) {
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
            }
        }
        printSwitch(parent);
    }
    export function getNarrowedTypeOfBrandProperty(propDecl:BrandPropertyDeclaration, node:Node) {
        var defBlock = findContainerParent(propDecl.brandTypeDeclaration);
        var assignments = propDecl.bindingAssignments;

        function visitNode(node:Node) {
            if (assignments.indexOf(<Expression>node) > -1) {
                console.log("MATCHINESS");
            }
            forEachChild(node, visitNode);
        }
        printNode(defBlock);
        visitNode(defBlock);
    }
}
