if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.Foo = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Foo.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Bar = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Bar.prototype = new $$cts$$runtime.Brand();
var Foo = function () {
    /*this-branded*/function Foo() {
        $$cts$$runtime.protectAssignment(Number, "x", this, ($$cts$$runtime.cast(Number,(this.y))));;$$cts$$runtime.brand($$cts$$brandTypes.Foo, this);
        $$cts$$runtime.brand($$cts$$brandTypes.Foo, this);
    }
    $$cts$$runtime.protectProtoAssignment(Number, "y", Foo, 1);;$$cts$$runtime.brand($$cts$$brandTypes.Foo.prototype, Foo.prototype);
    $$cts$$runtime.brand($$cts$$brandTypes.prototype, Foo.prototype);
    return Foo;
};
var Bar = function () {
    /*this-branded*/function Bar() {
        $$cts$$runtime.protectAssignment(Number, "total", this, ($$cts$$runtime.cast(Number,(this.x))) + ($$cts$$runtime.cast(Number,(this.y))) + ($$cts$$runtime.cast(Number,(this.z))));;$$cts$$runtime.brand($$cts$$brandTypes.Bar, this);
        $$cts$$runtime.brand($$cts$$brandTypes.Bar, this);
    }
    // Do we error if this assignment does not exist?
    $$cts$$runtime.protectProtoAssignment(Number, "z", Bar, 1);;$$cts$$runtime.brand($$cts$$brandTypes.Bar.prototype, Bar.prototype);
    $$cts$$runtime.brand($$cts$$brandTypes.prototype, Bar.prototype);
    return Bar;
};
