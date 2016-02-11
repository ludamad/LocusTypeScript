
var foo : declare Foo = {};
foo.method = function () {
    /* @assertType("!Foo") */ this;
}

