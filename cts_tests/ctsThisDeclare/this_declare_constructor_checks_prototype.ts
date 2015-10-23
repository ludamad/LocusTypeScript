/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function Foo(this: declare FooType) {
}

Foo.prototype.x = 1;
assertFails(function() {
    Foo.call({});
});
