if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
$$cts$$runtime.brandTypes.Foo.prototype = new $$cts$$runtime.Brand();
$$cts$$runtime.brandTypes.Bar = new $$cts$$runtime.Brand('Bar');
$$cts$$runtime.brandTypes.Bar.prototype = new $$cts$$runtime.Brand();
var Foo = function () {
    /*this-branded*/function Foo() {
        $$cts$$runtime.cast($$cts$$runtime.brandTypes.Foo.prototype, Object.getPrototypeOf(this));
        $$cts$$runtime.protectAssignment(Number, "x", this, ($$cts$$runtime.cast(Number,(this.y))));;$$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo, this);
    }
    $$cts$$runtime.protectProtoAssignment(Number, undefined, $$cts$$runtime.brandTypes.Foo.prototype, "y", Foo, 1);;
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo.prototype, Foo.prototype);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes., Foo.prototype);
    return Foo;
};
var Bar = function () {
    /*this-branded*/function Bar() {
        $$cts$$runtime.cast($$cts$$runtime.brandTypes.Bar.prototype, Object.getPrototypeOf(this));
        $$cts$$runtime.protectAssignment(Number, "total", this, ($$cts$$runtime.cast(Number,(this.x))) + ($$cts$$runtime.cast(Number,(this.y))) + ($$cts$$runtime.cast(Number,(this.z))));;$$cts$$runtime.brand($$cts$$runtime.brandTypes.Bar, this);
    }
    // Do we error if this assignment does not exist?
    $$cts$$runtime.protectProtoAssignment(Number, $$cts$$runtime.brandTypes.Foo.prototype, $$cts$$runtime.brandTypes.Bar.prototype, "z", Bar, 1);;
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Bar.prototype, Bar.prototype);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes., Bar.prototype);
    return Bar;
};
