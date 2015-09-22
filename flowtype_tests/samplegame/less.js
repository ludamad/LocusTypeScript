if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
function MyMethod() {
    var test = this.x;
    return 1;
}
$$cts$$runtime.cementGlobal("MyMethod",MyMethod);
var mySig = MyMethod;
