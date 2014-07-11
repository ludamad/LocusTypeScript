//// [structuralTypeInDeclareFileForModule.ts]

module M { export var x; }
var m = M;

//// [structuralTypeInDeclareFileForModule.js]
var M;
(function (M) {
    M.x;
})(M || (M = {}));
var m = M;


//// [structuralTypeInDeclareFileForModule.d.ts]
declare module M {
    var x: any;
}
declare var m: typeof M;
