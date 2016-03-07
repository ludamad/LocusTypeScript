Foo.prototype.foo = function() {
    /*@assertType("!Foo")*/ this;
    /*assertType("!number")*/ (this.x);
};

/* @assertType("!typeof Foo") */ Foo;
/* @assertType("!Foo.prototype") */ (Foo.prototype);
(Foo.prototype.foo);
export function Foo(this: declare Foo) {
    this.foo();
    this.x = 1;
}
