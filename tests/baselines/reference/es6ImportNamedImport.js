//// [tests/cases/compiler/es6ImportNamedImport.ts] ////

//// [es6ImportNamedImport_0.ts]

export var a = 10;
export var x = a;
export var m = a;
export var a1 = 10;
export var x1 = 10;

//// [es6ImportNamedImport_1.ts]
import { } from "es6ImportNamedImport_0";
import { a } from "es6ImportNamedImport_0";
import { a as b } from "es6ImportNamedImport_0";
import { x, a as y } from "es6ImportNamedImport_0";
import { x as z,  } from "es6ImportNamedImport_0";
import { m,  } from "es6ImportNamedImport_0";
import { a1, x1 } from "es6ImportNamedImport_0";
import { a1 as a11, x1 as x11 } from "es6ImportNamedImport_0";


//// [es6ImportNamedImport_0.js]
a = 10;
x = a;
m = a;
a1 = 10;
x1 = 10;
//// [es6ImportNamedImport_1.js]


//// [es6ImportNamedImport_0.d.ts]
export declare var a: number;
export declare var x: number;
export declare var m: number;
export declare var a1: number;
export declare var x1: number;
//// [es6ImportNamedImport_1.d.ts]
