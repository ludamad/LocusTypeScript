// @KnownDefect
// @TestExpectedToHaveCompileErrors 

function Foo(this: declare FooType) {
    /*@assertType("!FooType")*/ this;
}

Foo.prototype.foo = function() { return this; }
Foo.prototype.foo = function() { return this; } // Should error (at runtime?)
