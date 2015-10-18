// @KnownDefect
// @RuntimeTest
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

for (var i = 0; i < 2; i++) {
    var a : declare SwitchAllCasesWriteNoDefault = {};
    switch (i) {
        case 0:
            a.b = 1;
            break;
        case 1:
            a.b = "Hello";
            break;
    }
}
// Default must be accounted for, causing an uncertain write.
assertType(a, "b", null); // non-concrete
