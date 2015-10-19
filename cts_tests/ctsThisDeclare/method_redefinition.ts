// @KnownDefect
// @TestExpectedToHaveCompileErrors 

function Foo() {
    var this: declare FooType;
    /*@assertType("!FooType")*/ this;
}

Foo.prototype.foo = function() { return this; }
Foo.prototype.foo = function() { return this; } // Should error (at runtime?)
