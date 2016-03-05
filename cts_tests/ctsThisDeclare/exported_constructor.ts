export function Foo(this: declare Foo) {
    this.x = 1;
}
/* @assertType("!Foo.prototype") */ (Foo.prototype);

/* @assertType("!typeof Foo") */ Foo;

Foo.prototype.foo = function() {
    /*@assertType("!Foo")*/ this;
    /*assertType("!number")*/ (this.x);
}
