//// [multipleExports.ts]

export module M {
    export var v = 0;
    export let x;
}

const x = 0;
export module M {
    v;
    export {x};
}


//// [multipleExports.js]
var M;
(function (M) {
    M.v = 0;
    M.x;
})(M = exports.M || (exports.M = {}));
var x = 0;
var M;
(function (M) {
    M.v;
    M.x = M.x;
})(M = exports.M || (exports.M = {}));
