/// <reference path="types.ts"/>
/// <reference path="core.ts"/>
/// <reference path="scanner.ts"/>
/// <reference path="parser.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="emitter.ts"/>
/// <reference path="utilities.ts"/>

module ts {
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
          
      export function getSymbol(location: Node, text: string): Symbol {
          while (location) {
              // If not a 'locals'-having context
              if (!location.locals || !hasProperty(location.locals, text)) {
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
    export function findVariableDeclarationForName(location: Node, text: string): VariableDeclaration {
        var symbol = getSymbol(location, text);
        if (!symbol || symbol.declarations.length < 1 || symbol.declarations[0].kind !== SyntaxKind.VariableDeclaration) {
            return null;
        }
        // Matched, return variable declaration:
        return <VariableDeclaration>symbol.declarations[0];
    }
        
      // [ConcreteTypeScript] Find function declaration associated with identifier, or 'null' if not a FunctionDeclaration
      export function findFunctionDeclarationForName(location: Node, text: string): FunctionDeclaration {
          var symbol = getSymbol(location, text);
          if (!symbol || symbol.declarations.length < 1 || symbol.declarations[0].kind !== SyntaxKind.FunctionDeclaration) {
              return null;
          }
          // Matched, return variable declaration:
          return <FunctionDeclaration>symbol.declarations[0];
      }

      export function findParent(node:Node, symbolFlag:SymbolFlags) {
          while (node.parent) {
              node = node.parent;
              if (node.symbol && node.symbol.flags & symbolFlag) {
                  return node;
              }
          }
      }
      
      export function isFunctionDeclarationWithThisBrand(scope:Node):boolean {
          if (scope.kind === SyntaxKind.FunctionDeclaration) {
              return !!(<FunctionDeclaration>scope).declaredTypeOfThis;
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