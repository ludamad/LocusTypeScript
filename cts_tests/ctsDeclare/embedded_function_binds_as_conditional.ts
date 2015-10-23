// @KnownDefect

function makeFoo1() : !Foo1 {
    function embedded() {
        foo.x = 1;
    }
    var foo: declare Foo1 = {};
    foo.x = "hey";
    /* @assertType('!string') */ (foo.x);
    embedded();
    // @UpForDiscussion
    /* @assertType('!string|!number') */ (foo.x);
    if (true) foo.x = "hey";
    // @UpForDiscussion
    /* @assertType('!string|!number') */ (foo.x);
    return foo;
}

function makeFoo2() : !Foo2 {
    var foo: declare Foo2 = {};
    embedded();
    function embedded() {
        foo.x = 1;
    }
    // @UpForDiscussion
    /* @assertType('number') */ (foo.x);
    return foo;
}
