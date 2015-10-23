// @RuntimeTest 
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

var Foo = (function() {
    function Foo(this: declare Foo) {
        this.x = this.y;
    }
    Foo.prototype.y = 1;
    return Foo;
})();

var Bar = (function() {
    function Bar(this: declare Bar extends Foo) {
        Foo.call(this);
        this.total = this.x + this.y + this.z;
    }
    Bar.prototype = new Foo();
    Bar.prototype.z = 1;
    return Bar;
})();

// Ensure we don't foul up any bindings:
let bar:Bar = new Bar();
assert(bar.x === 1);
assert(bar.y === 1);
assert(bar.z === 1);
assert(bar.total === 3);
