export function Foo(this: declare Foo) {
    this.x = 1;
    this.foo();
}
/* @assertType("!Foo.prototype") */ (Foo.prototype);

var f = Foo.prototype;
f = <Foo> <any> 1;

/* @assertType("!typeof Foo") */ Foo;

Foo.prototype.foo = function() {
    /*@assertType("!Foo")*/ this;
    /*assertType("!number")*/ (this.x);
}
var myvar = Foo.prototype.foo;
