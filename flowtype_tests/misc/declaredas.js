if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Branded = new $$cts$$runtime.Brand('Branded');
function makeBranded() {
    var branded = {};
    $$cts$$runtime.protectAssignment(Number, "x", branded, 1);;
    $$cts$$runtime.protectAssignment(Number, "y", branded, 1);;$$cts$$runtime.brand($$cts$$runtime.brandTypes.Branded, branded);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Branded, branded);
    return branded;
}
$$cts$$runtime.cementGlobal("makeBranded",makeBranded);
var b = ($$cts$$runtime.cast($$cts$$runtime.brandTypes.Branded,(makeBranded())));
var c = b;
if (!($$cts$$runtime.brandTypes.Branded.$$cts$$check(c))) {
    console.log(c.x);
}
