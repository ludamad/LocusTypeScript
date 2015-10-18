/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

for (var i = 0; i < 2; i++) {
    (function() {
        var a : declare IfNoElseAfterAssign = {};
        a.b = 1;
        assertType(a, "b", [String, Number]);
        if (i) {
            a.b = "Hello";
            assertType(a, "b", [String, Number]);
        }
    })();
}
