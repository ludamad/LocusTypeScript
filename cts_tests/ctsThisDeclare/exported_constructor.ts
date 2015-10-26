// Should output 1

export function Foo(this: declare Foo) {
    this.x = 1;
}

/* @assertType("typeof Foo") */ Foo;

Foo.prototype.foo = function() {
    /*@assertType("!Foo")*/ this;
    console.log(this.x);
}
