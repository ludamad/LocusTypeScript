if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
function usesFoo(foo) {
    $$cts$$runtime.cast(Foo,foo);
    return $$cts$$value$usesFoo.apply(this, arguments);
    }
$$cts$$runtime.cementGlobal("usesFoo",usesFoo);function $$cts$$value$usesFoo(foo) {
}
$$cts$$runtime.cementGlobal("$$cts$$value$usesFoo",usesFoo);
function Foo() {
    var /*downgraded*/foo = {};
    $$cts$$runtime.protectAssignment(Number, "x", foo, 1);;
    usesFoo(/*downgraded*/foo);
    $$cts$$runtime.protectAssignment(Number, "y", foo, 1);;$$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo, foo);
}
$$cts$$runtime.cementGlobal("Foo",Foo);
