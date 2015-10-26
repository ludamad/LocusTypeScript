/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function Foo(this: declare Foo) {
    this.x = 1;
}
Foo.prototype.myFunction = function()  {
    return 1;
}
Foo.prototype.myFunction.call({});
