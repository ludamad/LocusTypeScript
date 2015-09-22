if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}let $$cts$$brandTypes = {};
$$cts$$brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
var a = { a: 1 };
$$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "a", a, 1);
var test = a.$$cts$$value$a;
$$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "b", a, 1);;
if (1) {
    $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "a", a, "hey");;
    $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "b", a, "hey");;
}
