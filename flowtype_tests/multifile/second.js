if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
function makeBrand() {
    var b = {};
    $$cts$$runtime.brand(Brand, b);
    return b;
}
exports.makeBrand = makeBrand;
$$cts$$runtime.cementGlobal("makeBrand",makeBrand);
