// @RuntimeTest 
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

var test : declare Test = {};

test.x = 0;
assert(test.x === 1);
(<any>test).x = 1;
test.y = 0;
(<any>test).y = 2;

assert(test.x === 1);
assert(test.y === 2);

