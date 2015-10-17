if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var funcExpr = function () { }; // Note, different result for checking this directly in post ECOOP ConcreteTypeScript
/*@assert(!isConcreteType(getType()), "Function types shouldn't be concrete!")*/
funcExpr;
