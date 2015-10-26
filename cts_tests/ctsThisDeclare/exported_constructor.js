// Should output 1
if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
$$cts$$runtime.brandTypes.Foo.prototype = new $$cts$$runtime.Brand();
/*this-branded*/function Foo() {var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes. = new $$cts$$runtime.Brand('prototype');
    $$cts$$runtime.cast($$cts$$runtime.brandTypes.Foo.prototype, Object.getPrototypeOf(this));
    $$cts$$runtime.protectAssignment(Number, "x", this, 1);;
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo, this);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo.prototype, this);
}
exports.Foo = Foo;
$$cts$$runtime.cementGlobal("Foo",Foo);
$$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo.prototype, Foo.prototype);
/* @assertType("typeof Foo") */ Foo;
Foo.prototype.foo = function () {
    /*@assertType("!Foo")*/ this;
    console.log(this.x);
};
