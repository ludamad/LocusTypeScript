var what = 2;
function makeFoo() : !Foo {
    var foo : declare Foo = {};
    return foo;
}

function test() : !Foo {
    var v:!Foo = makeFoo();
    return v;
}
