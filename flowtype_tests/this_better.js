if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.Foo = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Foo.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Baz = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Baz.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Bar = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Bar.prototype = new $$cts$$runtime.Brand();
/*this-branded*/function Foo() {
    $$cts$$runtime.protectAssignment(Number, "x", this, ($$cts$$runtime.cast(Number,(this.y))));;$$cts$$runtime.brand($$cts$$brandTypes.Foo, this);
    $$cts$$runtime.brand($$cts$$brandTypes.Foo, this);
}
$$cts$$runtime.cementGlobal("Foo",Foo);
$$cts$$runtime.protectProtoAssignment(Number, "y", Foo, 1);;$$cts$$runtime.brand($$cts$$brandTypes.Foo.prototype, Foo.prototype);
/*this-branded*/function Baz() {
    $$cts$$runtime.brand($$cts$$brandTypes.Baz, this);
    $$cts$$runtime.brand($$cts$$brandTypes.Baz, this);
}
$$cts$$runtime.cementGlobal("Baz",Baz);$$cts$$runtime.brand($$cts$$brandTypes.Baz.prototype, Baz.prototype);
/*this-branded*/function Bar() {
    $$cts$$runtime.protectAssignment(Number, "total", this, ($$cts$$runtime.cast(Number,(this.x))) + ($$cts$$runtime.cast(Number,(this.y))) + ($$cts$$runtime.cast(Number,(this.z))));;$$cts$$runtime.brand($$cts$$brandTypes.Bar, this);
    $$cts$$runtime.brand($$cts$$brandTypes.Bar, this);
}
$$cts$$runtime.cementGlobal("Bar",Bar);
// Do we error if this assignment does not exist?
Bar.prototype = Foo.prototype;
$$cts$$runtime.protectProtoAssignment(Number, "z", Bar, 2);;$$cts$$runtime.brand($$cts$$brandTypes.Bar.prototype, Bar.prototype);
