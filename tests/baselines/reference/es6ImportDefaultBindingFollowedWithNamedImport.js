//// [tests/cases/compiler/es6ImportDefaultBindingFollowedWithNamedImport.ts] ////

//// [es6ImportDefaultBindingFollowedWithNamedImport_0.ts]

export var a = 10;
export var x = a;
export var m = a;

//// [es6ImportDefaultBindingFollowedWithNamedImport_1.ts]
import defaultBinding1, { } from "es6ImportDefaultBindingFollowedWithNamedImport_0";
import defaultBinding2, { a } from "es6ImportDefaultBindingFollowedWithNamedImport_0";
var x1: number = a;
import defaultBinding3, { a as b } from "es6ImportDefaultBindingFollowedWithNamedImport_0";
var x1: number = b;
import defaultBinding4, { x, a as y } from "es6ImportDefaultBindingFollowedWithNamedImport_0";
var x1: number = x;
var x1: number = y;
import defaultBinding5, { x as z,  } from "es6ImportDefaultBindingFollowedWithNamedImport_0";
var x1: number = z;
import defaultBinding6, { m,  } from "es6ImportDefaultBindingFollowedWithNamedImport_0";
var x1: number = m;


//// [es6ImportDefaultBindingFollowedWithNamedImport_0.js]
exports.a = 10;
exports.x = exports.a;
exports.m = exports.a;
//// [es6ImportDefaultBindingFollowedWithNamedImport_1.js]
var defaultBinding2 = require("es6ImportDefaultBindingFollowedWithNamedImport_0");
var x1 = _es6ImportDefaultBindingFollowedWithNamedImport_0_1.a;
var defaultBinding3 = require("es6ImportDefaultBindingFollowedWithNamedImport_0");
var x1 = _es6ImportDefaultBindingFollowedWithNamedImport_0_2.a;
var defaultBinding4 = require("es6ImportDefaultBindingFollowedWithNamedImport_0");
var x1 = _es6ImportDefaultBindingFollowedWithNamedImport_0_3.x;
var x1 = _es6ImportDefaultBindingFollowedWithNamedImport_0_3.a;
var defaultBinding5 = require("es6ImportDefaultBindingFollowedWithNamedImport_0");
var x1 = _es6ImportDefaultBindingFollowedWithNamedImport_0_4.x;
var defaultBinding6 = require("es6ImportDefaultBindingFollowedWithNamedImport_0");
var x1 = _es6ImportDefaultBindingFollowedWithNamedImport_0_5.m;


//// [es6ImportDefaultBindingFollowedWithNamedImport_0.d.ts]
export declare var a: number;
export declare var x: number;
export declare var m: number;
//// [es6ImportDefaultBindingFollowedWithNamedImport_1.d.ts]
