//// [asyncFunctionDeclaration1_es6.ts]
async function foo(): Promise<void> {
}

//// [asyncFunctionDeclaration1_es6.js]
function foo() {
    return __awaiter(function* () {
    }, this, void 0, Promise);
}
