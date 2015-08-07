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

    export function printNode(parent:Node, indent = 0) {
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


    class HBlock {
        children:HStatement[] = [];        
        // Which scope do we exit after this block?
        exitScope:HBlock = null;
        push(statement:HStatement)  {
            this.children.push(statement);
        }
        constructor(public parent:HStatement, public isBreakable:boolean = false) {}
    }

    // Screw efficiency for now...
    // Helper class representing an abstract assignment node:
    class HStatement {
        // There is only one relevant assignment per node, done unconditionally:
        assignment:Node = null;
        // unconditional children:
        children:HBlock = new HBlock(this);
        // conditional children:
        left:HBlock = new HBlock(this);
        right:HBlock = new HBlock(this);
        static Loop():HStatement {
            var statement = new HStatement();
            statement.right.isBreakable = statement.left.isBreakable = true;
            return statement;
        }
        static Assign(expr:Node):HStatement {
            var statement = new HStatement();
            statement.assignment = expr;
            return statement;
        }
    }

    class HStack {
        // Keep a sentinel top-scope:
        private scopes:HBlock[] = [new HBlock(null)];
        get ():HBlock         {return this.scopes[this.scopes.length - 1];}
        set(val:HBlock)       {return this.scopes[this.scopes.length - 1] = val;}
        pop ():void           {this.scopes.pop();}
        push(val:HBlock):void {this.scopes.push(val);}
        doBreak() { // Or continue
            // TODO maybe warn about unreachable assignments after break
            for (var i = this.scopes.length - 1; i >= 0; i--) {
                if (this.scopes[i].isBreakable) {
                    this.get().exitScope = this.scopes[i];
                    break;
                }
            }
        }
        pushStatement(statement:HStatement) {
            this.get().push(statement);
            this.push(statement.children);
        }
        doReturn() {
            this.get().exitScope = this.scopes[0];
        }
    }
    class HTransformer {
        private scopes:HStack = new HStack();
        constructor(private assignmentSet:Node[]) {}
        transform(node:Node, left?:Node, right?:Node) {
            forEachChild(node, (child) => {
                if (left === child) {
                }
            });
        }
        handleAssignment(assignment:Expression) {
            // current.assignment = assignment;
        }
        build(node:Node) {
            loopForEach = (loop:HStatement, left:Node, right:Node) => {
                forEachChild(node, (child) => {
                    if (left === child) {
                    }
                });
            };
            forEachChild(node, (child) => {
                switch (child.kind) {
                    case SyntaxKind.ForStatement:
                    case SyntaxKind.ForInStatement:
                    case SyntaxKind.WhileStatement:
                        var statement = HStatement.Loop();
                        this.scopes.get().push(statement);
                        break;
                    default:
                        if (this.assignmentSet.indexOf(<Expression>child) >= 0) {
                            this.scopes.pushStatement(HStatement.Assign(child));
                        }
                        forEachChild(child, build);
                        if (this.assignmentSet.indexOf(<Expression>child) >= 0) {
                            this.scopes.pop();
                        }
                }
            });
        }
    }

    export function getNarrowedTypeOfBrandProperty(propDecl:BrandPropertyDeclaration, location:Node) {
        function backtrack(parent:Node, stopNode:Node):HStatement {
        //     // The backtracking nodes are all guaranteed to occur
        //     var parentStatement = new HStatement();
        //     parentStatement.node = parent;
        //     var assign:HAssignStatement;
        //     
        //     function iterChildren(node:Node) {
        //         if (node.kind == SyntaxKind.IfStatement) {
        //             var s = <IfStatement> node;
        //             s.thenStatement;
        //         }
        //         parentStatement.children.push();
        //     }
        //     forEachChild(parent, (node) => {
        //         if (node === stopNode) {
        //             return true; // Stop iteration
        //         } else {
        //             iterChildren(node);
        //         }
        //     });
        //     return parentStatement;
        // }
        // 
        // var result:HStatement;
        // var container:Node = location.parent;
        // var containerChild:Node = location;
        // while (container) {
        //     backtrack(container, containerChild);
        //     container = location.parent;
        //     containerChild = location;
        // }
    }
}
