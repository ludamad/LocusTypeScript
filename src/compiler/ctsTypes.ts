/// <reference path="types.ts"/>
/// <reference path="checker.ts"/>

namespace ts {

    export const ENABLE_DEBUG_ANNOTATIONS = true;
    export class NodeMap<N extends Node, T> {
        private values:any = {};
        set(node:N, val:T) {
            this.values[getNodeId(node)] = val;
        }
        get(node:N):T {
            return this.values[getNodeId(node)];
        }
    }

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
