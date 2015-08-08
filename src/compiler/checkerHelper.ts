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
            var addendum:any[] = [];
            for (var str in node) {
                if (hasProperty(<any>node, str)) {
                    if (typeof <any>node[str] === "string") {
                        addendum.push(`${str}: ${node[str]}`);
                    }
                }
            }
            console.log(`${indentStr}${name} (${addendum.join(', ')})`);
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

    
      // [ConcreteTypeScript] Find variable declaration associated with identifier, or 'null' if not a VariableDeclaration
      export function findVariableDeclarationForIdentifier(location: Node, identifier: Identifier): VariableDeclaration {
          while (true) {
              if (!location) {
                  // Not found, let checker handle error reporting:
                  return null;
              }
              // If not a 'locals'-having context
              if (!location.locals || !hasProperty(location.locals, identifier.text)) {
                  location = location.parent;
                  continue; 
              }
              var symbol = location.locals[identifier.text];
              if (symbol.declarations.length < 1) {
                  return null; 
              }
              if (symbol.declarations[0].kind !== SyntaxKind.VariableDeclaration) {
                  // Not a variable declaration:
                  return null;
              }
              // Matched, return variable declaration:
              return <VariableDeclaration>symbol.declarations[0];
          }
      }

    // [ConcreteTypeScript]
    export function bindPropertyAssignment(propAccess: PropertyAccessExpression, value: Expression): void {
        // Detect type-building assignment for brand-types. We are interested in the case when...
        // 1. The LHS is a PropertyAccessExpression with form "<identifier>.<identifier>".
        // 2. <variable> has an associated VariableDeclaration with form "var <identifier> : brand <identifier".
        // No restrictions on RHS, but we are only interested in its statically known type.
        // Match for PropertyAccessExpression with "<identifier>.<identifier>".
        if (propAccess.expression.kind !== SyntaxKind.Identifier) {
            return;
        }
        // Search for an associated VariableDeclaration with "var <identifier> : brand <identifier".
        var varDecl = findVariableDeclarationForIdentifier(/*TODO: container*/ null, <Identifier> propAccess.expression);
        if (!varDecl || !varDecl.type || !varDecl.type.brandTypeDeclaration) {
            return;
        }
    
        var brandTypeDecl = varDecl.type.brandTypeDeclaration;
        if (hasProperty(brandTypeDecl.symbol.members, propAccess.name.text)) {
            var symbol = brandTypeDecl.symbol.members[propAccess.name.text];
            var propertyNode = <BrandPropertyDeclaration> symbol.declarations[0];
            propertyNode.bindingAssignments.push(value);
        } else {
            // Create a property declaration for the brand-type symbol list:
            var propertyNode = <BrandPropertyDeclaration> new (objectAllocator.getNodeConstructor(SyntaxKind.BrandProperty))();
            propertyNode.name = propAccess.name; // Right-hand <identifier>
            propertyNode.pos = propAccess.pos;
            propertyNode.end = propAccess.end;
            propertyNode.parent = /*TODO: container*/ null;
            propertyNode.brandTypeDeclaration = brandTypeDecl;
            propertyNode.bindingAssignments = [value];
            // declareSymbol(brandTypeDecl.symbol.members, brandTypeDecl.symbol, propertyNode, SymbolFlags.Property, 0);
        }
    }

    export function findBreakingScope(node:Node):Node {
        if (node.kind === SyntaxKind.BreakKeyword || node.kind === SyntaxKind.ContinueKeyword) {
            var label = (<BreakOrContinueStatement>node).label;
            loop: while (node.parent) {
                var child = node;
                node = node.parent;
                switch (node.kind) {
                case SyntaxKind.LabeledStatement:
                    if (label.text === (<LabeledStatement>node).label.text) {
                        return node;
                    }
                    break;
                case SyntaxKind.ForInStatement:
                case SyntaxKind.ForStatement:
                case SyntaxKind.WhileKeyword:
                    if (!label && child === (<IterationStatement>node).statement) {
                        return node;
                    }
                    break;
                }
            }
        } else {
            // Return statement:
            loop: while (node.parent) {
                var child = node;
                node = node.parent;
                switch (node.kind) {
                case SyntaxKind.ArrowFunction:
                case SyntaxKind.FunctionDeclaration:
                    return node;
                }
            }
        }
    }

    class NarrowResult {
        constructor(public results:Node[]) {
        }
        merge(other:NarrowResult):NarrowResult {
            var merged = this.results.concat(other.results).filter((item, pos, self) => {
                return self.indexOf(item) == pos;
            });
            return new NarrowResult(merged);
        }
    }

    function isNodeDescendentOf(node: Node, ancestor: Node): boolean {
        while (node) {
            if (node === ancestor) return true;
            node = node.parent;
        }
        return false;
    }

    // Called during checker the first time a BrandPropertyDeclaration is found.
    class Narrower {
        nodePostLinks:Map<NarrowResult[]> = {};
        containerScope:Node;
        observerLocation:Node;
        assignmentSet:Node[];

        getValue(parent:Node, prev:NarrowResult):NarrowResult {
            if (this.assignmentSet.indexOf(parent) > -1) {
                console.log("Wee");
                return new NarrowResult([parent]);
            }
            forEachChild(parent, (node) => {
                switch (node.kind) {
                    case SyntaxKind.BreakStatement:
                    case SyntaxKind.ContinueStatement:
                    case SyntaxKind.ReturnStatement:
                        // 'Shorten' the block returned from to only the topmost block we care about
                        var breakingContainer = (<ReturnStatement>node).breakingContainer;
                        if (isNodeDescendentOf(this.containerScope, breakingContainer)) {
                            breakingContainer = this.containerScope;
                        }
                        var id = breakingContainer.id;
                        this.nodePostLinks[id] = (this.nodePostLinks[id] || []);
                        this.nodePostLinks[id].push(prev);
                        break;
                    case SyntaxKind.ConditionalExpression:
                        prev = this.getValue((<ConditionalExpression>node).condition, prev);
                        var whenTrue = this.getValue((<ConditionalExpression>node).whenTrue, prev);
                        var whenFalse = this.getValue((<ConditionalExpression>node).whenFalse, prev);
                        prev = whenTrue.merge(whenFalse);
                        break;
                    case SyntaxKind.BinaryExpression:
                        // Consider the shortcircuting behaviour of && or ||
                        if ((<BinaryExpression>node).operator === SyntaxKind.AmpersandAmpersandToken ||
                            (<BinaryExpression>node).operator === SyntaxKind.BarBarToken) {
                            // Left always happens:
                            var left = this.getValue((<BinaryExpression>node).left, prev);
                            var right = this.getValue((<BinaryExpression>node).right, left);
                            prev = left.merge(right);
                        } else {
                            prev = this.getValue((<BinaryExpression>node).left, prev);
                            prev = this.getValue((<BinaryExpression>node).right, prev);
                        }
                        break;
                    case SyntaxKind.ForStatement:
                        forEach((<ForStatement>node).declarations, (decl) => {
                            prev = this.getValue(decl, prev);
                        });
                        prev = this.getValue((<ForStatement>node).initializer, prev);
                        prev = this.getValue((<ForStatement>node).condition, prev);
                        // Flow analysis: Assume we either enter for loops or dont
                        prev = this.getValue((<ForStatement>node).statement, prev).merge(prev);
                        break;
                    case SyntaxKind.ForInStatement:
                        forEach((<ForInStatement>node).declarations, (decl) => {
                            prev = this.getValue(decl, prev);
                        });
                        prev = this.getValue((<ForInStatement>node).expression, prev);
                        prev = this.getValue((<ForInStatement>node).variable, prev);
                        // Flow analysis: Assume we either enter for loops or dont
                        prev = this.getValue((<ForInStatement>node).statement, prev).merge(prev);
                        break;
                    case SyntaxKind.FunctionDeclaration:
                        prev = this.getValue((<FunctionDeclaration>node).body, prev).merge(prev);
                        break;
                    case SyntaxKind.WhileStatement:
                        prev = this.getValue((<WhileStatement>node).expression, prev);
                        // Flow analysis: Assume we either enter for loops or dont
                        prev = this.getValue((<WhileStatement>node).statement, prev).merge(prev);
                        break;
                    default:
                        prev = this.getValue(node, prev);
                }
            });
            return prev;
        }
    }

    export function getNarrowedTypeOfBrandProperty(propDecl:BrandPropertyDeclaration, location:Node) {
        var narrower = new Narrower();
        narrower.observerLocation = location;
        narrower.containerScope = findParent(propDecl.brandTypeDeclaration, SymbolFlags.HasLocals);
        narrower.assignmentSet = propDecl.bindingAssignments;
        var result = narrower.getValue(narrower.containerScope, new NarrowResult([null]));
        var name = <Identifier>propDecl.name;
        console.log(`Emitting ${name.text}, ${result.results.length} results`);
        forEach(result.results, (res) => {
            if (res == null) {
                console.log("NULL NULL");
            } else {
                printNode(res);
            }
        });
        // printNode(narrower.containerScope);
        console.log(`Done emitting ${name.text}`);
    }

    
    // As our binder passes through the function
    // we collect the relevant assignments of the brand property 
    // for once it leaves the block, and for when it 
    class BrandPropertyTypes {
        assignmentSets:Node[][];
        constructor(public nProps:number) {
            this.assignmentSets = new Array<Node[]>(nProps);
        }
        merge(other:BrandPropertyTypes):BrandPropertyTypes {
            var merged = new BrandPropertyTypes(this.assignmentSets.length);
            for (var i = 0; i < this.assignmentSets.length; i++) {
                var newAssignmentSet = this.assignmentSets[i].concat(other.assignmentSets[i]);
                merged.assignmentSets.push(newAssignmentSet);
            }
            return merged;
        }
    }

    class BrandTypeBinder {
        nodePostLinks:Map<BrandPropertyTypes[]> = {};
        containerScope:Node;
        
        getValue(parent:Node, prev:NarrowResult):NarrowResult {
            if (this.assignmentSet.indexOf(parent) > -1) {
                console.log("Wee");
                return new NarrowResult([parent]);
            }
            forEachChild(parent, (node) => {
                switch (node.kind) {
                    case SyntaxKind.BreakStatement:
                    case SyntaxKind.ContinueStatement:
                    case SyntaxKind.ReturnStatement:
                        // 'Shorten' the block returned from to only the topmost block we care about
                        var breakingContainer = (<ReturnStatement>node).breakingContainer;
                        if (isNodeDescendentOf(this.containerScope, breakingContainer)) {
                            breakingContainer = this.containerScope;
                        }
                        var id = breakingContainer.id;
                        this.nodePostLinks[id] = (this.nodePostLinks[id] || []);
                        this.nodePostLinks[id].push(prev);
                        break;
                    case SyntaxKind.ConditionalExpression:
                        prev = this.getValue((<ConditionalExpression>node).condition, prev);
                        var whenTrue = this.getValue((<ConditionalExpression>node).whenTrue, prev);
                        var whenFalse = this.getValue((<ConditionalExpression>node).whenFalse, prev);
                        prev = whenTrue.merge(whenFalse);
                        break;
                    case SyntaxKind.BinaryExpression:
                        // Consider the shortcircuting behaviour of && or ||
                        if ((<BinaryExpression>node).operator === SyntaxKind.AmpersandAmpersandToken ||
                            (<BinaryExpression>node).operator === SyntaxKind.BarBarToken) {
                            // Left always happens:
                            var left = this.getValue((<BinaryExpression>node).left, prev);
                            var right = this.getValue((<BinaryExpression>node).right, left);
                            prev = left.merge(right);
                        } else {
                            prev = this.getValue((<BinaryExpression>node).left, prev);
                            prev = this.getValue((<BinaryExpression>node).right, prev);
                        }
                        break;
                    case SyntaxKind.ForStatement:
                        forEach((<ForStatement>node).declarations, (decl) => {
                            prev = this.getValue(decl, prev);
                        });
                        prev = this.getValue((<ForStatement>node).initializer, prev);
                        prev = this.getValue((<ForStatement>node).condition, prev);
                        // Flow analysis: Assume we either enter for loops or dont
                        prev = this.getValue((<ForStatement>node).statement, prev).merge(prev);
                        break;
                    case SyntaxKind.ForInStatement:
                        forEach((<ForInStatement>node).declarations, (decl) => {
                            prev = this.getValue(decl, prev);
                        });
                        prev = this.getValue((<ForInStatement>node).expression, prev);
                        prev = this.getValue((<ForInStatement>node).variable, prev);
                        // Flow analysis: Assume we either enter for loops or dont
                        prev = this.getValue((<ForInStatement>node).statement, prev).merge(prev);
                        break;
                    case SyntaxKind.FunctionDeclaration:
                        prev = this.getValue((<FunctionDeclaration>node).body, prev).merge(prev);
                        break;
                    case SyntaxKind.WhileStatement:
                        prev = this.getValue((<WhileStatement>node).expression, prev);
                        // Flow analysis: Assume we either enter for loops or dont
                        prev = this.getValue((<WhileStatement>node).statement, prev).merge(prev);
                        break;
                    default:
                        prev = this.getValue(node, prev);
                }
            });
            return prev;
        }
    }

    export function bindBrandTypeBasedOnLocalBlock(propDecl:BrandTypeDeclaration, container:Node) {
        // Set to parent, unless we are in the global scope:
        var parentScope = container.parent || container;
        while (!parentScope.locals) {
            parentScope = parentScope.parent;
        }
        var brandTypeBinder = new BrandTypeBinder();
        brandTypeBinder.containerScope = parentScope;
    }

    // export function getNarrowedTypeOfBrandProperty(location:PropertyAccessExpression) {
    //     
    // }
}
