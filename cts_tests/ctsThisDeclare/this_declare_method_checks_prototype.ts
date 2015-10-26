// @KnownDefect
/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function Foo(this: declare Foo) {
    this.x = 1;
    assertBranded(this)
}
Foo.prototype.myMethod = function()  {
    return this.x;
}

assertFails(function() {
    Foo.prototype.myMethod.call({});
});
