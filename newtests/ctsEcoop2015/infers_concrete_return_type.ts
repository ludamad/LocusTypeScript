
class Foo {
    constructor(public foo:!string) {
    }
}

function test1() {
    return new Foo("test");
}

function test2() {
    return 1;
}

function test3() {
    return "string";
}

/* @assertType("!Foo") */    (test1());
/* @assertType("!number") */ (test2());
/* @assertType("!string") */ (test3());


