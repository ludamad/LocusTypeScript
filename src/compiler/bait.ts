class Foo {
    static foo:!string = "1";
    myMethod(){}
}

class Bar extends Foo {
    myOther(){}
}
/* @assertType("") */ Foo.prototype.myMethod
/* @assertType("") */ Foo.prototype.myMethod()
/* @assertType("") */ Foo.foo;
var c = Foo.prototype.myMethod;
/* @assertType("") */ c;


