if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var Test = (function () {
    function Test(a, b) {
        $$cts$$runtime.cast(Test,this);
        $$cts$$runtime.cast(Number,a);
        $$cts$$runtime.cast(Number,b);
        $$cts$$runtime.addUnenum(this,"$$cts$$value$a",a);
        $$cts$$runtime.addUnenum(this,"$$cts$$value$b",b);
    }
    $$cts$$runtime.protect(Number,"a",Test.prototype,true);
    $$cts$$runtime.protect(Number,"b",Test.prototype,true);
    return Test;
})();
$$cts$$runtime.cementGlobal("Test",Test);
