// @KnownDefect
/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

for (var i = 0; i < 2; i++) {
    var a : declare Foo = {};
    switch (i) {
        case 0:
            a.b = 1;
            /* @assertType("!number") */ a.b;
            break;
            assertType(a, "b", [String, Number]);
            break;
        default:
            a.b = "Hello";
            /* @assertType("!string") */ a.b;
            assertType(a, "b", [String, Number]);
            break;
    }
    /* @assertType("!number|!string") */ a.b;
}
