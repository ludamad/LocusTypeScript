/* @TestExpectedToHaveCompileErrors */
function Foo(this: declare Foo) {
    this.x = "Beans";
}

Foo.prototype.make = function() {
    /*@assertType("!Foo")*/ this;
    /* @assertError[isStatement](/does not exist/) */ (this.y);
}
