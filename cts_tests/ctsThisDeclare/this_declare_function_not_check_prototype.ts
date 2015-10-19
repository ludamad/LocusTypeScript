/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function Foo() {
    var this : declare Foo;
    this.x = 1;
    assertBranded(this)
}
Foo.prototype.myFunction = function()  {
    return 1;
}
Foo.prototype.myFunction.call({});
