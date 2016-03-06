export function Foo(this: declare Foo) {
    this.x = 1;
    this.foo();
}
/* @assertType("!Foo.prototype") */ (Foo.prototype);

var f = Foo.prototype;
f = <Foo> <any> 1;
f.foo();

/* @assertType("!typeof Foo") */ Foo;

/* @assertType("!Foo.prototype") */ (Foo.prototype);
Foo.prototype.foo = function() {
    /*@assertType("!Foo")*/ this;
    /*assertType("!number")*/ (this.x);
};
/* @assertType("!Foo.prototype") */ (Foo.prototype);
Foo.prototype.foo();
Foo.prototype.jigger = 1;
