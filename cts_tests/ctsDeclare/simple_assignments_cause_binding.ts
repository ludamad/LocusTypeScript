// If this test fails, things are pretty broken as far as declare types go.
function func1() {
    var foo : declare Foo = {};
    foo.a = 1;
    foo.b = <number> 1;
}

function func2(foo:!Foo) {
    /* @assertType("!number") */ foo.a;
    /* @assertType("number") */ foo.b;
}
