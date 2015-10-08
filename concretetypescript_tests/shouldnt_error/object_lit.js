if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
var /*downgraded*/a = {  };
$$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "a", a, 1);
var test = ($$cts$$runtime.cast(Number,(a.a)));
$$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "b", a, 1);;
if (1) {
    $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "a", a, "hey");;
    $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "b", a, "hey");;
}$$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo, a);
