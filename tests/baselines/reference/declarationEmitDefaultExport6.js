//// [declarationEmitDefaultExport6.ts]
export class A {}
export default new A();


//// [declarationEmitDefaultExport6.js]
export class A {
}
export default new A();


//// [declarationEmitDefaultExport6.d.ts]
export declare class A {
}
export default : A;
