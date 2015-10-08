function fooer() : !Foo {
    var foo : declare Foo = {};
    foo.a = 1;
    foo.a = "hey";
    return foo;
}

var foo:!Foo = fooer();

console.log(foo.a);
