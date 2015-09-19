if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.foo = new $$cts$$runtime.Brand();
function foo() {
    var val = "hi";
    $$cts$$runtime.protectAssignment(Number, "x", val, 1);;
    $$cts$$runtime.brand($$cts$$brandTypes.foo, val);
    return val;
}
("foo",foo);
