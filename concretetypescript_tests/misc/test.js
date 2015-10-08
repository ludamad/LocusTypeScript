if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}


var $$cts$$brandTypes/* TODO UNUSED */ = {};


$$cts$$runtime.brandTypes.foo = new $$cts$$runtime.Brand('foo');
$$cts$$runtime.brandTypes.foo.prototype = new $$cts$$runtime.Brand();


/*this-branded*/function foo() {


    $$cts$$runtime.cast($$cts$$runtime.brandTypes.foo.prototype, Object.getPrototypeOf(this));

    $$cts$$runtime.protectAssignment(Number, "x", this, 1);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.foo, this);
}
$$cts$$runtime.cementGlobal("foo",foo);
$$cts$$runtime.brand($$cts$$runtime.brandTypes.foo.prototype, foo.prototype);
