if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.foo = new $$cts$$runtime.Brand('foo');
function foo() {
    var /*downgraded*/val = "hi";
    $$cts$$runtime.protectAssignment(Number, "x", val, 1);;$$cts$$runtime.brand($$cts$$runtime.brandTypes.foo, val);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.foo, val);
    return val;
}
$$cts$$runtime.cementGlobal("foo",foo);
