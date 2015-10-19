/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

(function() {
    var a : declare Foo = {b: 0};
    /* @assertType("!Foo") */ a;
    assertType(a, "b", Number);
})();
