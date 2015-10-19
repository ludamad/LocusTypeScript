/* @TestExpectedToHaveCompileErrors */
function Foo() {
    var this : declare Foo; 
    this.x = "Beans";
}

Foo.prototype.make = function() {
    /*@assertType("!Foo")*/ this;
    return "Canned " + this.y;
}
