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
    export function getBrandTypesInScope(scope:Node):BrandTypeDeclaration[] {
        var useExports = (scope.symbol && scope.symbol.flags & SymbolFlags.HasExports);
        var symbols:SymbolTable =  (useExports? scope.symbol.exports : scope.locals) || {};
        var declarations:BrandTypeDeclaration[] = [];
        for (var symbolName of Object.keys(symbols)) {
            var brandType = <BrandTypeDeclaration> getSymbolDecl(symbols[symbolName], SyntaxKind.BrandTypeDeclaration);
            if (brandType) {
                declarations.push(brandType);
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

    export function getSymbolDecl(symbol:Symbol, kind:SyntaxKind): Declaration {
        for (var i = 0; i < symbol.declarations.length; i++) {
            if (symbol.declarations[i].kind === kind) {
                return symbol.declarations[i];
            }
        }
        return null
    }
    
    export function getFunctionDeclarationsWithThisBrand(block:Node):FunctionDeclaration[] {
        return <FunctionDeclaration[]> getDeclarations(block, isFunctionLikeDeclarationWithThisBrand);
    }

    export function getBrandTypeDeclarations(block:Node):(VariableDeclaration|ThisParameterDeclaration|ParameterDeclaration)[] {
        let declarations = <(VariableDeclaration|ThisParameterDeclaration|ParameterDeclaration)[]> getDeclarations(block, isBrandDecl);
        if (isFunctionLike(block)) {
            let hadThis = false;
            // Stopgap code while both 'var this' and 'this: declare X' are possible.
            for (let decl of declarations) {
                if ((<Identifier>decl.name).text === "this") {
                    hadThis = true;
                }
            }
            if (!hadThis && block.parameters.thisParam && block.parameters.thisParam.type.brandTypeDeclaration) {
                declarations = declarations.concat([block.parameters.thisParam]);
            }
        }
        return declarations;
        function isBrandDecl(node:Declaration) {
            if (node.kind === SyntaxKind.VariableDeclaration || node.kind == SyntaxKind.Parameter) {
                var typeNode = (<VariableDeclaration|ParameterDeclaration>node).type;
                return !!(typeNode && typeNode.brandTypeDeclaration);
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
                switch (node.kind) {
                case SyntaxKind.ArrowFunction:
                case SyntaxKind.FunctionExpression:
                case SyntaxKind.FunctionDeclaration:
                    return node;
                }
            }
        }
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

      export function isPrototypeAccess(node: Node) : boolean {
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
              return !!(thisParam && thisParam.type.brandTypeDeclaration);
          }
          return false;
      }
    
      export function isFunctionLikeDeclarationCheckThisBrand(scope:Node, brandTypeDecl: BrandTypeDeclaration):scope is FunctionLikeDeclaration {
          if (isFunctionLikeDeclarationWithThisBrand(scope)) {
              return (<FunctionDeclaration>scope).parameters.thisParam.type.brandTypeDeclaration === brandTypeDecl;
          }
          return false;
      }
      
      export function getModuleOrSourceFile(scope:Node) {
          while (scope.kind !== SyntaxKind.ModuleDeclaration && scope.kind !== SyntaxKind.SourceFile) {
              // Should always terminate; all incoming nodes should be children of the SourceFile:
              scope = scope.parent;
          }
          return scope;
      }
}
