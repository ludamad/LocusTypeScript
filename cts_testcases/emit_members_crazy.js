if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var GodObject = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("GodObject",GodObject);
function makeGodObject() {
    var godObject = {};
    godObject.$$cts$$value$num = 1;
    godObject.strOrNum = Math.random() > .5 ? "string" : 1;
    godObject.strOrInterface = Math.random() > .5 ? "string" : 1;
    godObject.strOrInterface = 1;
    if (Math.random() > .5) {
        godObject.$$cts$$value$strOrNum2 = 1;
        var shouldWork = godObject.$$cts$$value$strOrNum2;
    }
    else {
        godObject.$$cts$$value$strOrNum2 = "wee";
    }
    $$cts$$runtime.brand(GodObject, godObject);
    return godObject;
}
$$cts$$runtime.cementGlobal("makeGodObject",makeGodObject);
var go = ($$cts$$runtime.cast(GodObject,(makeGodObject())));
go.$$cts$$value$num = "string"; // Error
go.strOrNum = "string";
go.strOrNum = 1;
go.strOrNum = {}; // Error
go.strOrInterface = "string";
go.strOrInterface = "string";
go.strOrNum2 = "string";
go.strOrNum2 = 1;
go.strOrNum2 = {}; // Error
