/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

(function() {
    var a : declare Declared = {b: 0};
    /* @assertType("!Declared") */ a;
    assertType(a, "b", Number);
})();
