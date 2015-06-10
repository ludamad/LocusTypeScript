//// [asyncFunctionDeclaration13_es6.ts]
async function foo(): Promise<void> {
   // Legal to use 'await' in a type context.
   var v: await;
}


//// [asyncFunctionDeclaration13_es6.js]
function foo() {
    return __awaiter(function* () {
        // Legal to use 'await' in a type context.
        var v;
    },
    this, void 0, Promise);
}
