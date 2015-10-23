// @KnownDefect
if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foo1 = new $$cts$$runtime.Brand('Foo1');
$$cts$$runtime.brandTypes.Foo2 = new $$cts$$runtime.Brand('Foo2');
function makeFoo1() {
    function embedded() {
        $$cts$$runtime.protectAssignment(String, "x", foo, 1);;
    }
    var foo = {};
    $$cts$$runtime.protectAssignment(String, "x", foo, "hey");;
    /* @assertType('!string') */ (foo.$$cts$$value$x);
    embedded();
    // @UpForDiscussion
    /* @assertType('!string|!number') */ (foo.$$cts$$value$x);
    if (true) {
        $$cts$$runtime.protectAssignment(String, "x", foo, "hey");;
    }
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo1, foo);
    // @UpForDiscussion
    /* @assertType('!string|!number') */ (foo.$$cts$$value$x);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo1, foo);
    return foo;
}
$$cts$$runtime.cementGlobal("makeFoo1",makeFoo1);
function makeFoo2() {
    var foo = {};
    embedded();
    function embedded() {
        foo.$$cts$$value$x = 1;
    }
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo2, foo);
    // @UpForDiscussion
    /* @assertType('number') */ (foo.x);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo2, foo);
    return foo;
}
$$cts$$runtime.cementGlobal("makeFoo2",makeFoo2);
