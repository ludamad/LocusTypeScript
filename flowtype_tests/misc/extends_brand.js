if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}let $$cts$$brandTypes = {};
$$cts$$brandTypes.foo = new $$cts$$runtime.Brand('foo');
function foo() {
    var val = "hi";
    val.$$cts$$value$x = 1;
    $$cts$$runtime.brand($$cts$$brandTypes.foo, val);
    return val;
}
$$cts$$runtime.cementGlobal("foo",foo);
