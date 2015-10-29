// This file is part of ConcreteTypeScript.

/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="utilities.ts"/>
/// <reference path="printNode.ts"/>
/// <reference path="ctsUtilities.ts"/>

module ts {
    
    function flowLog(arg, ...args) {
        console.log(arg, ...args);
    }

    // As our binder passes through the function
    // we collect the relevant assignments of the brand property 
    // for once it leaves the block, and for when it 
    export class FlowTypeAnalysis {
        // Given a series of sequential assignments, we take the type
        // of the first assignment, and the proceding assignments
        // must be subtypes. 
        // 
        // However, we special case assignments such as:
        // let a = 1;
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
        getBrandType() {
            return this.binder.brandTypeDecl;
        }
        getDeclaration() {
            Debug.assert(this.binder.allProps[this.index] != null);
            return this.binder.allProps[this.index];
        }
        isPrototypeProperty() {
            return this.binder.propIdIsPrototype[this.index];
        }
        merge(other:FlowTypeAnalysis):FlowTypeAnalysis {
            Debug.assert(other.index === this.index);
            let expressions:Expression[] = [].concat(this.assignments);
            for (let expr of other.assignments) {
                if (expressions.indexOf(expr) === -1) expressions.push(expr);
            }
            let definitelyAssigned:boolean = (other.definitelyAssigned && this.definitelyAssigned);
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
            for (let i = 0; i < this.assignmentSets.length; i++) {
                this.assignmentSets[i] = new FlowTypeAnalysis(binder, i, [], false);
            }
        }
        merge(other:BrandPropertyTypes, kind:MergeKind = MergeKind.ALL):BrandPropertyTypes {
            let merged = new BrandPropertyTypes(this.binder);
            let criteria = (i:number) => true;
            if (kind === MergeKind.NORMAL_PROPS) {
                criteria = (i:number) => !this.binder.propIdIsPrototype[i];
            } else if (kind === MergeKind.PROTO_PROPS) {
                criteria = (i:number) => this.binder.propIdIsPrototype[i];;
            }
            for (let i = 0; i < merged.assignmentSets.length; i++) {
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
            let passed = new BrandPropertyTypes(this.binder);
            for (let i = 0; i < passed.assignmentSets.length; i++) {
                // TODO think about corner cases here
                passed.assignmentSets[i] = (this.assignmentSets[i] || passed.assignmentSets[i]).passConditionalBarrier();
            }
            return passed;
        }
        
        _scanPropertyAssignment(propAccess:PropertyAccessExpression) {
            if (!hasProperty(this.binder.brandTypeDecl.symbol.members, propAccess.name.text)) { 
                // Create a property declaration for the brand-type symbol list:
                let propertyNode = <BrandPropertyDeclaration> new (objectAllocator.getNodeConstructor(SyntaxKind.BrandProperty))();
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
            let protoBrandType = this.binder.brandTypeDecl.prototypeBrandDeclaration;
            Debug.assert(!!protoBrandType)
            if (!hasProperty(protoBrandType.symbol.members, propAccess.name.text)) { 
                // Create a property declaration for the brand-type symbol list:
                let propertyNode = <BrandPropertyDeclaration> new (objectAllocator.getNodeConstructor(SyntaxKind.BrandProperty))();
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
            let copy = new BrandPropertyTypes(this.binder);
            for (let i = 0; i < copy.assignmentSets.length; i++) {
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
            let propId = binder.getBrandPropertyId(node);
            if (propId !== null) {
                nodeToFlowTypeAnalysis.set(node, this.get(binder.getPropId((<PropertyAccessExpression>node).name.text)));
            }
            propId = binder.getBrandProtoPropertyId(node);
            if (propId !== null) {
                nodeToFlowTypeAnalysis.set(node, this.get(binder.getProtoPropId((<PropertyAccessExpression>node).name.text)));
                propAccessUsesProtoBrand.set((<PropertyAccessExpression>node), true);
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
        props: BrandPropertyDeclaration[]      = [] ;
        protoProps: BrandPropertyDeclaration[] = [];
        allProps: BrandPropertyDeclaration[]   = [];
        nextPropNameId = 0;
        // Scope over which analysis is being done:
        containerScope:Node;
        // Scope where brand type is declared
        declarationScope:Node;
        brandPoint:Node = null;
        protoBrandPoint:Node = null;
        _findBrandPoints():void {
            let lastNode:Node =  null;
            let lastProtoNode:Node =  null;
            let numbering = 0;
            let iter = (node:Node) => {
                if (!node) {
                    return;
                }
                
                if (isFunctionLikeDeclarationCheckThisBrand(node, this.brandTypeDecl)) {
                    lastProtoNode = node;
                }
                if (node.kind === SyntaxKind.BinaryExpression && (<BinaryExpression>node).operatorToken.kind === SyntaxKind.EqualsToken) {
                    if (this.getBrandProtoPropertyId((<BinaryExpression>node).left) !== null) 
                        lastProtoNode = node;
                    if (this.getBrandPropertyId((<BinaryExpression>node).left) !== null) {
                        lastNode = node;
                    }
                } else if (node.kind === SyntaxKind.VariableDeclaration && (<VariableDeclaration>node) === this.brandTypeDecl.varOrParamDeclaration) {
                    lastNode = node;
                }
                forEachChild(node, iter);
            }
            iter(this.containerScope);
            let pointScope = this.declarationScope, protoPointScope = this.containerScope;
            if (pointScope.kind === SyntaxKind.FunctionDeclaration || pointScope.kind === SyntaxKind.FunctionExpression || pointScope.kind === SyntaxKind.ArrowFunction) {
                pointScope = (<FunctionLikeDeclaration> pointScope).body;
            }
            if (this.brandPoint = lastNode) {
                while (this.brandPoint.parent !== pointScope) {
                    this.brandPoint = this.brandPoint.parent;
                }
            }
            if (this.protoBrandPoint = lastProtoNode) {
                if (protoPointScope.kind === SyntaxKind.FunctionDeclaration || protoPointScope.kind === SyntaxKind.FunctionExpression || protoPointScope.kind === SyntaxKind.ArrowFunction) {
                    protoPointScope = (<FunctionLikeDeclaration> protoPointScope).body;
                }
                while (this.protoBrandPoint.parent !== protoPointScope) {
                    this.protoBrandPoint = this.protoBrandPoint.parent;
                }
            }
        }

        fillProp(prop:BrandPropertyDeclaration) {
            if (this.propNameToId[(<Identifier>prop.name).text] === undefined) this.getPropId((<Identifier>prop.name).text);
            let id = this.propNameToId[(<Identifier>prop.name).text];
            this.allProps[id] = prop;
            this.props.push(prop);
        }
        
        fillProtoProp(prop:BrandPropertyDeclaration) {
            if (this.prototypePropNameToId[(<Identifier>prop.name).text] === undefined) this.getProtoPropId((<Identifier>prop.name).text);
            let id = this.prototypePropNameToId[(<Identifier>prop.name).text];
            this.allProps[id] = prop;
            this.protoProps.push(prop);
        }
        getPropId(str:string, dontCreate?:boolean):number {
            if (this.propNameToId[str] != null) return this.propNameToId[str];
            if (dontCreate) {console.log("NAME", str); console.log(this.propNameToId); throw new Error("DontCreate");}
            let id = this.nextPropNameId++;
            this.propNameToId[str] = id;
            this.allProps.push(null);
            this.propIdIsPrototype[id] = false;
            return id;
        }
        
        getProtoPropId(str:string, dontCreate?:boolean):number {
            if (this.prototypePropNameToId[str] != null) return this.prototypePropNameToId[str];
            if (dontCreate) {console.log("NAME", str); console.log(this.prototypePropNameToId); throw new Error("DontCreate");}
            let id = this.nextPropNameId++;
            this.prototypePropNameToId[str] = id;
            this.propIdIsPrototype[id] = true;
            this.allProps.push(null);
            return id;
        }

        getBrandPropertyId(node:Node):number {
            if (node.kind !== SyntaxKind.PropertyAccessExpression) {
                return null;
            }
            let propAccess = <PropertyAccessExpression>node;
            if (propAccess.expression.kind !== SyntaxKind.Identifier && propAccess.expression.kind !== SyntaxKind.ThisKeyword) {
                return null;
            }

            let name = (<Identifier> propAccess.expression).text || "this";

            // Search for an associated VariableDeclaration with "let <identifier> : brand <identifier".
            let decl = findDeclarationForName(propAccess, name);
            if (!decl || !decl.type || decl.type.brandTypeDeclaration !== this.brandTypeDecl) {
                return null;
            }
            return this.getPropId(propAccess.name.text);
        }

        isBrandPrototypeAccess(node:Node):boolean {
            if (!isPrototypeAccess(node)) {
                return false;
            }

            let propAccess = <PropertyAccessExpression> node;
            if (propAccess.expression.kind !== SyntaxKind.Identifier) {
                return false;
            }

            // Unlike in castBrandPropertyAccess, this name should never be 'this'
            // since it stems from a FunctionDeclaration.
            let name = (<Identifier> propAccess.expression).text;

            // Search for an associated VariableDeclaration with "let <identifier> : brand <identifier".
            let funcDecl = findFunctionDeclarationForName(propAccess, name);
            // console.log("FUNCDECL");
            // if (funcDecl) printNodeDeep(funcDecl);
            // console.log("/FUNCDECL");
            return isFunctionLikeDeclarationWithThisBrand(funcDecl);
        }

        getBrandProtoPropertyId(node:Node):number {
            if (node.kind !== SyntaxKind.PropertyAccessExpression) return null;
            let propAccess = <PropertyAccessExpression>node;
            if (!this.isBrandPrototypeAccess(propAccess.expression)) {
                return null;
            }
            return this.getProtoPropId(propAccess.name.text);
        }
        scanInitializer(initializer:Expression, prev:BrandPropertyTypes):BrandPropertyTypes {
            if (initializer.kind === SyntaxKind.ObjectLiteralExpression) {
                for (let objectLit of (<ObjectLiteralExpression>initializer).properties) {
                    if (objectLit.kind === SyntaxKind.PropertyAssignment && objectLit.name.kind === SyntaxKind.Identifier){
                        let propName:Identifier = <Identifier>objectLit.name;
                        // Create a property declaration for the brand-type symbol list:
                        let propertyNode = <BrandPropertyDeclaration> new (objectAllocator.getNodeConstructor(SyntaxKind.BrandProperty))();
                        propertyNode.name = objectLit.name; // Right-hand <identifier>
                        propertyNode.pos = objectLit.pos;
                        propertyNode.end = objectLit.end;
                        propertyNode.parent = this.declarationScope;
                        propertyNode.brandTypeDeclaration = this.brandTypeDecl;
                        this.declareSymbol(this.brandTypeDecl.symbol.members, this.brandTypeDecl.symbol, propertyNode, SymbolFlags.Property, 0);
                        let propId = this.getPropId(propName.text);
                        prev = prev.addAssignedValue(propId, (<PropertyAssignment> objectLit).initializer);
                        this.fillProp(propertyNode);
                        objLiteralToBrandPropertyDeclaration.set(objectLit, propertyNode);
                    }
                }
            }
            return prev;
        }
        scan(node:Node, prev:BrandPropertyTypes):BrandPropertyTypes {
            if (typeof node === "undefined") {
                return prev;
            }
            prev.mark(node, this);

            let descend = () => {
                forEachChild(node, (subchild) => {
                    prev = this.scan(subchild, prev);
                });
            };

            switch (node.kind) {
                case SyntaxKind.PropertyAccessExpression:
                    // Classify prototype accesses that resolve as the brand type, 
                    // or ones that can potentially leak before branding,
                    // and should be treated as the subtype.
                    if (!this.isBrandPrototypeAccess(node)) {
                        descend();
                        break;
                    }
                    let downgrade = true;
                    if (node.parent.kind === SyntaxKind.PropertyAccessExpression ) {
                        downgrade = false;
                    }
                    if (downgrade) {
                        // Don't downgrade if after last property assignment:
                        if (getNodeId(node) < getNodeId(this.protoBrandPoint) || isNodeDescendentOf(node, this.protoBrandPoint)) {
                            nodeDowngradeToBaseClass.set(node, true);
                        }
                    }
                    prototypePropToBrandTypeDecl.set(<PropertyAccessExpression>node, this.brandTypeDecl);
                    break;
                case SyntaxKind.ThisKeyword:
                case SyntaxKind.Identifier:
                    // Classify identifiers that resolve as the brand type, 
                    // or ones that can potentially leak before branding,
                    // and should be treated as the subtype.
                    let name:string = (<Identifier>node).text || "this";
                    let decl = findDeclarationForName(node.parent, name);
                    if (decl && decl.type && decl.type.brandTypeDeclaration === this.brandTypeDecl) {
                        let downgrade = true;
                        if (node.parent.kind === SyntaxKind.PropertyAccessExpression ) {
                            // || child.parent.kind === SyntaxKind.VariableDeclaration) {
                            downgrade = false;
                        } else {
                            // Navigate parents:
                            let parentScan = node;
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
                            // Don't downgrade if after last property assignment:
                            // this.brandPoint === null means no downgrading, for example if the only definition-affecting operation is eg in the function signature
                            if (this.brandPoint && (getNodeId(node) < getNodeId(this.brandPoint) || isNodeDescendentOf(node, this.brandPoint))) {
                                nodeDowngradeToBaseClass.set(node, true);
                            }
                        }
                    }
                    break;
                case SyntaxKind.BreakStatement:
                case SyntaxKind.ContinueStatement:
                case SyntaxKind.ReturnStatement:
                    // Truncate the scope to only the topmost block we care about
                    let breakingContainer = (<ReturnStatement>node).breakingContainer;
                    if (isNodeDescendentOf(this.containerScope, breakingContainer)) {
                        breakingContainer = this.containerScope;
                    }
                    let id = breakingContainer.id;
                    this.nodePostLinks[id] = (this.nodePostLinks[id] || []);
                    descend();
                    // This would allow for assignments in the return statement.
                    // However, branding occurs _before_ the return statement has a chance to execute.
                    this.nodePostLinks[id].push(prev);
                    break;
                case SyntaxKind.SwitchStatement:
                    prev = this.scan((<SwitchStatement>node).expression, prev);
                    let beforeCases = prev;
                    // Flow analysis: Merge the result of every case
                    for (let clause of (<SwitchStatement>node).caseBlock.clauses) {
                        prev = prev.merge(this.scan(clause, beforeCases.passConditionalBarrier()));
                    }
                    break;

                case SyntaxKind.ConditionalExpression:
                    prev = this.scan((<ConditionalExpression>node).condition, prev);
                    let whenTrue = this.scan((<ConditionalExpression>node).whenTrue, prev.passConditionalBarrier());
                    let whenFalse = this.scan((<ConditionalExpression>node).whenFalse, prev.passConditionalBarrier());
                    // Flow analysis: Merge the result of the left and the right
                    prev = whenTrue.merge(whenFalse);
                    break;
                case SyntaxKind.BinaryExpression:
                    /* Check if we have a relevant binding assignment: */
                    if ((<BinaryExpression>node).operatorToken.kind === SyntaxKind.EqualsToken) {
                        prev = prev.scanAssignment(<BinaryExpression>node);
                    }
                    // Consider the shortcircuting behaviour of && or ||
                    if ((<BinaryExpression>node).operatorToken.kind === SyntaxKind.AmpersandAmpersandToken ||
                        (<BinaryExpression>node).operatorToken.kind === SyntaxKind.BarBarToken) {
                        // Flow analysis: Merge the result of the left and of the left-then-right
                        let left = this.scan((<BinaryExpression>node).left, prev);
                        let right = this.scan((<BinaryExpression>node).right, left);
                        prev = left.merge(right);
                    } else {
                        prev = this.scan((<BinaryExpression>node).left, prev);
                        prev = this.scan((<BinaryExpression>node).right, prev);
                    }
                    break;
                case SyntaxKind.ForStatement:
                    // forEach((<ForStatement>node).declarations, (decl) => {
                    //     prev = this.scan(decl, prev);
                    // });
                    prev = this.scan((<ForStatement>node).initializer, prev);
                    prev = this.scan((<ForStatement>node).condition, prev);
                    // Flow analysis: Merge the result of entering the loop and of not
                    prev = this.scan((<ForStatement>node).statement, prev).merge(prev);
                    break;
                case SyntaxKind.VariableDeclarationList:
                    for (var decl of (<VariableDeclarationList>node).declarations) {
                        prev = this.scan(decl, prev);
                    }
                    break;
                case SyntaxKind.ForInStatement:
                    prev = this.scan((<ForInStatement>node).initializer, prev);
                    prev = this.scan((<ForInStatement>node).expression, prev);
                    // Flow analysis: Merge the result of entering the loop and of not
                    prev = this.scan((<ForInStatement>node).statement, prev).merge(prev);
                    break;
                case SyntaxKind.FunctionDeclaration:
                case SyntaxKind.FunctionExpression:
                case SyntaxKind.ArrowFunction:
                    // Special case so we don't consider our declaration scope as conditionally occuring:
                    let bodyScan = this.scan((<FunctionLikeDeclaration>node).body, prev);
                        // prev = bodyScan;
                    if (this.containerScope === node) {
                        prev = bodyScan;
                    } else if (this.declarationScope === node) {
                        prev = bodyScan.merge(prev, MergeKind.PROTO_PROPS);
                    } else {
                        prev = bodyScan.merge(prev);
                    }
                    break;
                case SyntaxKind.TryStatement:
                    // Scan the try block:
                    let ifTry = this.scan((<TryStatement>node).tryBlock, prev);
                    // Treat it as conditional, pass to 'catch' block:
                    let ifCatch = this.scan((<TryStatement>node).catchClause, ifTry.merge(prev).passConditionalBarrier());
                    // Scan the finally block (possibly 'undefined'):
                    prev = this.scan((<TryStatement>node).finallyBlock, ifCatch.merge(prev));
                    break;
                case SyntaxKind.IfStatement:
                    prev = this.scan((<IfStatement>node).expression, prev);
                    let ifTrue = this.scan((<IfStatement>node).thenStatement, prev.passConditionalBarrier());
                    let ifFalse = this.scan((<IfStatement>node).elseStatement, prev.passConditionalBarrier());
                    prev = ifTrue.merge(ifFalse);
                    break;
                case SyntaxKind.WhileStatement:
                    prev = this.scan((<WhileStatement>node).expression, prev);
                    // Flow analysis: Merge the result of entering the loop and of not
                    prev = this.scan((<WhileStatement>node).statement, prev).merge(prev);
                    break;
                default:
                    descend();
                }
                if (typeof this.nodePostLinks[node.id] !== "undefined") {
                    for (let links of this.nodePostLinks[node.id]) {
                        prev = prev.merge(links);
                    }
                }
            /* Otherwise, continue recursive iteration: */
            return prev;
        }
    }

    export function getBrandProperties(brandTypeDecl:Node):BrandPropertyDeclaration[] {
        let properties:BrandPropertyDeclaration[] = [];
        for (let key in brandTypeDecl.symbol.members) {
            if (hasProperty(brandTypeDecl.symbol.members, key)) {
                let member = brandTypeDecl.symbol.members[key];
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
        for (let key in scope.locals) {
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
        let brandTypeBinder = new BrandTypeBinder();
        brandTypeBinder.brandTypeDecl = brandTypeDecl;
        brandTypeBinder.declarationScope = scope;
        // Search starting from the parent scope if we are a FunctionDeclaration with a 'let this : declare T' declaration.
        let isFuncDeclWithThisBrand = isFunctionLikeDeclarationCheckThisBrand(scope, brandTypeDecl);
        brandTypeBinder.containerScope = isFuncDeclWithThisBrand ? getThisContainer(scope, true) : scope;
        brandTypeBinder.declareSymbol = declareSymbol;

        let initial:BrandPropertyTypes = new BrandPropertyTypes(brandTypeBinder);
        if (initializer) {
            initial = brandTypeBinder.scanInitializer(initializer, initial);
        }
        brandTypeBinder._findBrandPoints();
        let assignmentResults = brandTypeBinder.scan(brandTypeBinder.containerScope, initial);

        if (brandTypeBinder.brandPoint) {
            brandTypeBinder.brandPoint.brandsToEmitAfterwards = brandTypeBinder.brandPoint.brandsToEmitAfterwards || [];
            brandTypeBinder.brandPoint.brandsToEmitAfterwards.push(brandTypeDecl);    
        } else {
            scope.brandsToEmitAtBeginning = scope.brandsToEmitAtBeginning || [];
            scope.brandsToEmitAtBeginning.push(brandTypeDecl);    
        }

        if (brandTypeBinder.protoBrandPoint) {
            brandTypeBinder.protoBrandPoint.brandsToEmitAfterwards = brandTypeBinder.protoBrandPoint.brandsToEmitAfterwards || [];
            // Can possibly be undefined:
            brandTypeBinder.protoBrandPoint.brandsToEmitAfterwards.push(brandTypeDecl.prototypeBrandDeclaration);
        }
        // Set the binding assignments for each property:
        for (let brandPropDecl of brandTypeBinder.props) {
            let name = (<Identifier>brandPropDecl.name).text;
            let flowTypeAnalysis:FlowTypeAnalysis = assignmentResults.get(brandTypeBinder.getPropId(name));                
            Debug.assert(!!flowTypeAnalysis)
            nodeToFlowTypeAnalysis.set(brandPropDecl, flowTypeAnalysis);
        }

        // Set the binding assignments for each prototype property:
        if (brandTypeDecl.prototypeBrandDeclaration) {
            for (let brandPropDecl of brandTypeBinder.protoProps) {
                let name = (<Identifier>brandPropDecl.name).text;
                let flowTypeAnalysis:FlowTypeAnalysis = assignmentResults.get(brandTypeBinder.getProtoPropId(name));
                Debug.assert(!!flowTypeAnalysis)
                nodeToFlowTypeAnalysis.set(brandPropDecl, flowTypeAnalysis);
            }
        }
    }

    export function bindBrandPropertiesInScopeAfterInitialBinding(scope:Node, declareSymbol:_declareSymbol) {
        // Find all relevant brand type declarations bound to the current scope.
        for (let declaration of getBrandTypeDeclarations(scope)) {
            if (declaration.kind === SyntaxKind.VariableDeclaration) {
                bindBrandTypeBasedOnVarScope(scope, (<VariableDeclaration>declaration).type.brandTypeDeclaration, declareSymbol, (<VariableDeclaration>declaration).initializer);
            } else if (declaration.kind === SyntaxKind.ThisParameter) {
                bindBrandTypeBasedOnVarScope(scope, (<ThisParameterDeclaration>declaration).type.brandTypeDeclaration, declareSymbol, null);
            } else if (declaration.kind === SyntaxKind.Parameter) {
                bindBrandTypeBasedOnVarScope(scope, (<ParameterDeclaration>declaration).type.brandTypeDeclaration, declareSymbol, null);
            } else {
                Debug.assert(false);
            }
        }
    }
}
