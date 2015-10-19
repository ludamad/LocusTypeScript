/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

for (var i = 0; i < 2; i++) {
    (function() {
        var a : declare Foo = {};
        if (i) {
            a.b = 1;
            /* @assertType("!number") */ a.b;
            assertType(a, "b", [String, Number]);
        } else {
            a.b = "Hello";
            /* @assertType("!string") */ a.b;
            assertType(a, "b", [String, Number]);
        }
        /* @assertType("!number|!string") */ a.b;
    })();
}
