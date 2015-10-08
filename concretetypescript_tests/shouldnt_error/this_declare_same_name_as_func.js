if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
$$cts$$runtime.brandTypes.Foo.prototype = new $$cts$$runtime.Brand();
$$cts$$runtime.brandTypes.Bar = new $$cts$$runtime.Brand('Bar');
/*this-branded*/function Foo() {
    $$cts$$runtime.cast($$cts$$runtime.brandTypes.Foo.prototype, Object.getPrototypeOf(this));
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo, this);
}
$$cts$$runtime.cementGlobal("Foo",Foo);
function Bar() {
    var /*downgraded*/foo = {};$$cts$$runtime.brand($$cts$$runtime.brandTypes.Bar, foo);
}
$$cts$$runtime.cementGlobal("Bar",Bar);
$$cts$$runtime.protectProtoAssignment(Number, undefined, $$cts$$runtime.brandTypes.Foo.prototype, "bar", Foo, 2);;
$$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo.prototype, Foo.prototype);
var foo = ($$cts$$runtime.cast($$cts$$runtime.brandTypes.Foo,(new Foo())));
