if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
$$cts$$runtime.brandTypes.Foo.prototype = new $$cts$$runtime.Brand();
/*this-branded*/function Foo() {
    $$cts$$runtime.cast($$cts$$runtime.brandTypes.Foo.prototype, Object.getPrototypeOf(this));
    $$cts$$runtime.protectAssignment(String, "x", this, "Beans");;$$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo, this);
}
$$cts$$runtime.cementGlobal("Foo",Foo);
Foo.prototype.make = function () {
    return "Canned " + this.y;
};
$$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo.prototype, Foo.prototype);
