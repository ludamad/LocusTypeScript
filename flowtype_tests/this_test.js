if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.Foo = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Foo.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Bar_ = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Bar_.prototype = new $$cts$$runtime.Brand();
var Foo = function () {
    /*this-branded*/function Foo() {
        this.x = this.y;$$cts$$runtime.brand($$cts$$brandTypes.Foo, this);
    }
    $$cts$$runtime.protectProtoAssignment(Number, "y", Foo, 1);;
    $$cts$$runtime.brand($$cts$$brandTypes.prototype, Foo.prototype);
    return Foo;
};
var Bar = function () {
    /*this-branded*/function Bar() {
        this.total = this.x + this.y + this.z;$$cts$$runtime.brand($$cts$$brandTypes.Bar_, this);
    }
    // Do we error if this assignment does not exist?
    Bar.prototype = Foo.prototype;
    Bar.prototype.z = 1;
    $$cts$$runtime.brand($$cts$$brandTypes.prototype, Bar.prototype);
    return Bar;
};
