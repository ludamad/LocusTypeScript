class Foo {
    constructor(public foo:!string) {}
}

/* @assertType("!Foo") */    ((function() {return new Foo("test");})());
/* @assertType("!number") */ ((function() {return 1;})());
/* @assertType("!string") */ ((function() {return "string";})());
