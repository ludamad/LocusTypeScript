
brand interface Foo {
    method : (x:number) => void
}

var foo : declare Foo = {};
foo.method = function (x) {
    /* @assertType("number") */ x;
}

