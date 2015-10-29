/// <reference path="types.ts"/>
/// <reference path="checker.ts"/>

namespace ts {
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
}
