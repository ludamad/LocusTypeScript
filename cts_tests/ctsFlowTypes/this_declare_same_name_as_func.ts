function Foo() {
    var this : declare Foo;
    /* @{assertType !Foo} */ this;
}

function Bar() {
    var bar: declare Bar = {};
    /* @{assertType !Bar} */ bar;
}

/* @{assertType !Foo.prototype} */ Foo.prototype;
Foo.prototype.bar = 2;

var foo:!Foo = new Foo();
