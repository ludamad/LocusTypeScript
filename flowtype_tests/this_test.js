if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.Foo2 = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("Foo2",Foo2);
$$cts$$brandTypes.Foo = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("Foo",Foo);
function outer() {
    function Test2() {
        this.x = this.y;$$cts$$runtime.brand(Foo2, this);
    }
    Test2.prototype.y = 2;
    function Test() {
        this.x = 1;$$cts$$runtime.brand(Foo, this);
    }
    Test.prototype.test = 1;
    Test.prototype.test = "what";
    var foo = ($$cts$$runtime.cast($$cts$$brandTypes.Foo,(new Test())));
    var test;
    var foop = Test.prototype;
    return ($$cts$$runtime.cast($$cts$$brandTypes.prototype,(Test.prototype)));
}
$$cts$$runtime.cementGlobal("outer",outer);
