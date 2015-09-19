if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.Foo = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("Foo",Foo);
$$cts$$brandTypes.Bar = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("Bar",Bar);
function Foo() {
    $$cts$$runtime.brand(Foo, this);
}
$$cts$$runtime.cementGlobal("Foo",Foo);
function Bar() {
    var foo = {};$$cts$$runtime.brand(Bar, foo);
}
$$cts$$runtime.cementGlobal("Bar",Bar);
$$cts$$runtime.protectAssignment(Number, "bar", this, 2);;
var foo = ($$cts$$runtime.cast($$cts$$brandTypes.Foo,(new Foo())));
