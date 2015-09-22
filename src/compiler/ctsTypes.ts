/// <reference path="types.ts"/>

namespace ts {

    export interface BrandTypeDeclaration extends Declaration, Statement {
        name: Identifier;
        scope: Node;
        // Set in checkerHelper.ts, null if a prototype-inferred brand
        variableDeclaration?: VariableDeclaration;
        // Defaults to the 'any' type.
        // TODO should parallel extension relationship for brand types.
        extendedType?: TypeNode;
        extendedTypeResolved?: Type;
        prototypeBrandDeclaration?: BrandTypeDeclaration;
        // The BrandTypeDeclaration that has us as a prototypeBrandDeclaration
        ownerBrandDeclaration?: BrandTypeDeclaration;
        // If the 'this' type of a function
        functionDeclaration?: FunctionLikeDeclaration;
    }

    // [ConcreteTypeScript] We resolve the type of a brand property based on
    // the assignments in its declaration site.
    export interface BrandPropertyDeclaration extends PropertyDeclaration {
        brandTypeDeclaration: BrandTypeDeclaration;
        // Set in checkerHelper.ts during binder.ts
        // bindingAssignments?: FlowTypeAnalysis;
        // Set in checker.ts
        resolvedType?:Type;
    }

    export class NodeMap<N extends Node, T> {
        private values:any = {};
        set(node:N, val:T) {
            this.values[getNodeId(node)] = val;
        }
        get(node:N):T {
            return this.values[getNodeId(node)];
        }
    }

//TODO use this
    export var typeNodeToType = new NodeMap<TypeNode, Type>();
    export var nodeToFlowTypeAnalysis = new NodeMap<Node, FlowTypeAnalysis>();
    export var propAccessUsesProtoBrand = new NodeMap<PropertyAccessExpression, boolean>();
    export var objLiteralToBrandPropertyDeclaration = new NodeMap<ObjectLiteralElement, BrandPropertyDeclaration>();
    export var nodeDowngradeToBaseClass = new NodeMap<Node, boolean>();
    export var prototypePropToBrandTypeDecl = new NodeMap<PropertyAccessExpression, BrandTypeDeclaration>();

    // Null if this TypeNode does not declare a brand type
    export function getDeclaredBrandTypeDeclarationFromTypeNode(typeNode:TypeNode):BrandTypeDeclaration {
        return typeNode.brandTypeDeclaration;
    }

    // Null if this TypeNode does not declare a brand type
    export function getDeclaredBrandTypeDeclarationFromVariableDeclaration(varDecl:VariableDeclaration):BrandTypeDeclaration {
        return varDecl.type && getDeclaredBrandTypeDeclarationFromTypeNode(varDecl.type);
    }
}
