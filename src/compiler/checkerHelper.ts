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

    export function isNodeDescendentOf(node: Node, ancestor: Node): boolean {
        while (node) {
            if (node === ancestor) return true;
            node = node.parent;
        }
        return false;
    }

    export function findBreakingScope(node:Node):Node {
        if (node.kind === SyntaxKind.BreakKeyword || node.kind === SyntaxKind.ContinueKeyword) {
            var label = (<BreakOrContinueStatement>node).label;
            while (node.parent) {
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
            while (node.parent) {
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

    export function getNarrowedTypeOfBrandProperty(propDecl:BrandPropertyDeclaration, location:Node) {
        // var narrower = new Narrower();
        // narrower.observerLocation = location;
        // narrower.containerScope = findParent(propDecl.brandTypeDeclaration, SymbolFlags.HasLocals);
        // narrower.assignmentSet = propDecl.bindingAssignments;
        // var result = narrower.getValue(narrower.containerScope, new NarrowResult([null]));
        // var name = <Identifier>propDecl.name;
        // console.log(`Emitting ${name.text}, ${result.results.length} results`);
        // forEach(result.results, (res) => {
        //     if (res == null) {
        //         console.log("NULL NULL");
        //     } else {
        //         printNode(res);
        //     }
        // });
        // // printNode(narrower.containerScope);
        // console.log(`Done emitting ${name.text}`);
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
            var merged = new BrandPropertyTypes(Math.max(this.assignmentSets.length, other.assignmentSets.length));
            for (var i = 0; i < merged.assignmentSets.length; i++) {
                var newAssignmentSet = (this.assignmentSets[i]||[]).concat((other.assignmentSets[i]||[]));
                merged.assignmentSets.push(newAssignmentSet);
            }
            return merged;
        }

        get(brandPropId:number):Node[] {
            return this.assignmentSets[brandPropId];
        }

        copyAndSet(brandPropId:number, node:Node) {
            var copy = new BrandPropertyTypes(Math.max(this.assignmentSets.length, (brandPropId+1)));
            for (var i = 0; i < copy.assignmentSets.length; i++) {
                copy.assignmentSets[i] = (brandPropId == i) ? [node] : this.assignmentSets[i];
            }
            return copy;
        }
    }
    
    // Is this an expression of type <identifier>.<identifier> = <expression>?
    function isPropertyAssignmentForLocalVariable(node:Node) {
        if (node.kind === SyntaxKind.BinaryExpression && (<BinaryExpression>node).operator === SyntaxKind.EqualsToken) {
            var binNode = <BinaryExpression> node;
            if (binNode.left.kind === SyntaxKind.PropertyAccessExpression) {
                return true;
            }
        }
        return false;
    }

    class BrandTypeBinder {
        brandTypeDecl:BrandTypeDeclaration;
        nodePostLinks:Map<BrandPropertyTypes[]> = {};
        declareSymbol:_declareSymbol;
        // Tie properties to an ID assigned sequentially upon first visit
        propNameToId = {};
        nextPropNameId = 0;
        containerScope:Node;

        getPropId(str:string):number {
            return this.propNameToId[str] = this.propNameToId[str] || (this.nextPropNameId++);
        }

        castIfRelevantPropertyAccess(node:Node):PropertyAccessExpression {
            if (node.kind !== SyntaxKind.PropertyAccessExpression) {
                return null;
            }
            var propAccess = <PropertyAccessExpression>node;
            if (propAccess.expression.kind !== SyntaxKind.Identifier) {
                return null;
            }

            // Search for an associated VariableDeclaration with "var <identifier> : brand <identifier".
            var varDecl = findVariableDeclarationForIdentifier(this.containerScope, <Identifier> propAccess.expression);
            if (!varDecl || !varDecl.type || varDecl.type.brandTypeDeclaration !== this.brandTypeDecl) {
                return null;
            }
            return <PropertyAccessExpression> node;
        }

        // Set types for an expression at the current location:
        setAssignmentsIfRelevantPropertyAccess(prev:BrandPropertyTypes, node:Node): boolean{
            var propAccess = this.castIfRelevantPropertyAccess(node);
            if (!propAccess) return false;
            // Store relevant assignments for type calculation:
            if (propAccess.relevantBrandAssignments) throw new Error("ERROR use grep");
            propAccess.relevantBrandAssignments = <Expression[]>prev.get(this.getPropId(propAccess.name.text));
            return true;
        }

        /* TODO: Detect any sort of assignment operator applied to our brand variable */
        scanIfBindingAssignment(prev:BrandPropertyTypes, node:Node): BrandPropertyTypes {
            // Detect type-building assignment for brand-types. We are interested in the case when...
            // 1. The LHS is a PropertyAccessExpression with form "<identifier>.<identifier>".
            // 2. <variable> has an associated VariableDeclaration with form "var <identifier> : brand <identifier".
            // No restrictions on RHS, but we are only interested in its statically known type.
            // Match for PropertyAccessExpression with "<identifier>.<identifier>".
            if (node.kind !== SyntaxKind.BinaryExpression || (<BinaryExpression>node).operator !== SyntaxKind.EqualsToken) {
                return null;
            }

            var propAccess = this.castIfRelevantPropertyAccess((<BinaryExpression> node).left);
            var value = (<BinaryExpression> node).right;

            if (!hasProperty(this.brandTypeDecl.symbol.members, propAccess.name.text)) {
                // Create a property declaration for the brand-type symbol list:
                var propertyNode = <BrandPropertyDeclaration> new (objectAllocator.getNodeConstructor(SyntaxKind.BrandProperty))();
                propertyNode.name = propAccess.name; // Right-hand <identifier>
                propertyNode.pos = propAccess.pos;
                propertyNode.end = propAccess.end;
                propertyNode.parent = this.containerScope;
                propertyNode.brandTypeDeclaration = this.brandTypeDecl;
                this.declareSymbol(this.brandTypeDecl.symbol.members, this.brandTypeDecl.symbol, propertyNode, SymbolFlags.Property, 0);
            }

            return prev.copyAndSet(this.getPropId(propAccess.name.text), value);
        }

        scan(node:Node, prev:BrandPropertyTypes):BrandPropertyTypes {
            /* If we have a binding assignment, then we can return immediately: */
            var bindingResult = this.scanIfBindingAssignment(prev, node);
            if (bindingResult != null) {
                return bindingResult;
            }
            if (this.setAssignmentsIfRelevantPropertyAccess(prev, node)) {
                return prev;
            }

            /* Otherwise, continue recursive iteration: */
            forEachChild(node, (child) => {
                switch (child.kind) {
                    case SyntaxKind.BreakStatement:
                    case SyntaxKind.ContinueStatement:
                    case SyntaxKind.ReturnStatement:
                        // 'Shorten' the block returned from to only the topmost block we care about
                        var breakingContainer = (<ReturnStatement>child).breakingContainer;
                        if (isNodeDescendentOf(this.containerScope, breakingContainer)) {
                            breakingContainer = this.containerScope;
                        }
                        var id = breakingContainer.id;
                        this.nodePostLinks[id] = (this.nodePostLinks[id] || []);
                        this.nodePostLinks[id].push(prev);
                        break;
                    case SyntaxKind.ConditionalExpression:
                        prev = this.scan((<ConditionalExpression>child).condition, prev);
                        var whenTrue = this.scan((<ConditionalExpression>child).whenTrue, prev);
                        var whenFalse = this.scan((<ConditionalExpression>child).whenFalse, prev);
                        // Flow analysis: Merge the result of the left and the right
                        prev = whenTrue.merge(whenFalse);
                        break;
                    case SyntaxKind.BinaryExpression:
                        // Consider the shortcircuting behaviour of && or ||
                        if ((<BinaryExpression>child).operator === SyntaxKind.AmpersandAmpersandToken ||
                            (<BinaryExpression>child).operator === SyntaxKind.BarBarToken) {
                            // Flow analysis: Merge the result of the left and of the left-then-right
                            var left = this.scan((<BinaryExpression>child).left, prev);
                            var right = this.scan((<BinaryExpression>child).right, left);
                            prev = left.merge(right);
                        } else {
                            prev = this.scan((<BinaryExpression>child).left, prev);
                            prev = this.scan((<BinaryExpression>child).right, prev);
                        }
                        break;
                    case SyntaxKind.ForStatement:
                        forEach((<ForStatement>child).declarations, (decl) => {
                            prev = this.scan(decl, prev);
                        });
                        prev = this.scan((<ForStatement>child).initializer, prev);
                        prev = this.scan((<ForStatement>child).condition, prev);
                        // Flow analysis: Merge the result of entering the loop and of not
                        prev = this.scan((<ForStatement>child).statement, prev).merge(prev);
                        break;
                    case SyntaxKind.ForInStatement:
                        forEach((<ForInStatement>child).declarations, (decl) => {
                            prev = this.scan(decl, prev);
                        });
                        prev = this.scan((<ForInStatement>child).expression, prev);
                        prev = this.scan((<ForInStatement>child).variable, prev);
                        // Flow analysis: Merge the result of entering the loop and of not
                        prev = this.scan((<ForInStatement>child).statement, prev).merge(prev);
                        break;
                    case SyntaxKind.FunctionDeclaration:
                        prev = this.scan((<FunctionDeclaration>child).body, prev).merge(prev);
                        break;
                    case SyntaxKind.WhileStatement:
                        prev = this.scan((<WhileStatement>child).expression, prev);
                        // Flow analysis: Merge the result of entering the loop and of not
                        prev = this.scan((<WhileStatement>child).statement, prev).merge(prev);
                        break;
                    default:
                        prev = this.scan(child, prev);
                }
            });
            return prev;
        }
    }

    function forEachBrandProperty(scope:Node, callback: (BrandPropertyDeclaration)=>void) {
        for (var key in scope.locals) {
            if (hasProperty(scope.locals, key)) {
                if (scope.locals[key].flags & SymbolFlags.Property) {
                    if (scope.locals[key].declarations && scope.locals[key].declarations[0].kind == SyntaxKind.BrandProperty) {
                        continue;
                    }
                    callback(<BrandPropertyDeclaration> scope.locals[key].declarations[0]);
                }
            }
        }
    }

    function hasBrandTypeDeclaration(scope:Node):boolean {
        if (!scope.locals) {
            return false;
        }
        for (var key in scope.locals) {
            if (hasProperty(scope.locals, key)) {
                if (scope.locals[key].flags & SymbolFlags.Brand) {
                    return true;
                }
            }
        }
        return false;
    }

    // We take declareSymbol as a parameter, as this is a closure
    // We keep its signature as a type for convenience.
    export type _declareSymbol = (symbols: SymbolTable, parent: Symbol, node: Declaration, includes: SymbolFlags, excludes: SymbolFlags) => Symbol;

    // Must be run AFTER variables within the local scope have bindings.
    // Afterwards:
    //  - all statically known brand property lookup nodes within the declaration block 
    //    will have a list of relevant assignment expressions
    //  - the BrandTypeDeclaration will have all found brand property assignments declared as symbols
    //  - the resulting brand properties will have a list of relevant assignment expressions
    // As well, all 
    function bindBrandTypeBasedOnLocalBlock(brandTypeDecl:BrandTypeDeclaration, declareSymbol:_declareSymbol) {
        // Set to parent, unless we are in the global scope:
        var parentScope = brandTypeDecl.parent;
        while (!parentScope.locals) {
            parentScope = parentScope.parent;
        }
        var brandTypeBinder = new BrandTypeBinder();
        brandTypeBinder.brandTypeDecl = brandTypeDecl;
        brandTypeBinder.containerScope = parentScope;
        brandTypeBinder.declareSymbol = declareSymbol;
        var assignmentResults = brandTypeBinder.scan(parentScope, new BrandPropertyTypes(0));
        forEachBrandProperty(brandTypeDecl, (brandPropDecl:BrandPropertyDeclaration) => {
            var name = (<Identifier>brandPropDecl.name).text;
            brandPropDecl.bindingAssignments = <Expression[]>assignmentResults.get(this.getPropId(name));
        });
    }

    export function bindBrandPropertiesInScopeAfterInitialBinding(scope:Node, declareSymbol:_declareSymbol) {
        // First, see if we are wasting our time scanning this scope:
        if (!hasBrandTypeDeclaration(scope)) {
            return false;
        }

        // Find all relevant brand type declarations.
        // We do not descend into subblocks, which are handled separately.
        function resolveBrandTypeDeclarations(node:Node) {
            forEachChild(node, (child) => {
                // Do not descend into subblocks:
                if (child.locals) return;
                if (child.kind === SyntaxKind.BrandTypeDeclaration) {
                    bindBrandTypeBasedOnLocalBlock(<BrandTypeDeclaration>child, declareSymbol);
                } else {
                    resolveBrandTypeDeclarations(child);
                }
            });
        }
        resolveBrandTypeDeclarations(scope);
    }
}
