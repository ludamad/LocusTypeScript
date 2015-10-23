// @KnownDefect
// @RuntimeTest 
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

for (var i = 0; i < 2; i++) {
    var a : declare Foo = {};
    switch (i) {
        case 0:
            a.b = 1;
            /* @assertType("number") */ (a.b);
            break;
        default:
            break;
    }
    /* @assertType("number") */ (a.b);
    assertType(a, "b", null); // non-concrete
}
