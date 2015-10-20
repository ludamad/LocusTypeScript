/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

var tester;
(function() {
    var a : declare Foo = {};
    /* @assertType("{}") */ a;
    tester = () => assertBranded(a);
    assertNotBranded(a);
    a.b = 0;
    /* @assertType("!Foo") */ a;
})();
tester();
