//// [asyncFunctionDeclaration9_es6.ts]
async function foo(): Promise<void> {
  var v = { [await]: foo }
}

//// [asyncFunctionDeclaration9_es6.js]
function foo() {
    return __awaiter([this, Promise], function* () {
        var v = { [yield ]: foo };
    });
}
