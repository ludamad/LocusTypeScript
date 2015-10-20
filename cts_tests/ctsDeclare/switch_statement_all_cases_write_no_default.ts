// @KnownDefect
// @RuntimeTest
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

for (var i = 0; i < 2; i++) {
    var a : declare Foo = {};
    switch (i) {
        case 0:
            a.b = 1;
            /* @assertType("number") */ a.b;
            break;
        case 1:
            a.b = "Hello";
            /* @assertType("string") */ a.b;
            break;
    }
}
/* @assertType("number|string") */ a.b;
// Default must be accounted for, causing an uncertain write.
assertType(a, "b", null); // non-concrete
