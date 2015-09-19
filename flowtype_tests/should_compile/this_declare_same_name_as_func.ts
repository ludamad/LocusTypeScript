function Foo() {
    var this : declare Foo;
}

function Bar() {
    var foo: declare Bar = {};
}

Foo.prototype.bar = 2;

var foo:!Foo = new Foo();
