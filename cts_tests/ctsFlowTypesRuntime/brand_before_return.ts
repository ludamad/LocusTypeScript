/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

(function() {
    var a : declare BeforeReturn = {};
    assertNotBranded(a);
    a.b = 0;
    return assertBranded(a);
})();
