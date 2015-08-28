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
    
    function printRecursor(node:Node, print) {
        if (node == null) return console.log(node)
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
        case SyntaxKind.BrandProperty: return print(node, "BrandProperty");
        case SyntaxKind.SourceFile: return print(node, "SourceFile");
        default: return print(node, `<${node.kind}>`);
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
                    } else if (node[str] != null && node[str].kind == SyntaxKind.Identifier) {
                        addendum.push(`${str}: ${node[str].text}`);
                    }
                }
            }
            console.log(`${indentStr}${name} (${addendum.join(', ')})`);
        }
        function printSwitch(node) {
            printRecursor(node, print)
        }
        printSwitch(parent);
    }
    export function printNodeDeep(parent:Node, indent = 0) {
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
        function printSwitch(node) {
            printRecursor(node, print)
        }
        printSwitch(parent);
    }

    
      // [ConcreteTypeScript] Find variable declaration associated with identifier, or 'null' if not a VariableDeclaration
      export function findVariableDeclarationForIdentifier(location: Node, identifier: Identifier): VariableDeclaration {
          while (location) {
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
          // Not found, let checker handle error reporting:
          return null;
      }

    // // [ConcreteTypeScript]
    // export function bindPropertyAssignment(propAccess: PropertyAccessExpression, value: Expression): void {
    //     // Detect type-building assignment for brand-types. We are interested in the case when...
    //     // 1. The LHS is a PropertyAccessExpression with form "<identifier>.<identifier>".
    //     // 2. <variable> has an associated VariableDeclaration with form "var <identifier> : brand <identifier".
    //     // No restrictions on RHS, but we are only interested in its statically known type.
    //     // Match for PropertyAccessExpression with "<identifier>.<identifier>".
    //     if (propAccess.expression.kind !== SyntaxKind.Identifier) {
    //         return;
    //     }
    //     // Search for an associated VariableDeclaration with "var <identifier> : brand <identifier".
    //     var varDecl = findVariableDeclarationForIdentifier(/*TODO: container*/ null, <Identifier> propAccess.expression);
    //     if (!varDecl || !varDecl.type || !varDecl.type.brandTypeDeclaration) {
    //         return;
    //     }
    // 
    //     var brandTypeDecl = varDecl.type.brandTypeDeclaration;
    //     if (hasProperty(brandTypeDecl.symbol.members, propAccess.name.text)) {
    //         var symbol = brandTypeDecl.symbol.members[propAccess.name.text];
    //         var propertyNode = <BrandPropertyDeclaration> symbol.declarations[0];
    //     //    propertyNode.bindingAssignments.push(value);
    //     } else {
    //         // Create a property declaration for the brand-type symbol list:
    //         var propertyNode = <BrandPropertyDeclaration> new (objectAllocator.getNodeConstructor(SyntaxKind.BrandProperty))();
    //         propertyNode.name = propAccess.name; // Right-hand <identifier>
    //         propertyNode.pos = propAccess.pos;
    //         propertyNode.end = propAccess.end;
    //         propertyNode.parent = /*TODO: container*/ null;
    //         propertyNode.brandTypeDeclaration = brandTypeDecl;
    //         // propertyNode.bindingAssignments = [value];
    //         declareSymbol(brandTypeDecl.symbol.members, brandTypeDecl.symbol, propertyNode, SymbolFlags.Property, 0);
    //     }
    // }

    export function isNodeDescendentOf(node: Node, ancestor: Node): boolean {
        while (node) {
            if (node === ancestor) return true;
            node = node.parent;
        }
        return false;
    }

    export function findBreakingScope(node:Node):Node {
        if (node.kind === SyntaxKind.BreakStatement || node.kind === SyntaxKind.ContinueStatement) {
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
                case SyntaxKind.SwitchStatement:
                    if (!label) {
                        return node;
                    }
                    break;
                case SyntaxKind.ForInStatement:
                case SyntaxKind.ForStatement:
                case SyntaxKind.WhileStatement:
                    if (!label && child === (<IterationStatement>node).statement) {
                        return node;
                    }
                    break;
                }
            }
            throw new Error("Unexpected!");
        } else {
            // Return statement:
            while (node.parent) {
                var child = node;
                node = node.parent;
                switch (node.kind) {
                case SyntaxKind.ArrowFunction:
                case SyntaxKind.FunctionExpression:
                case SyntaxKind.FunctionDeclaration:
                    return node;
                }
            }
        }
    }

    // export function getNarrowedTypeOfBrandProperty(propDecl:BrandPropertyDeclaration, location:Node) {
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
    // }

    
    // As our binder passes through the function
    // we collect the relevant assignments of the brand property 
    // for once it leaves the block, and for when it 
    export class BrandPropertyAnalysis {
        // Given a series of sequential assignments, we take the type
        // of the first assignment, and the proceding assignments
        // must be subtypes. 
        // 
        // However, we special case assignments such as:
        // var a = 1;
        // if (actuallyItsAString) a = "string";
        //
        // The reason being that this sort of conditional assignment is idiomatic.
        constructor(public declaration:BrandPropertyDeclaration, 
                    public assignments:Expression[], 
                    public definitelyAssigned:boolean,
                    public conditionalBarrier:boolean = false
) {
        }
        merge(other:BrandPropertyAnalysis):BrandPropertyAnalysis {
            var expressions:Expression[] = [].concat(this.assignments);
            forEach(other.assignments, (expr) => {
                if (expressions.indexOf(expr) === -1) expressions.push(expr);
            });
            var definitelyAssigned:boolean = (other.definitelyAssigned && this.definitelyAssigned);
            return new BrandPropertyAnalysis(this.declaration, expressions, definitelyAssigned);
        }
        passConditionalBarrier():BrandPropertyAnalysis {
            return new BrandPropertyAnalysis(this.declaration, this.assignments, this.definitelyAssigned, true);
        }
        scanAssignment(node:Expression):BrandPropertyAnalysis {
            var nodeAnalysis = new BrandPropertyAnalysis(this.declaration, [node], true);
            if (!this.definitelyAssigned) {
                return nodeAnalysis;
            }
            if (this.conditionalBarrier) {
                return this.merge(nodeAnalysis);
            }
            return this;
        }
    }

    export class BrandPropertyTypes {
        assignmentSets:BrandPropertyAnalysis[];
        constructor(public declarations:BrandPropertyDeclaration[]) {
            this.assignmentSets = new Array<BrandPropertyAnalysis>(declarations.length);
            for (var i = 0; i < this.assignmentSets.length; i++) {
                this.assignmentSets[i] = new BrandPropertyAnalysis(declarations[i], [], false);
            }
        }
        merge(other:BrandPropertyTypes):BrandPropertyTypes {
            var merged = new BrandPropertyTypes(this.declarations);
            for (var i = 0; i < merged.assignmentSets.length; i++) {
                merged.assignmentSets[i] = this.assignmentSets[i].merge(other.assignmentSets[i]);
            }
            return merged;
        }

        get(brandPropId:number):BrandPropertyAnalysis {
            return this.assignmentSets[brandPropId];
        }

        passConditionalBarrier():BrandPropertyTypes {
            var passed = new BrandPropertyTypes(this.declarations);
            for (var i = 0; i < passed.assignmentSets.length; i++) {
                passed.assignmentSets[i] = this.assignmentSets[i].passConditionalBarrier();
            }
            return passed;
        }
        scanAssignment(brandPropId:number, node:Expression) {
            if (node == null) throw new Error("node == null!");
            var copy = new BrandPropertyTypes(this.declarations);
            for (var i = 0; i < copy.assignmentSets.length; i++) {
                // If the previous value had any null types, we use our current assignment as a 'refinement'.
                // The logic is, all sequential writes need to be consistent.
                if (brandPropId === i) {
                    copy.assignmentSets[i] = this.assignmentSets[i].scanAssignment(node);
                } else {
                    copy.assignmentSets[i] = this.assignmentSets[i];
                }
            }
            return copy;
        }
    }

    // Is this an expression of type <identifier>.<identifier> = <expression>?
    export function isPropertyAssignmentForLocalVariable(node:Node) {
        if (node.kind === SyntaxKind.BinaryExpression && (<BinaryExpression>node).operator === SyntaxKind.EqualsToken) {
            var binNode = <BinaryExpression> node;
            if (binNode.left.kind === SyntaxKind.PropertyAccessExpression) {
                return true;
            }
        }
        return false;
    }
    export function getBrandTypesInScope(block:Node):BrandTypeDeclaration[] {
        if (!block.locals) return [];
        var declarations:BrandTypeDeclaration[] = [];
        for (var symbolName in block.locals) {
            if (hasProperty(block.locals, symbolName)) {
                var symbol = block.locals[symbolName];
                forEach(symbol.declarations || [], (declaration) => {
                    if (declaration.kind == SyntaxKind.BrandTypeDeclaration) {
                        declarations.push(<BrandTypeDeclaration>declaration);
                    }
                });
            }
        }
        return declarations;
    }

    export function getBrandTypeVarDeclarations(block:Node):VariableDeclaration[] {
        if (!block.locals) return [];
        var declarations:VariableDeclaration[] = [];
        for (var symbolName in block.locals) {
            if (hasProperty(block.locals, symbolName)) {
                var symbol = block.locals[symbolName];
                forEach(symbol.declarations || [], (declaration) => {
                    if (declaration.kind == SyntaxKind.VariableDeclaration) {
                        var typeNode = (<VariableDeclaration>declaration).type;
                        if (typeNode && typeNode.brandTypeDeclaration) {
                            declarations = (declarations || []);
                            declarations.push(<VariableDeclaration>declaration);
                        }
                    }
                });
            }
        }
        return declarations;
    }

    class BrandTypeBinder {
        brandTypeDecl:BrandTypeDeclaration;
        nodePostLinks:Map<BrandPropertyTypes[]> = {};
        declareSymbol:_declareSymbol;
        // Tie properties to an ID assigned sequentially upon first visit
        propNameToId = {};
        nextPropNameId = 0;
        containerScope:Node;

        getPropId(str:string, dontCreate?:boolean):number {
            if (this.propNameToId[str] != null) return this.propNameToId[str];
            if (dontCreate) {console.log("NAME", str); console.log(this.propNameToId); throw new Error("DontCreate");}
            var id = this.nextPropNameId++;
            this.propNameToId[str] = id;
            return id;
        }

        castIfRelevantPropertyAccess(node:Node):PropertyAccessExpression {
            if (node.kind !== SyntaxKind.PropertyAccessExpression) {
                return null;
            }
            console.log("STAGE1")
            var propAccess = <PropertyAccessExpression>node;
            if (propAccess.expression.kind !== SyntaxKind.Identifier) {
                return null;
            }

            // Search for an associated VariableDeclaration with "var <identifier> : brand <identifier".
            var varDecl = findVariableDeclarationForIdentifier(propAccess, <Identifier> propAccess.expression);
            varDecl && varDecl.type && printNodeDeep(varDecl.type.brandTypeDeclaration);
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
            if (propAccess.brandAnalysis) throw new Error("ERROR use grep");
            propAccess.brandAnalysis = prev.get(this.getPropId(propAccess.name.text));
            return true;
        }

        /* TODO: Detect any sort of assignment operator applied to our brand variable */
        scanIfBindingAssignment(prev:BrandPropertyTypes, node:BinaryExpression): BrandPropertyTypes {
            // Detect type-building assignment for brand-types. We are interested in the case when...
            // 1. The LHS is a PropertyAccessExpression with form "<identifier>.<identifier>".
            // 2. <variable> has an associated VariableDeclaration with form "var <identifier> : brand <identifier".
            // No restrictions on RHS, but we are only interested in its statically known type.
            // Match for PropertyAccessExpression with "<identifier>.<identifier>".
            console.log(node.operator, SyntaxKind.EqualsToken);
            if (node.operator !== SyntaxKind.EqualsToken) {
                return null;
            }

            var propAccess = this.castIfRelevantPropertyAccess(node.left);
            if (!propAccess) {
                return null;
            }
            var value = (<BinaryExpression> node).right;
            console.log("GOT PROPERAC")
            printNode(value);

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
            
            return prev.scanAssignment(this.getPropId(propAccess.name.text), value);
        }

        scan(node:Node, prev:BrandPropertyTypes):BrandPropertyTypes {
            if (typeof node === "undefined") {
                return prev;
            }

            if (this.setAssignmentsIfRelevantPropertyAccess(prev, node)) {
                return prev;
            }

            /* Otherwise, continue recursive iteration: */
            forEachChild(node, (child) => {
                console.log("SCANNING"); printNodeDeep(child)
                switch (child.kind) {
                    case SyntaxKind.BreakStatement:
                    case SyntaxKind.ContinueStatement:
                    case SyntaxKind.ReturnStatement:
                        // Truncate the scope to only the topmost block we care about
                        var breakingContainer = (<ReturnStatement>child).breakingContainer;
                        if (isNodeDescendentOf(this.containerScope, breakingContainer)) {
                            breakingContainer = this.containerScope;
                        }
                        var id = breakingContainer.id;
                        this.nodePostLinks[id] = (this.nodePostLinks[id] || []);
                        prev = this.scan(child, prev);
                        this.nodePostLinks[id].push(prev);
                        break;
                    case SyntaxKind.SwitchStatement:
                        prev = this.scan((<SwitchStatement>child).expression, prev);
                        var beforeCases = prev;
                        // Flow analysis: Merge the result of every case
                        forEach((<SwitchStatement>child).clauses, (clause) => {
                            prev = prev.merge(this.scan(clause, prev));
                        });
                        break;
                        
                    case SyntaxKind.ConditionalExpression:
                        prev = this.scan((<ConditionalExpression>child).condition, prev);
                        var whenTrue = this.scan((<ConditionalExpression>child).whenTrue, prev);
                        var whenFalse = this.scan((<ConditionalExpression>child).whenFalse, prev);
                        // Flow analysis: Merge the result of the left and the right
                        prev = whenTrue.merge(whenFalse);
                        break;
                    case SyntaxKind.BinaryExpression:
                        /* Check if we have a relevant binding assignment: */
                        var bindingResult = this.scanIfBindingAssignment(prev, <BinaryExpression>child);
                        if (bindingResult !== null) {
                            prev = bindingResult;
                        }
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
                        var bodyScan = this.scan((<FunctionDeclaration>child).body, prev);
                        prev = (this.containerScope === child) ? prev : bodyScan.merge(prev);
                        break;
                    case SyntaxKind.IfStatement:
                        prev = this.scan((<IfStatement>child).expression, prev);
                        var ifTrue = this.scan((<IfStatement>child).thenStatement, prev.passConditionalBarrier());
                        var ifFalse = this.scan((<IfStatement>child).elseStatement, prev.passConditionalBarrier());
                        prev = ifTrue.merge(ifFalse);
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
            if (typeof this.nodePostLinks[node.id] !== "undefined") {
                this.nodePostLinks[node.id].forEach( links => {
                    prev = prev.merge(links);
                });
            }
            return prev;
        }
    }

    export function getBrandProperties(brandTypeDecl:Node):BrandPropertyDeclaration[] {
        var properties:BrandPropertyDeclaration[] = [];
        for (var key in brandTypeDecl.symbol.members) {
            if (hasProperty(brandTypeDecl.symbol.members, key)) {
                var member = brandTypeDecl.symbol.members[key];
                if (member.flags & SymbolFlags.Property) {
                    if (!member.declarations || member.declarations[0].kind !== SyntaxKind.BrandProperty) {
                        continue;
                    }
                    properties.push(<BrandPropertyDeclaration> member.declarations[0]);
                }
            }
        }
        return properties;
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
    function bindBrandTypeBasedOnVarScope(scope:Node, brandTypeDecl:BrandTypeDeclaration, declareSymbol:_declareSymbol) {
        var brandTypeBinder = new BrandTypeBinder();
        brandTypeBinder.brandTypeDecl = brandTypeDecl;
        brandTypeBinder.containerScope = scope;
        brandTypeBinder.declareSymbol = declareSymbol;
        var properties = getBrandProperties(brandTypeDecl);
        var assignmentResults = brandTypeBinder.scan(scope, new BrandPropertyTypes(properties));
        forEach(properties, (brandPropDecl:BrandPropertyDeclaration) => {
            var name = (<Identifier>brandPropDecl.name).text;
            var assignments = assignmentResults.get(brandTypeBinder.getPropId(name, true));
            // console.log(brandTypeBinder.getPropId(name));
            if (assignments == null) {console.log(assignmentResults.assignmentSets); throw new Error("WWWEEERE");}
            brandPropDecl.bindingAssignments = assignments;
        });
    }

    export function bindBrandPropertiesInScopeAfterInitialBinding(scope:Node, declareSymbol:_declareSymbol) {
        // Find all relevant brand type declarations bound to the current scope.
        forEach(getBrandTypeVarDeclarations(scope), (declaration:VariableDeclaration) => {
            console.log("DECLARING " + declaration.name.text);
            bindBrandTypeBasedOnVarScope(scope, declaration.type.brandTypeDeclaration, declareSymbol);
        });
    }
}  
