/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

(function() {
    var a : declare Foo = {};
    /* @assertType("{}") */ a;
    assertNotBranded(a);
    a.b = 0;
    /* @assertType("!number") */ a.b;
    /* @assertType("!Foo") */ a;
    return assertBranded(a);
})();
