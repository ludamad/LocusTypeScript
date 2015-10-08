if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
$$cts$$brandTypes.Foo.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Baz = new $$cts$$runtime.Brand('Baz');
$$cts$$brandTypes.Baz.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Bar = new $$cts$$runtime.Brand('Bar');
$$cts$$brandTypes.Bar.prototype = new $$cts$$runtime.Brand();
/*this-branded*/function Foo() {$$cts$$runtime.cast($$cts$$brandTypes.Foo.prototype, Object.getPrototypeOf(this))
    $$cts$$runtime.protectAssignment(Number, "x", this, ($$cts$$runtime.cast(Number,(this.y))));;$$cts$$runtime.brand($$cts$$brandTypes.Foo, this);
}
$$cts$$runtime.cementGlobal("Foo",Foo);
$$cts$$runtime.protectProtoAssignment(Number, undefined, $$cts$$brandTypes.Foo.prototype, "y", Foo, 1);;$$cts$$runtime.brand($$cts$$brandTypes.Foo.prototype, Foo.prototype);
/*this-branded*/function Baz() {$$cts$$runtime.cast($$cts$$brandTypes.Baz.prototype, Object.getPrototypeOf(this))
    $$cts$$runtime.brand($$cts$$brandTypes.Baz, this);
}
$$cts$$runtime.cementGlobal("Baz",Baz);$$cts$$runtime.brand($$cts$$brandTypes.Baz.prototype, Baz.prototype);
/*this-branded*/function Bar() {$$cts$$runtime.cast($$cts$$brandTypes.Bar.prototype, Object.getPrototypeOf(this))
    $$cts$$runtime.protectAssignment(Number, "total", this, ($$cts$$runtime.cast(Number,(this.x))) + ($$cts$$runtime.cast(Number,(this.y))) + ($$cts$$runtime.cast(Number,(this.z))));;$$cts$$runtime.brand($$cts$$brandTypes.Bar, this);
}
$$cts$$runtime.cementGlobal("Bar",Bar);
// Do we error if this assignment does not exist?
Bar.prototype = {};
$$cts$$runtime.protectProtoAssignment(Number, $$cts$$brandTypes.Foo.prototype, $$cts$$brandTypes.Bar.prototype, "z", Bar, 2);;$$cts$$runtime.brand($$cts$$brandTypes.Bar.prototype, Bar.prototype);
