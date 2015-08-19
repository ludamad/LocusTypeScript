if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var Foo = (function () {
    function Foo() {
    }
    return Foo;
})();
$$cts$$runtime.cementGlobal("Foo",Foo);
function makeFoo() {
    return new Foo();
}
$$cts$$runtime.cementGlobal("makeFoo",makeFoo);
function test() {
    var v = ($$cts$$runtime.cast(Foo,(makeFoo())));
    if (1) {
        let t = 2;
        if (2) {
            let t2 = 2;
            $$cts$$runtime.brand(Foop2, t2);
        }
        $$cts$$runtime.brand(Foop, t);
    }
    return v;
}
$$cts$$runtime.cementGlobal("test",test);
