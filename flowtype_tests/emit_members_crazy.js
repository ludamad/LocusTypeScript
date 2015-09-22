if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.GodObject = new $$cts$$runtime.Brand('GodObject');
function makeGodObject() {
    var godObject = {};
    $$cts$$runtime.protectAssignment(Number, "num", godObject, 1);;
    $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "strOrNum", godObject, Math.random() > .5 ? "string" : 1);;
    godObject.strOrInterface = Math.random() > .5 ? "string" : 1;
    godObject.strOrInterface = 1;
    if (Math.random() > .5) {
        godObject.$$cts$$value$strOrNum2 = 1;
    }$$cts$$runtime.brand($$cts$$brandTypes.GodObject, godObject);
    var test = godObject.strOrNum2;
    $$cts$$runtime.brand($$cts$$brandTypes.GodObject, godObject);
    return godObject;
}
$$cts$$runtime.cementGlobal("makeGodObject",makeGodObject);
var go = ($$cts$$runtime.cast($$cts$$brandTypes.GodObject,(makeGodObject())));
go.$$cts$$value$num = "string"; // Error
go.$$cts$$value$strOrNum = "string";
go.$$cts$$value$strOrNum = 1;
go.$$cts$$value$strOrNum = ($$cts$$runtime.cast((new $$cts$$runtime.UnionType(String, Number)),({}))); // Error
go.strOrInterface = "string";
go.strOrInterface = "string";
go.strOrNum2 = "string";
go.strOrNum2 = 1;
go.strOrNum2 = {}; // Error
