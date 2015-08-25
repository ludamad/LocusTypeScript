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
    $$cts$$runtime.protectAssignment(Number, "num", godObject, 1);;
    // strOrNum : !number|!string
    godObject.strOrNum = Math.random() > .5 ? "string" : 1;
    // strOrNum2 : !number|!string
    if (Math.random() > .5) {
        $$cts$$runtime.protectAssignment(String, "strOrNum2", godObject, 1);;
        var shouldntWork = godObject.$$cts$$value$strOrNum2; // Error !string = !number 
    }
    else {
        $$cts$$runtime.protectAssignment(String, "strOrNum2", godObject, "wee");;
    }
    // notConcreteNum : number
    if (Math.random() > .5) {
        $$cts$$runtime.protectAssignment(Number, "notConcreteNum", godObject, 1);;
    }
    // strOrNum3: !number|string -> number|string
    godObject.strOrNum3 = Math.random() > .5 ? "string" : 1;
    // strOrInterface : !string|IAnything -> string|IAnything -> IAnything
    godObject.strOrInterface = Math.random() > .5 ? "string" : {};
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
go.strOrNum2 = {}; // Error !number|!string = {}
go.strOrNum3 = "string";
go.strOrNum3 = 1;
go.strOrNum3 = {}; // Error number|string = {}
go.notConcreteNum = "string"; // Error number = !string
