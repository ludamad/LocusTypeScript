interface TypeWriterResult {
    line: number;
    syntaxKind: number;
    sourceText: string;
    type: string;
}

class TypeWriterWalker {
    results: TypeWriterResult[];
    currentSourceFile: ts.SourceFile;

    private checker: ts.TypeChecker;

    constructor(private program: ts.Program, fullTypeCheck: boolean) {
        // Consider getting both the diagnostics checker and the non-diagnostics checker to verify 
        // they are consistent.
        this.checker = fullTypeCheck
            ? program.getDiagnosticsProducingTypeChecker()
            : program.getTypeChecker();
    }

    public getTypes(fileName: string): TypeWriterResult[] {
        var sourceFile = this.program.getSourceFile(fileName);
        this.currentSourceFile = sourceFile;
        this.results = [];
        this.visitNode(sourceFile);
        return this.results;
    }

    private visitNode(node: ts.Node): void {
        if (ts.isExpression(node) || node.kind === ts.SyntaxKind.Identifier) {
            this.logTypeAndSymbol(node);
        }

        ts.forEachChild(node, child => this.visitNode(child));
    }

    private logTypeAndSymbol(node: ts.Node): void {
        var actualPos = ts.skipTrivia(this.currentSourceFile.text, node.pos);
        var lineAndCharacter = this.currentSourceFile.getLineAndCharacterOfPosition(actualPos);
        var sourceText = ts.getTextOfNodeFromSourceText(this.currentSourceFile.text, node);

        var type = this.checker.getTypeAtLocation(node);
        ts.Debug.assert(type !== undefined, "type doesn't exist");
        var symbol = this.checker.getSymbolAtLocation(node);

        var typeString = this.checker.typeToString(type, node.parent, ts.TypeFormatFlags.NoTruncation);
        if (symbol) {
            var symbolString = "Symbol(" + this.checker.symbolToString(symbol, node.parent);
            if (symbol.declarations) {
                for (let declaration of symbol.declarations) {
                    symbolString += ", ";
                    let declSourceFile = declaration.getSourceFile();
                    let declLineAndCharacter = declSourceFile.getLineAndCharacterOfPosition(declaration.pos);
                    symbolString += `Decl(${ ts.getBaseFileName(declSourceFile.fileName) }, ${ declLineAndCharacter.line }, ${ declLineAndCharacter.character })`
                }
            }
            symbolString += ")";

            typeString += ", " + symbolString;
        }

        this.results.push({
            line: lineAndCharacter.line,
            syntaxKind: node.kind,
            sourceText: sourceText,
            type: typeString
        });
    }
}
