// @KnownDefect
/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

for (var i = 0; i < 2; i++) {
    var a : declare SwitchAllCasesWrite = {};
    switch (i) {
        case 0:
            a.b = 1;
            assertType(a, "b", [String, Number]);
            break;
        default:
            a.b = "Hello";
            assertType(a, "b", [String, Number]);
            break;
    }
}
