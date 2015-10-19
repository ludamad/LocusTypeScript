function foo() {
    var this: declare Foo;
    this.x = 1;
}

function myMethod(this: !Foo) {
    /* @assertType("!Foo") */ this;
    this.x = 1;
}

function foo() {
    /* @assertType("any") */ this;
}

var f: () => void = foo.prototype.test;
var g: (this:!Foo) => void = f;
