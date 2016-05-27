// This file is part of ConcreteTypeScript.

/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="utilities.ts"/>

namespace ts {
    declare var process;

    export var ENABLE_DEBUG_ANNOTATIONS:boolean = !!process.env.CTS_TEST;
    export var DISABLE_PROTECTED_MEMBERS:boolean = !!process.env.CTS_DISABLE_TYPE_PROTECTION;

    export function forEachChildRecursive(node:Node, callback: (Node)=>void) {
        function callbackPrime(node:Node) {
            callback(node);
            forEachChild(node, callbackPrime);
        }
        callbackPrime(node);
    }
/*
    export function addPreEmit(node: Node, emitCallback:EmitCallback) {

        if (!node.preEmitCallbacks) {
            node.preEmitCallbacks = [];
        }
        node.preEmitCallbacks.push(emitCallback);
    }
    
    export function addPostEmit(node: Node, emitCallback:EmitCallback) {
        if (!node.postEmitCallbacks) {
            node.postEmitCallbacks = [];
        }
        node.postEmitCallbacks.push(emitCallback);
    }
  */  
    // Is this an expression of type <identifier>.<identifier> = <expression>?
    export function isPropertyAssignment(node:Node) {
        if (node.kind === SyntaxKind.BinaryExpression && (<BinaryExpression>node).operatorToken.kind === SyntaxKind.EqualsToken) {
            var binNode = <BinaryExpression> node;
            if (binNode.left.kind === SyntaxKind.PropertyAccessExpression) {
                return true;
            }
        }
        return false;
    }

    // Used when determinining if a Foo.prototype expression represents a protected declare-type prototype
    export function getLocusTypeFromThisParam(param: ThisParameterDeclaration): LocusTypeNode {
        let typeNode = param.type;
        if (typeNode.kind === SyntaxKind.LocusType) {
            return <LocusTypeNode> typeNode;
        }
        return null;
    }

    export function getThisParamFromFunction(node:Node): ThisParameterDeclaration {
        let decl = getFunctionDeclaration(node.symbol);
        if (decl) {
            return decl.parameters.thisParam;
        }
        return null;
    }
    
    export function getLocusTypeFromFunction(node:Node): LocusTypeNode {
        let thisParam = getThisParamFromFunction(node);
        if (!thisParam) {
            return null;
        }
        return getLocusTypeFromThisParam(thisParam);
    }

    export function getFunctionDeclaration(symbol: Symbol): FunctionLikeDeclaration {
        for (var i = 0; i < symbol.declarations.length; i++) {
            if (isFunctionLike(symbol.declarations[i])) {
                return <FunctionLikeDeclaration> symbol.declarations[i];
            }
        }
        return null;
   }

    export function getLocusTypesInScope(scope:Node):LocusTypeDeclaration[] {
        var useExports = (scope.symbol && scope.symbol.flags & SymbolFlags.HasExports);
        var symbols:SymbolTable =  (useExports? scope.symbol.exports : scope.locals) || {};
        var declarations:LocusTypeDeclaration[] = [];
        for (var symbolName of Object.keys(symbols)) {
            var locusType = <LocusTypeDeclaration> getSymbolDecl(symbols[symbolName], SyntaxKind.LocusType);
            locusType = locusType || <LocusTypeDeclaration> getSymbolDecl(symbols[symbolName], SyntaxKind.LocusTypeDeclaration);
            if (locusType) {
                declarations.push(locusType);
            }
        }
        return declarations;
    }

    export function getDeclarations(block:Node, filter: (node:Declaration)=>boolean):Declaration[] {
        if (!block.locals) return [];
        var declarations:Declaration[] = [];
        for (var symbolName in block.locals) {
            if (hasProperty(block.locals, symbolName)) {
                var symbol = block.locals[symbolName];
                declarations = declarations.concat(symbol.declarations.filter(filter));
            }
        }
        return declarations;
    }

    export function getSymbolLocusTypeDecl(symbol:Symbol): LocusTypeDeclaration {
        return <LocusTypeDeclaration > (getSymbolDecl(symbol, SyntaxKind.LocusType) || getSymbolDecl(symbol, SyntaxKind.LocusTypeDeclaration));
    }
    export function getClassOrLocusBaseType(checker: TypeChecker, type: InterfaceType): Type {
        for (let baseType of checker.getBaseTypes(type)) {
            if (baseType.flags & (TypeFlags.Locus | TypeFlags.Class)) {
                return baseType;
            }
        }
        return null;
    }
    export function getSymbolDecl(symbol:Symbol, kind:SyntaxKind): Declaration {
        if (symbol.declarations) {
            for (var i = 0; i < symbol.declarations.length; i++) {
                if (symbol.declarations[i].kind === kind) {
                    return symbol.declarations[i];
                }
            }
        }
        return null
    }

    export function getFunctionDeclarationsWithThisBrand(block:Node):FunctionDeclaration[] {
        return <FunctionDeclaration[]> getDeclarations(block, isFunctionLikeDeclarationWithThisBrand);
    }

    export function getLocusTypeDeclarations(block:Node):(VariableDeclaration|ThisParameterDeclaration|ParameterDeclaration)[] {
        let declarations = <(VariableDeclaration|ThisParameterDeclaration|ParameterDeclaration)[]> getDeclarations(block, isBrandDecl);
        if (isFunctionLike(block)) {
            if (block.parameters.thisParam && block.parameters.thisParam.type && block.parameters.thisParam.type.kind === SyntaxKind.LocusType) {
                declarations = declarations.concat([block.parameters.thisParam]);
            }
        }
        return declarations;
        function isBrandDecl(node:Declaration) {
            if (node.kind === SyntaxKind.VariableDeclaration || node.kind == SyntaxKind.Parameter) {
                var typeNode = (<VariableDeclaration|ParameterDeclaration>node).type;
                return typeNode && typeNode.kind === SyntaxKind.LocusType;
            }
            return false;
        };
    }

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
                if (isFunctionLike(node)) {
                    return node;
                }
            }
        }
    }

      export function getSymbolScope(location: Node, text: string, flags: SymbolFlags): Node{
          let i =0;
          while (true) {
              // If not a 'locals'-having context
              if ((!location.locals || !hasProperty(location.locals, text) || !(location.locals[text].flags & flags))
                  && (!location.symbol || !location.symbol.exports || !hasProperty(location.symbol.exports, text) || !(location.symbol.exports[text].flags & flags))) {
                  location = location.parent;
                  continue;
              }
              return location;
          }
          // Reference error. Let checker error out.
          return null;
      }


      export function getSymbol(location: Node, text: string, flags: SymbolFlags): Symbol {
          while (location) {
              // If not a 'locals'-having context
              if (!location.locals || !hasProperty(location.locals, text) || !(location.locals[text].flags & flags)) {
                  location = location.parent;
                  continue;
              }
              return location.locals[text];
          }
          // Not found, let checker handle error reporting:
          return null;
      }

      export function isPrototypeAccess(node: Node) : node is PropertyAccessExpression {
          if (node.kind !== SyntaxKind.PropertyAccessExpression) return false;
          var propAccess = <PropertyAccessExpression> node;
          return (propAccess.name.text === "prototype");
      }

    // [ConcreteTypeScript] Find variable declaration associated with identifier, or 'null' if not a VariableDeclaration
    export function findDeclarationForName(location: Node, text: string): VariableDeclaration|ThisParameterDeclaration|ParameterDeclaration {
        if (text === "this") {
            let funcScope = getThisContainer(location, false);
            if (isFunctionLike(funcScope)) {
                if (funcScope.parameters.thisParam) {
                    return funcScope.parameters.thisParam;
                }
            }
        }
        var symbol = getSymbol(location, text, SymbolFlags.Variable);
        if (!symbol || symbol.declarations.length < 1) {
            return null;
        }
        // Matched, return declaration (if exists):
        return <VariableDeclaration|ParameterDeclaration> (getSymbolDecl(symbol, SyntaxKind.VariableDeclaration) || getSymbolDecl(symbol, SyntaxKind.Parameter));
    }

      export function getExportedSymbol(location: Node, text: string, symbolFlag:SymbolFlags) {
          while (location) {
              let exports = (location.symbol && location.symbol.exports);
              if (!exports || !hasProperty(exports, text) || !(exports[text].flags & symbolFlag)) {
                  location = location.parent;
                  continue;
              }
              return location.locals[text];
          }
          return null;
      }

      // Find function declaration associated with identifier, or 'null' if not a FunctionDeclaration
      export function findFunctionDeclarationSymbolForName(location: Node, text: string): Symbol {
          return getSymbol(location, text, SymbolFlags.Function) || getExportedSymbol(location, text, SymbolFlags.Function);
      }

      export function findFunctionDeclarationForName(location: Node, text: string): FunctionDeclaration {
          var symbol = findFunctionDeclarationSymbolForName(location, text);
          if (!symbol || symbol.declarations.length < 1) {
              return null;
          }
          // Matched, return function declaration (if exists):
          return <FunctionDeclaration> getSymbolDecl(symbol, SyntaxKind.FunctionDeclaration);
      }

      export function findParent(node:Node, symbolFlag:SymbolFlags) {
          while (node.parent) {
              node = node.parent;
              if (node.symbol && node.symbol.flags & symbolFlag) {
                  return node;
              }
          }
      }
      export function isFunctionLikeDeclarationWithThisBrand(scope:Node): scope is FunctionLikeDeclaration {
          if (isFunctionLike(scope)) {
              let {thisParam} = scope.parameters;
              return !!(thisParam && thisParam.type.locusTypeDeclaration);
          }
          return false;
      }

      export function isFunctionLikeDeclarationCheckThisBrand(scope:Node, locusTypeDecl: LocusTypeNode):scope is FunctionLikeDeclaration {
          if (isFunctionLikeDeclarationWithThisBrand(scope)) {
              return (<FunctionDeclaration>scope).parameters.thisParam.type.locusTypeDeclaration === locusTypeDecl;
          }
          return false;
      }

      export function getOuterStatement(scope:Node): Statement {
          while (scope && !isStatement(scope)) {
              scope = scope.parent;
          }
          return <Statement> scope;
      }

      export function getModuleOrSourceFileOrFunction(scope:Node) {
          while (scope.kind !== SyntaxKind.ModuleDeclaration && scope.kind !== SyntaxKind.SourceFile && !isFunctionLike(scope)) {
              // Should always terminate; all incoming nodes should be children of the SourceFile:
              scope = scope.parent;
          }
          return scope;
      }

      export function getModuleOrSourceFile(scope:Node) {
          while (scope.kind !== SyntaxKind.ModuleDeclaration && scope.kind !== SyntaxKind.SourceFile) {
              // Should always terminate; all incoming nodes should be children of the SourceFile:
              scope = scope.parent;
          }
          return scope;
      }
}
