if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var Foo2 = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("Foo2",Foo2);
var Foo = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("Foo",Foo);
function outer() {
    function Test2() {
        this.x = 1;$$cts$$runtime.brand(Foo2, this);
    }
    Test2.prototype.test = 1;
    function Test() {
        this.x = 1;$$cts$$runtime.brand(Foo, this);
    }
    function foop(n) {
        $$cts$$runtime.cast(Number,n);
        return $$cts$$value$foop.apply(this, arguments);
    }function $$cts$$value$foop(n) {
        return 1;
    }
    Test.prototype.test = 1;
    Test.prototype.test = "what";
    console.log(($$cts$$runtime.cast(Number,(foop(2)))));
    var foo = ($$cts$$runtime.cast(Foo,(new Test())));
    var test;
    //var test : Foo = new Test();
    return ($$cts$$runtime.cast(prototype,(Test.prototype)));
}
$$cts$$runtime.cementGlobal("outer",outer);
