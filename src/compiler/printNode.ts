/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="utilities.ts"/>

module ts {
    export function getNodeKindAsString(node:Node) {
        let result:string;
        printRecursor(node, (node, value) => result = value);
        return result;
    }
    function printRecursor(node:Node, print:any) {
        if (node) {
            return print(node, (<any>ts).SyntaxKind[node.kind]);
        } else if (node === null) {
            return "<null>";
        } else if (node === undefined) {
            return "<undefined>";
        }
    switch (node.kind) {
        case SyntaxKind.LocusTypeDeclaration: 
            print(node, "LocusTypeDeclaration");
            print((<LocusTypeNode>node).name, "LocusTypeDeclaration.name");
            return;
        case SyntaxKind.Identifier: return print(node, "Identifier");
        case SyntaxKind.Parameter: return print(node, "Parameter");
        case SyntaxKind.TypeReference: return print(node, "TypeReference");    
        case SyntaxKind.ThisParameter: return print(node, "ThisParameter"); // [ConcreteTypeScript]
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
        case SyntaxKind.ComputedPropertyName: return print(node, "ComputedPrope rtyName");
        case SyntaxKind.PropertyAccessExpression: return print(node, "PropertyAccessExpression");
        case SyntaxKind.ElementAccessExpression: return print(node, "ElementAccessExpression");
        case SyntaxKind.CallExpression: return print(node, "CallExpression");
        case SyntaxKind.NewExpression: return print(node, "NewExpression");
        case SyntaxKind.TaggedTemplateExpression: return print(node, "TaggedTemplateExpression");
        case SyntaxKind.TypeAssertionExpression: return print(node, "TypeAssertionExpression");
        case SyntaxKind.ParenthesizedExpression: return print(node, "ParenthesizedExpression");
        case SyntaxKind.FunctionDeclaration: return print(node, "FunctionDeclaration");
        case SyntaxKind.FunctionExpression: return print(node, "FunctionExpression");
        case SyntaxKind.LocusType: return print(node, "LocusType");
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
        case SyntaxKind.TryStatement: return print(node, "TryBlock");
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
        case SyntaxKind.MethodDeclaration: return print(node, "MethodDeclaration");
        case SyntaxKind.VariableDeclaration: return print(node, "VariableDeclaration");
        case SyntaxKind.ClassDeclaration: return print(node, "ClassDeclaration");
        case SyntaxKind.InterfaceDeclaration: return print(node, "InterfaceDeclaration");
        case SyntaxKind.EnumDeclaration: return print(node, "EnumDeclaration");
        case SyntaxKind.ModuleDeclaration: return print(node, "ModuleDeclaration");
        case SyntaxKind.ImportDeclaration: return print(node, "ImportDeclaration");
        case SyntaxKind.BrandPropertyDeclaration: return print(node, "BrandPropertyDeclaration");
        case SyntaxKind.SourceFile: return print(node, "SourceFile");
        default: return print(node, `<${node.kind}>`);
        }
    }
    
    export function printNode(parent:Node, indent = 0) {
        console.log("WHAT");
        function print(node:Node, name:string) {
            var indentStr = '';
            for (var i = 0; i < indent; i++) {
                indentStr += '  ';
            }
            var addendum:any[] = [];
            let keys = Object.keys(node);
            for (let str of keys) {
                if (typeof <any>node[str] === "string" || typeof <any>node[str] === "number") {
                    addendum.push(`${str}: ${node[str]}`);
                } else if (node[str] != null && node[str].kind == SyntaxKind.Identifier) {
                    addendum.push(`${str}: ${node[str].text}`);
                }
            }
            console.log(`${indentStr}${name} (${addendum.join(', ')})`);
        }
        function printSwitch(node:any) {
            printRecursor(node, print)
        }
        printSwitch(parent);
    }
    export function printNodeDeep(parent:Node, indent = 0) {
        console.log("WHAT");
        function print(node:Node, name:string) {
            var indentStr = '';
            for (var i = 0; i < indent; i++) {
                indentStr += '  ';
            }
            var addendum:any[] = [];
            let keys = Object.keys(node);
            for (let str of keys) {
                if (typeof <any>node[str] === "string" || typeof <any>node[str] === "number") {
                    addendum.push(`${str}: ${node[str]}`);
                }
            }
            console.log(`${indentStr}${name} (${addendum.join(', ')})`);
            indent++;
            forEachChild(node, printSwitch);
            indent--;
        }
        function printSwitch(node:any) {
            printRecursor(node, print)
        }
        printSwitch(parent);
    }
    const USE_COLOUR:boolean = true;
    var CHECKER:TypeChecker = null;
    function flowTypeToString({firstBindingSite, type}: FlowType): string {
        return `${CHECKER.typeToString(type)}@${ts.nodePosToString(firstBindingSite)}`;
    }
    function flowMemberToString({key, definitelyAssigned, conditionalBarrierPassed, flowTypes}: FlowMember): string {
        let ofType = definitelyAssigned ? ':' : '??:';
        let conditionality = conditionalBarrierPassed ? '' : ' [in conditional]';
        return `${key} ${ofType} ${flowTypes.map(flowTypeToString).join(" | ")}${conditionality}`;
    }
    export function flowMemberSetToString(checker: TypeChecker, memberSet: FlowMemberSet) {

        CHECKER = checker;
        let setAsString = "FlowMemberSet {\n";
        for (let key of Object.keys(memberSet)) {
            setAsString += '    ' + flowMemberToString(memberSet[key]) + "\n";
        }
        setAsString += "}\n";
        CHECKER = null; 
        return setAsString;
    }
}  
