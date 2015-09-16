//// [tests/cases/compiler/declarationEmit_exportAssignment.ts] ////

//// [utils.ts]

export function foo() { }
export function bar() { }
export interface Buzz { }

//// [index.ts]
import {foo} from "./utils";
export = foo;

//// [utils.js]
function foo() { }
exports.foo = foo;
function bar() { }
exports.bar = bar;
//// [index.js]
var utils_1 = require("./utils");
module.exports = utils_1.foo;


//// [utils.d.ts]
export declare function foo(): void;
export declare function bar(): void;
export interface Buzz {
}
//// [index.d.ts]
import { foo } from "./utils";
export = foo;
