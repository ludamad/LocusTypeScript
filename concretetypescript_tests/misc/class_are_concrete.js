if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foop = new $$cts$$runtime.Brand('Foop');
$$cts$$runtime.brandTypes.Foop2 = new $$cts$$runtime.Brand('Foop2');
var Foo = (function () {
    function Foo() {
    }
    return Foo;
})();
function makeFoo() {
    return new Foo();
}
$$cts$$runtime.cementGlobal("makeFoo",makeFoo);
function test() {
    var v = ($$cts$$runtime.cast(Foo,(makeFoo())));
    if (1) {
        var /*downgraded*/t = 2;$$cts$$runtime.brand($$cts$$runtime.brandTypes.Foop, t);
        if (2) {
            var /*downgraded*/t2 = 2;$$cts$$runtime.brand($$cts$$runtime.brandTypes.Foop2, t2);
        }
    }
    return v;
}
$$cts$$runtime.cementGlobal("test",test);
