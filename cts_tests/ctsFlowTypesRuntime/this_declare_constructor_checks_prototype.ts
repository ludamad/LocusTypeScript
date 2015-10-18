/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function Foo() {
    var this : declare Foo;
    assertBranded(this)
}
Foo.prototype.x = 1;
assertFails(function() {
    Foo.call({});
});
