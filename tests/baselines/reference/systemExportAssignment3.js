//// [tests/cases/compiler/systemExportAssignment3.ts] ////

//// [modules.d.ts]

declare module "a" {
    var a: number;
    export = a;  // OK, in ambient context
}

//// [b.ts]
import * as a from "a";


//// [b.js]
System.register([], function(exports_1) {
    return {
        setters:[],
        execute: function() {
        }
    }
});
