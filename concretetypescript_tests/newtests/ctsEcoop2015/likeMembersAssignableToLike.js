if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var ClassWithA = (function () {
    function ClassWithA(a) {
        $$cts$$runtime.cast(ClassWithA,this);
        this.a = a;
    }
    return ClassWithA;
})();
var hasA = new ClassWithA("string");
