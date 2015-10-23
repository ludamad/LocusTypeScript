if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
$$cts$$runtime.brandTypes.Foo.prototype = new $$cts$$runtime.Brand();
/*this-branded*/function foo() {
    /* @assertType("!Foo") */ this;
}
$$cts$$runtime.cementGlobal("foo",foo);
