if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.Foo_ = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Foo_.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Bar_ = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Bar_.prototype = new $$cts$$runtime.Brand();
var Foo = function () {
    /*this-branded*/function Foo() {
        $$cts$$runtime.protectAssignment(Number, "x", this, ($$cts$$runtime.cast(Number,(this.y))));;$$cts$$runtime.brand($$cts$$brandTypes.Foo_, this);
    }
    $$cts$$runtime.protectProtoAssignment(Number, "y", Foo, 1);;
    $$cts$$runtime.brand($$cts$$brandTypes.prototype, Foo.prototype);
    return Foo;
};
var Bar = function () {
    /*this-branded*/function Bar() {
        this.total = ($$cts$$runtime.cast(Number,(this.x))) + ($$cts$$runtime.cast(Number,(this.y))) + this.z;$$cts$$runtime.brand($$cts$$brandTypes.Bar_, this);
    }
    // Do we error if this assignment does not exist?
    Bar.prototype.z = 1;
    $$cts$$runtime.brand($$cts$$brandTypes.prototype, Bar.prototype);
    return Bar;
};
