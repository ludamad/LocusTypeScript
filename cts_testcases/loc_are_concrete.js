if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var what = 2;
function makeFoo() {
    var foo = {};
    return foo;
}
$$cts$$runtime.cementGlobal("makeFoo",makeFoo);
function test() {
    var v = ($$cts$$runtime.cast(Foo,(makeFoo())));
    return v;
}
$$cts$$runtime.cementGlobal("test",test);
