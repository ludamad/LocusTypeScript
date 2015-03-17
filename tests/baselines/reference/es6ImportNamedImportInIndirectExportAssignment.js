//// [tests/cases/compiler/es6ImportNamedImportInIndirectExportAssignment.ts] ////

//// [es6ImportNamedImportInIndirectExportAssignment_0.ts]

export module a {
    export class c {
    }
}

//// [es6ImportNamedImportInIndirectExportAssignment_1.ts]
import { a } from "es6ImportNamedImportInIndirectExportAssignment_0";
import x = a;
export = x;

//// [es6ImportNamedImportInIndirectExportAssignment_0.js]
var a;
(function (a) {
    var c = (function () {
        function c() {
        }
        return c;
    })();
    a.c = c;
})(a = exports.a || (exports.a = {}));
//// [es6ImportNamedImportInIndirectExportAssignment_1.js]
var _es6ImportNamedImportInIndirectExportAssignment_0 = require("es6ImportNamedImportInIndirectExportAssignment_0");
var x = _es6ImportNamedImportInIndirectExportAssignment_0.a;
module.exports = x;


//// [es6ImportNamedImportInIndirectExportAssignment_0.d.ts]
export declare module a {
    class c {
    }
}
