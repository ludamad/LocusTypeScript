if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.MonkeyPatched = new $$cts$$runtime.Brand();
var Base = (function () {
    function Base(testItOut) {
        $$cts$$runtime.cast(Base,this);
        this.testItOut = testItOut;
    }
    return Base;
})();
$$cts$$runtime.cementGlobal("Base",Base);
//var test : declare MonkeyPatched = {};
function foo() {
    var test = new Base("ok");
    $$cts$$runtime.protectAssignment(String, "newParam", test, "Heyo");;$$cts$$runtime.brand($$cts$$brandTypes.MonkeyPatched, test);
    var testString = test.testItOut;
    var foo = test;
    $$cts$$runtime.brand($$cts$$brandTypes.MonkeyPatched, test);
    return foo;
}
$$cts$$runtime.cementGlobal("foo",foo);
var aa = 1;
//var monkey : !MonkeyPatched = test;
