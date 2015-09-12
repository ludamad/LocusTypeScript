/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="utilities.ts"/>
/// <reference path="printNode.ts"/>
/// <reference path="brandTypeQueries.ts"/>

module ts {

    // As our binder passes through the function
    // we collect the relevant assignments of the brand property 
    // for once it leaves the block, and for when it 
    export class FlowTypeAnalysis {
        // Given a series of sequential assignments, we take the type
        // of the first assignment, and the proceding assignments
        // must be subtypes. 
        // 
        // However, we special case assignments such as:
        // var a = 1;
        // if (actuallyItsAString) a = "string";
        //
        // The reason being that this sort of conditional assignment is idiomatic.
        constructor(private binder:BrandTypeBinder, 
                    public index:number,
                    public assignments:Expression[], 
                    public definitelyAssigned:boolean,
                    public conditionalBarrier:boolean = false
    ) {
        }
        getDeclaration() {
            return this.binder.allProps[this.index];
        }
        isPrototypeProperty() {
            return this.binder.propIdIsPrototype[this.index];
        }
        merge(other:FlowTypeAnalysis):FlowTypeAnalysis {
            Debug.assert(other.index === this.index);
            var expressions:Expression[] = [].concat(this.assignments);
            forEach(other.assignments, (expr) => {
                if (expressions.indexOf(expr) === -1) expressions.push(expr);
            });
            var definitelyAssigned:boolean = (other.definitelyAssigned && this.definitelyAssigned);
            return new FlowTypeAnalysis(this.binder, this.index, expressions, definitelyAssigned);
        }
        passConditionalBarrier():FlowTypeAnalysis {
            return new FlowTypeAnalysis(this.binder, this.index, this.assignments, this.definitelyAssigned, true);
        }
        scanAssignment(node:Expression):FlowTypeAnalysis {
            if (!this.definitelyAssigned || this.conditionalBarrier) {
                return new FlowTypeAnalysis(this.binder, this.index, [node], true);
            }
            return this;
        }
    }

    export const enum MergeKind {
        ALL, NORMAL_PROPS, PROTO_PROPS
    }
    export class BrandPropertyTypes {
        assignmentSets:FlowTypeAnalysis[];
        constructor(private binder:BrandTypeBinder) {
            this.assignmentSets = new Array<FlowTypeAnalysis>(binder.allProps.length);
            for (var i = 0; i < this.assignmentSets.length; i++) {
                this.assignmentSets[i] = new FlowTypeAnalysis(binder, i, [], false);
            }
        }
        merge(other:BrandPropertyTypes, kind:MergeKind = MergeKind.ALL):BrandPropertyTypes {
            var merged = new BrandPropertyTypes(this.binder);
            var criteria = (i) => true;
            if (kind === MergeKind.NORMAL_PROPS) {
                criteria = (i) => !this.binder.propIdIsPrototype[i];
            } else if (kind === MergeKind.PROTO_PROPS) {
                criteria = (i) => this.binder.propIdIsPrototype[i];;
            }
            for (var i = 0; i < merged.assignmentSets.length; i++) {
                if (criteria(i)) {
                    // Merge:
                    merged.assignmentSets[i] = (this.assignmentSets[i] || merged.assignmentSets[i]).merge(other.assignmentSets[i] || merged.assignmentSets[i]);
                } else {
                    // Dont merge:
                    merged.assignmentSets[i] = this.assignmentSets[i] || merged.assignmentSets[i];
                }
            }
            return merged;
        }

        get(brandPropId:number):FlowTypeAnalysis {
            return this.assignmentSets[brandPropId];
        }
        passConditionalBarrier():BrandPropertyTypes {
            var passed = new BrandPropertyTypes(this.binder);
            for (var i = 0; i < passed.assignmentSets.length; i++) {
                // TODO think about corner cases here
                passed.assignmentSets[i] = (this.assignmentSets[i] || passed.assignmentSets[i]).passConditionalBarrier();
            }
            return passed;
        }
        
        _scanPropertyAssignment(propAccess:PropertyAccessExpression) {
            if (!hasProperty(this.binder.brandTypeDecl.symbol.members, propAccess.name.text)) { 
                // Create a property declaration for the brand-type symbol list:
                var propertyNode = <BrandPropertyDeclaration> new (objectAllocator.getNodeConstructor(SyntaxKind.BrandProperty))();
                propertyNode.name = propAccess.name; // Right-hand <identifier>
                propertyNode.pos = propAccess.pos;
                propertyNode.end = propAccess.end;
                propertyNode.parent = this.binder.declarationScope;
                propertyNode.brandTypeDeclaration = this.binder.brandTypeDecl;
                this.binder.declareSymbol(this.binder.brandTypeDecl.symbol.members, this.binder.brandTypeDecl.symbol, propertyNode, SymbolFlags.Property, 0);
                this.binder.fillProp(propertyNode);
            }
            // console.log("GOT _BRAND PROP " + (<Identifier>propertyNode.name).text)
            // Incorporate the assignment information:
            return this.binder.getPropId(propAccess.name.text);
        }
        
        _scanProtoPropertyAssignment(propAccess:PropertyAccessExpression) {
            var protoBrandType = this.binder.brandTypeDecl.prototypeBrandDeclaration;
            if (!protoBrandType) {
                // Create the prototype brand type:
                protoBrandType = <BrandTypeDeclaration> new (objectAllocator.getNodeConstructor(SyntaxKind.BrandTypeDeclaration))();
                protoBrandType.name = (<PropertyAccessExpression>propAccess.expression).name; // Right-hand <identifier>
                protoBrandType.pos = propAccess.pos;
                protoBrandType.end = propAccess.end;
                protoBrandType.scope = this.binder.containerScope;
                // Set to parent of FunctionDeclaration:
                protoBrandType.parent = this.binder.brandTypeDecl;
                this.binder.brandTypeDecl.prototypeBrandDeclaration = protoBrandType;
                this.binder.declareSymbol(this.binder.brandTypeDecl.symbol.exports, this.binder.brandTypeDecl.symbol, protoBrandType, SymbolFlags.Brand|SymbolFlags.ExportType, SymbolFlags.BrandTypeExcludes);
            }
            if (!hasProperty(protoBrandType.symbol.members, propAccess.name.text)) { 
                // Create a property declaration for the brand-type symbol list:
                var propertyNode = <BrandPropertyDeclaration> new (objectAllocator.getNodeConstructor(SyntaxKind.BrandProperty))();
                propertyNode.name = propAccess.name; // Right-hand <identifier>
                propertyNode.pos = propAccess.pos;
                propertyNode.end = propAccess.end;
                propertyNode.parent = protoBrandType;
                propertyNode.brandTypeDeclaration = this.binder.brandTypeDecl;
                this.binder.declareSymbol(protoBrandType.symbol.members, protoBrandType.symbol, propertyNode, SymbolFlags.Property, 0);
                // console.log("GOT BRAND PROP " + (<Identifier>propertyNode.name).text)
                this.binder.fillProtoProp(propertyNode);
            }
            return this.binder.getProtoPropId(propAccess.name.text);
        }

        addAssignedValue(brandPropId: number, node:Expression) {
            var copy = new BrandPropertyTypes(this.binder);
            for (var i = 0; i < copy.assignmentSets.length; i++) {
                // If the previous value had any null types, we use our current assignment as a 'refinement'.
                // The logic is, all sequential writes need to be consistent.
                if (brandPropId === i) {
                    copy.assignmentSets[i] = (this.assignmentSets[i] || copy.assignmentSets[i]).scanAssignment(node);
                } else {
                    copy.assignmentSets[i] = this.assignmentSets[i] || copy.assignmentSets[i];
                }
            }
            return copy;
        }
        scanAssignment(node:BinaryExpression) {
            // /* TODO: Detect any sort of assignment operator applied to our brand variable */

            // Detect type-building assignment for brand-types. We are interested in the case when...
            // 1. The LHS is a PropertyAccessExpression with form "<identifier>.<identifier>".
            // 2. <variable> has an associated VariableDeclaration with form "var <identifier> : brand <identifier".
            // No restrictions on RHS, but we are only interested in its statically known type.
            // Match for PropertyAccessExpression with "<identifier>.<identifier>".

            if (this.binder.getBrandPropertyId(node.left) !== null) {
                var brandPropId:number = this._scanPropertyAssignment(<PropertyAccessExpression>node.left);
            } else if (this.binder.getBrandProtoPropertyId(node.left) !== null) {
                var brandPropId:number = this._scanProtoPropertyAssignment(<PropertyAccessExpression>node.left);
            }
            return this.addAssignedValue(brandPropId, node.right);
        }
        // // Handle prototype initialization separately:
        // scanInitializers(initializer:Expression) {
        //     // /* TODO: Detect any sort of assignment operator applied to our brand variable */
        // 
        //     // Detect type-building assignment for brand-types. We are interested in the case when...
        //     // 1. The LHS is a PropertyAccessExpression with form "<identifier>.<identifier>".
        //     // 2. <variable> has an associated VariableDeclaration with form "var <identifier> : brand <identifier".
        //     // No restrictions on RHS, but we are only interested in its statically known type.
        //     // Match for PropertyAccessExpression with "<identifier>.<identifier>".
        // 
        //     if (binder.getBrandPropertyId(node.left) !== null) {
        //         var brandPropId:number = this._scanPropertyAssignment(<PropertyAccessExpression>node.left);
        //     } else if (binder.getBrandProtoPropertyId(node.left) !== null) {
        //         var brandPropId:number = this._scanProtoPropertyAssignment(<PropertyAccessExpression>node.left);
        //     }
        //     return this.addAssignedValue(brandPropId, node.right);
        // }
        
        // Store relevant assignments for type calculation:
        mark(node:Node, binder:BrandTypeBinder) {
            var propId = binder.getBrandPropertyId(node);
            if (propId !== null) {
                (<PropertyAccessExpression>node).brandAnalysis = this.get(binder.getPropId((<PropertyAccessExpression>node).name.text));
            }
            propId = binder.getBrandProtoPropertyId(node);
            if (propId !== null) {
                (<PropertyAccessExpression>node).brandAnalysis = this.get(binder.getProtoPropId((<PropertyAccessExpression>node).name.text));
                (<PropertyAccessExpression>node).useProtoBrand = true;
            }
        }
    }

    export class BrandTypeBinder {
        brandTypeDecl:BrandTypeDeclaration;
        nodePostLinks:Map<BrandPropertyTypes[]> = {};
        declareSymbol:_declareSymbol;
        // Tie properties to an ID assigned sequentially upon first visit
        propNameToId = {};
        // For function declarations with brands placed on 'this', collect prototype
        // information
        prototypePropNameToId = {};
        propIdIsPrototype = {};
        props = [];
        protoProps = [];
        allProps = [];
        nextPropNameId = 0;
        // Scope over which analysis is being done:
        containerScope:Node;
        // Scope where brand type is declared
        declarationScope:Node;

        fillProp(prop:BrandPropertyDeclaration) {
            if (this.propNameToId[(<Identifier>prop.name).text] === undefined) this.getPropId((<Identifier>prop.name).text);
            var id = this.propNameToId[(<Identifier>prop.name).text];
            this.allProps[id] = prop;
            this.props.push(prop);
        }
        
        fillProtoProp(prop:BrandPropertyDeclaration) {
            if (this.prototypePropNameToId[(<Identifier>prop.name).text] === undefined) this.getProtoPropId((<Identifier>prop.name).text);
            var id = this.prototypePropNameToId[(<Identifier>prop.name).text];
            this.allProps[id] = prop;
            this.protoProps.push(prop);
        }
    
        getPropId(str:string, dontCreate?:boolean):number {
            if (this.propNameToId[str] != null) return this.propNameToId[str];
            if (dontCreate) {console.log("NAME", str); console.log(this.propNameToId); throw new Error("DontCreate");}
            var id = this.nextPropNameId++;
            this.propNameToId[str] = id;
            this.allProps.push(null);
            this.propIdIsPrototype[id] = false;
            return id;
        }
        getProtoPropId(str:string, dontCreate?:boolean):number {
            if (this.prototypePropNameToId[str] != null) return this.prototypePropNameToId[str];
            if (dontCreate) {console.log("NAME", str); console.log(this.prototypePropNameToId); throw new Error("DontCreate");}
            var id = this.nextPropNameId++;
            this.prototypePropNameToId[str] = id;
            this.propIdIsPrototype[id] = true;
            this.allProps.push(null);
            return id;
        }

        getBrandPropertyId(node:Node):number {
            if (node.kind !== SyntaxKind.PropertyAccessExpression) {
                return null;
            }
            var propAccess = <PropertyAccessExpression>node;
            if (propAccess.expression.kind !== SyntaxKind.Identifier && propAccess.expression.kind !== SyntaxKind.ThisKeyword) {
                return null;
            }

            var name = (<Identifier> propAccess.expression).text || "this";

            // Search for an associated VariableDeclaration with "var <identifier> : brand <identifier".
            var varDecl = findVariableDeclarationForName(propAccess, name);
            if (!varDecl || !varDecl.type || varDecl.type.brandTypeDeclaration !== this.brandTypeDecl) {
                return null;
            }
            return this.getPropId(propAccess.name.text);
        }

        isBrandPrototypeAccess(node:Node) {
            if (!isPrototypeAccess(node)) {
                return false;
            }

            var propAccess = <PropertyAccessExpression> node;
            if (propAccess.expression.kind !== SyntaxKind.Identifier) {
                return false;
            }

            // Unlike in castBrandPropertyAccess, this name should never be 'this'
            // since it stems from a FunctionDeclaration.
            var name = (<Identifier> propAccess.expression).text;

            // Search for an associated VariableDeclaration with "var <identifier> : brand <identifier".
            var funcDecl = findFunctionDeclarationForName(propAccess, name);
            if (!funcDecl || !funcDecl.declaredTypeOfThis || funcDecl.declaredTypeOfThis.brandTypeDeclaration !== this.brandTypeDecl) {
                return false;
            }
            return true;
        }

        getBrandProtoPropertyId(node:Node):number {
            if (node.kind !== SyntaxKind.PropertyAccessExpression) return null;
            var propAccess = <PropertyAccessExpression>node;
            if (!this.isBrandPrototypeAccess(propAccess.expression)) {
                return null;
            }
            return this.getProtoPropId(propAccess.name.text);
        }
        scanInitializer(initializer:Expression, prev:BrandPropertyTypes):BrandPropertyTypes {
            if (initializer.kind === SyntaxKind.ObjectLiteralExpression) {
                forEach((<ObjectLiteralExpression>initializer).properties, (propAccess:ObjectLiteralElement) => {
                    if (propAccess.kind === SyntaxKind.PropertyAssignment && propAccess.name.kind === SyntaxKind.Identifier){
                        var propName:Identifier = <Identifier>propAccess.name;
                        // Create a property declaration for the brand-type symbol list:
                        var propertyNode = <BrandPropertyDeclaration> new (objectAllocator.getNodeConstructor(SyntaxKind.BrandProperty))();
                        propertyNode.name = propAccess.name; // Right-hand <identifier>
                        propertyNode.pos = propAccess.pos;
                        propertyNode.end = propAccess.end;
                        propertyNode.parent = this.declarationScope;
                        propertyNode.brandTypeDeclaration = this.brandTypeDecl;
                        this.declareSymbol(this.brandTypeDecl.symbol.members, this.brandTypeDecl.symbol, propertyNode, SymbolFlags.Property, 0);
                        var propId = this.getPropId(propName.text);
                        prev = prev.addAssignedValue(propId, (<PropertyAssignment> propAccess).initializer);
                        this.fillProp(propertyNode);
                        propAccess.brandPropertyDeclaration = propertyNode;
                    }
                });
            }
            return prev;
        }
        scan(node:Node, prev:BrandPropertyTypes):BrandPropertyTypes {
            if (typeof node === "undefined") {
                return prev;
            }

            prev.mark(node, this);

            /* Otherwise, continue recursive iteration: */
            forEachChild(node, (child) => {
                switch (child.kind) {
                    case SyntaxKind.PropertyAccessExpression:
                        // Classify prototype accesses that resolve as the brand type, 
                        // or ones that can potentially leak before branding,
                        // and should be treated as the subtype.
                        if (!this.isBrandPrototypeAccess(child)) {
                            prev = this.scan(child, prev);
                            break;
                        }
                        var downgrade = true;
                        if (child.parent.kind === SyntaxKind.PropertyAccessExpression ) {
                            downgrade = false;
                        } else {
                            // Navigate parents:
                            var parentScan = child;
                            while ((parentScan = parentScan.parent)) {
                                if (parentScan.kind === SyntaxKind.ReturnStatement) {
                                    downgrade = false;
                                    break;
                                } else if (isStatement(parentScan)) {
                                    break;
                                }
                            }
                        }
                        if (downgrade) {
                            child.downgradeToBaseClass = true;
                        }
                        (<PropertyAccessExpression>child).brandTypeDeclForPrototypeProperty = this.brandTypeDecl;
                        break;
                    case SyntaxKind.ThisKeyword:
                    case SyntaxKind.Identifier:
                        // Classify identifiers that resolve as the brand type, 
                        // or ones that can potentially leak before branding,
                        // and should be treated as the subtype.
                        var name:string = (<Identifier>child).text || "this";
                        var varDecl = findVariableDeclarationForName(child.parent, name);
                        if (varDecl && varDecl.type && varDecl.type.brandTypeDeclaration === this.brandTypeDecl) {
                            var downgrade = true;
                            if (child.parent.kind === SyntaxKind.PropertyAccessExpression ) {
                                // || child.parent.kind === SyntaxKind.VariableDeclaration) {
                                downgrade = false;
                            } else {
                                // Navigate parents:
                                var parentScan = child;
                                while ((parentScan = parentScan.parent)) {
                                    if (parentScan.kind === SyntaxKind.ReturnStatement) {
                                        downgrade = false;
                                        break;
                                    } else if (isStatement(parentScan)) {
                                        break;
                                    }
                                }
                            }
                            if (downgrade) {
                                child.downgradeToBaseClass = true;
                            }
                        }
                        break;
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
                        // TODO: Issue #1: Disable property binding inside this scan:
                        prev = this.scan(child, prev);
                        // This would allow for assignments in the return statement.
                        // However, branding occurs _before_ the return statement has a chance to execute.
                        this.nodePostLinks[id].push(prev);
                        break;
                    case SyntaxKind.SwitchStatement:
                        prev = this.scan((<SwitchStatement>child).expression, prev);
                        var beforeCases = prev;
                        // Flow analysis: Merge the result of every case
                        forEach((<SwitchStatement>child).clauses, (clause) => {
                            prev = prev.merge(this.scan(clause, beforeCases.passConditionalBarrier()));
                        });
                        break;
                        
                    case SyntaxKind.ConditionalExpression:
                        prev = this.scan((<ConditionalExpression>child).condition, prev);
                        var whenTrue = this.scan((<ConditionalExpression>child).whenTrue, prev.passConditionalBarrier());
                        var whenFalse = this.scan((<ConditionalExpression>child).whenFalse, prev.passConditionalBarrier());
                        // Flow analysis: Merge the result of the left and the right
                        prev = whenTrue.merge(whenFalse);
                        break;
                    case SyntaxKind.BinaryExpression:
                        /* Check if we have a relevant binding assignment: */
                        if ((<BinaryExpression>child).operator === SyntaxKind.EqualsToken) {
                            prev = prev.scanAssignment(<BinaryExpression>child);
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
                        // Special case so we don't consider our declaration scope as conditionally occuring:
                        var bodyScan = this.scan((<FunctionDeclaration>child).body, prev);
                            // prev = bodyScan;
                        if (this.declarationScope === child) {
                            prev = bodyScan.merge(prev, MergeKind.PROTO_PROPS);
                        } else {
                            prev = bodyScan.merge(prev);
                        }
                        break;
                    case SyntaxKind.TryStatement:
                        // Scan the try block:
                        var ifTry = this.scan((<TryStatement>child).tryBlock, prev);
                        // Treat it as conditional, pass to 'catch' block:
                        var ifCatch = this.scan((<TryStatement>child).catchClause, ifTry.merge(prev).passConditionalBarrier());
                        // Scan the finally block (possibly 'undefined'):
                        prev = this.scan((<TryStatement>child).finallyBlock, ifCatch.merge(prev));
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
                    if (!member.declarations || !getSymbolDecl(member, SyntaxKind.BrandProperty)) {
                        continue;
                    }
                    properties.push(<BrandPropertyDeclaration> getSymbolDecl(member, SyntaxKind.BrandProperty));
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
    function bindBrandTypeBasedOnVarScope(scope:Node, brandTypeDecl:BrandTypeDeclaration, declareSymbol:_declareSymbol, initializer: Expression) {
        var brandTypeBinder = new BrandTypeBinder();
        brandTypeBinder.brandTypeDecl = brandTypeDecl;
        brandTypeBinder.declarationScope = scope;
        // Search starting from the parent scope if we are a FunctionDeclaration with a 'var this : declare T' declaration.
        brandTypeBinder.containerScope = isFunctionDeclarationWithThisBrand(scope) ? getThisContainer(scope, true) : scope;
        brandTypeBinder.declareSymbol = declareSymbol;

        if (!initializer) throw new Error("Need initializer");
        var initial = brandTypeBinder.scanInitializer(initializer, new BrandPropertyTypes(brandTypeBinder));
        var assignmentResults = brandTypeBinder.scan(brandTypeBinder.containerScope, initial);
        
        // Set the binding assignments for each property:
        forEach(brandTypeBinder.props, (brandPropDecl:BrandPropertyDeclaration) => {
            var name = (<Identifier>brandPropDecl.name).text;
            var assignments = assignmentResults.get(brandTypeBinder.getPropId(name));
            if (assignments == null) {console.log((<any>assignmentResults).assignmentSets); throw new Error("WWWEEERE");}
            brandPropDecl.bindingAssignments = assignments;
        });
        
        // Set the binding assignments for each prototype property:
        if (brandTypeDecl.prototypeBrandDeclaration) {
            forEach(brandTypeBinder.protoProps, (brandPropDecl:BrandPropertyDeclaration) => {
                var name = (<Identifier>brandPropDecl.name).text;
                var assignments = assignmentResults.get(brandTypeBinder.getProtoPropId(name));
                if (assignments == null) {console.log((<any>assignmentResults).assignmentSets); throw new Error("WWWEEERE");}
                brandPropDecl.bindingAssignments = assignments;
            });
        }
    }

    export function bindBrandPropertiesInScopeAfterInitialBinding(scope:Node, declareSymbol:_declareSymbol) {
        // Find all relevant brand type declarations bound to the current scope.
        forEach(getBrandTypeVarDeclarations(scope), (declaration:VariableDeclaration) => {
            declaration.type.brandTypeDeclaration.variableDeclaration = declaration;
            bindBrandTypeBasedOnVarScope(scope, declaration.type.brandTypeDeclaration, declareSymbol, declaration.initializer);
        });
    }
}
