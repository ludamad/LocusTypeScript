if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var GodObject = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("GodObject",GodObject);
function makeGodObject() {
    var godObject = {};
    // num : !number
    ;
    // strOrNum : !number|!string
    ;
    // strOrNum2 : !number|!string
    if (Math.random() > .5) {
        ;
        var shouldWork = godObject.$$cts$$value$strOrNum2; // Error !string = !number 
    }
    else {
        ;
    }
    // strOrInterface : !string|IAnything
    // Should this degrade to string|IAnything = IAnything?
    ;
    $$cts$$runtime.brand(GodObject, godObject);
    return godObject;
}
$$cts$$runtime.cementGlobal("makeGodObject",makeGodObject);
var go = ($$cts$$runtime.cast(GodObject,(makeGodObject())));
go.$$cts$$value$num = "string"; // Error !number = !string
go.strOrNum = "string";
go.strOrNum = 1;
go.strOrNum = {}; // Error !number|!string = {}
go.strOrInterface = "string";
go.strOrInterface = "string";
go.strOrNum2 = "string";
go.strOrNum2 = 1;
go.strOrNum2 = {}; // Error !string|IAnything = {}
