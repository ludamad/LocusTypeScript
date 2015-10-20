/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

var leakedA;
while (true) {
    let a : declare Foo = {};
    leakedA = a;
    assertNotBranded(a);
    a.b = 0;
    break;
}
assertBranded(leakedA);
