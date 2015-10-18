/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

var tester;
(function() {
    var a : declare FunctionExit = {};
    tester = () => assertBranded(a);
    assertNotBranded(a);
    a.b = 0;
})();
tester();
