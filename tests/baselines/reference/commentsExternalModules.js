//// [tests/cases/compiler/commentsExternalModules.ts] ////

//// [commentsExternalModules_0.ts]

/** Module comment*/
export module m1 {
    /** b's comment*/
    export var b: number;
    /** foo's comment*/
    function foo() {
        return b;
    }
    /** m2 comments*/
    export module m2 {
        /** class comment;*/
        export class c {
        };
        /** i*/
        export var i = new c();
    }
    /** exported function*/
    export function fooExport() {
        return foo();
    }
}
m1.fooExport();
var myvar = new m1.m2.c();

/** Module comment */
export module m4 {
    /** b's comment */
    export var b: number;
    /** foo's comment
    */
    function foo() {
        return b;
    }
    /** m2 comments
    */
    export module m2 {
        /** class comment; */
        export class c {
        };
        /** i */
        export var i = new c();
    }
    /** exported function */
    export function fooExport() {
        return foo();
    }
}
m4.fooExport();
var myvar2 = new m4.m2.c();

//// [commentsExternalModules_1.ts]
/**This is on import declaration*/
import extMod = require("commentsExternalModules_0");
extMod.m1.fooExport();
var newVar = new extMod.m1.m2.c();
extMod.m4.fooExport();
var newVar2 = new extMod.m4.m2.c();


//// [commentsExternalModules_0.js]
define(["require", "exports"], function (require, exports) {
    (function (m1) {
        m1.b;
        function foo() {
            return m1.b;
        }
        (function (m2) {
            var c = (function () {
                function c() {
                }
                return c;
            })();
            m2.c = c;
            ;
            m2.i = new c();
        })(m1.m2 || (m1.m2 = {}));
        var m2 = m1.m2;
        function fooExport() {
            return foo();
        }
        m1.fooExport = fooExport;
    })(exports.m1 || (exports.m1 = {}));
    var m1 = exports.m1;
    m1.fooExport();
    var myvar = new m1.m2.c();
    (function (m4) {
        m4.b;
        function foo() {
            return m4.b;
        }
        (function (m2) {
            var c = (function () {
                function c() {
                }
                return c;
            })();
            m2.c = c;
            ;
            m2.i = new c();
        })(m4.m2 || (m4.m2 = {}));
        var m2 = m4.m2;
        function fooExport() {
            return foo();
        }
        m4.fooExport = fooExport;
    })(exports.m4 || (exports.m4 = {}));
    var m4 = exports.m4;
    m4.fooExport();
    var myvar2 = new m4.m2.c();
});
//// [commentsExternalModules_1.js]
define(["require", "exports", "commentsExternalModules_0"], function (require, exports, extMod) {
    extMod.m1.fooExport();
    var newVar = new extMod.m1.m2.c();
    extMod.m4.fooExport();
    var newVar2 = new extMod.m4.m2.c();
});


//// [commentsExternalModules_0.d.ts]
export declare module m1 {
    var b;
    module m2 {
        class c {
        }
        var i;
    }
    function fooExport();
}
export declare module m4 {
    var b;
    module m2 {
        class c {
        }
        var i;
    }
    function fooExport();
}
//// [commentsExternalModules_1.d.ts]
