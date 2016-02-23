/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

(function() {
    var a : declare Foo = {};
    // Intermediate type:
    /* @assertType("{} becomes !Foo") */ a;
    // Formal type:
    var b = a;
    /* @assertType("{}") */ b;
    assertNotBranded(a);
    a.b = 0;
    /* @assertType("!number") */ (a.b);
    // Intermediate type:
    /* @assertType("!Foo") */ a;
    // Formal type:
    var c = a;
    /* @assertType("!Foo") */ c;
    return assertBranded(a);
})();

