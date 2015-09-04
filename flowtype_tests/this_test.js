if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var Foo2 = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("Foo2",Foo2);
var Foo = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("Foo",Foo);
function Test2() {
    var _this = this;
    $$cts$$runtime.protectAssignment(Number, "x", _this, 1);;$$cts$$runtime.brand(Foo2, _this);
}
$$cts$$runtime.cementGlobal("Test2",Test2);
function Test() {
    $$cts$$runtime.protectAssignment(Number, "x", this, 1);;
    this.x = "string";
    this.y;$$cts$$runtime.brand(Foo, this);
}
$$cts$$runtime.cementGlobal("Test",Test);
function foop(n) {
    $$cts$$runtime.cast(Number,n);
    return $$cts$$value$foop.apply(this, arguments);
}
$$cts$$runtime.cementGlobal("foop",foop);function $$cts$$value$foop(n) {
    return 1;
}
$$cts$$runtime.cementGlobal("$$cts$$value$foop",foop);
//Test.prototype.test = 1;
//Test.prototype.test = "what";
console.log(($$cts$$runtime.cast(Number,(foop(2)))));
var foo = ($$cts$$runtime.cast(Foo,(new Test())));
//var test : Foo = new Test();
