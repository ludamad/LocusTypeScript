if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var obj = { a: 1, b: 2, c: 3 };
/*@assert(!isConcreteType(getType()), "Object literal types shouldn't be concrete!")*/
obj;
