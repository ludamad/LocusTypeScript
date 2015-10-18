/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

for (var i = 0; i < 2; i++) {
    (function() {
        var a : declare IfNoElse = {};
        if (i) {
            a.b = 1;
            assertType(a, "b", null); // non-concrete
        }
    })();
}
