if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var A = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("A",A);
var a = {};
function test(a) {
}
$$cts$$runtime.cementGlobal("test",test);
test(a);
