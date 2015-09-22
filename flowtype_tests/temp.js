if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.A = new $$cts$$runtime.Brand('A');
var a = {};$$cts$$runtime.brand($$cts$$brandTypes.A, a);
function test(a) { }
$$cts$$runtime.cementGlobal("test",test);
test(a);
