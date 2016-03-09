// @KnownDefect 
/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function Foo(this: declare Foo) {
    this.x = 1;
    assertBranded(this)
}
Foo.prototype.myMethod = function()  {
    /*@assertType("!Foo")*/ (this);
    /*@assertType("!number")*/ (this.x);
    return this.x;
}

assertFails(function() {
    var f = <any>Foo;
    f.prototype.myMethod = function(){return 1;}; // Should be cemented!
});
