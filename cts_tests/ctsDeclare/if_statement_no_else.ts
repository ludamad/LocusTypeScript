// @KnownDefect
/* @RuntimeTest */

import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

for (var i = 0; i < 2; i++) {
    (function() {
        var a : declare Foo = {};
        if (i) {
            a.b = 1;
            // Known defect: Should degrade everything
            /* @assertType("number") */ (a.b);
            assertType(a, "b", null); // non-concrete
        }
        /* @assertType("number") */ (a.b);
    })();
}
