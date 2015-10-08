if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var GodObject = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("GodObject",GodObject);
/**/function makeGodObject() {
    var godObject = {};
    // num : !number
    $$cts$$runtime.protectAssignment(Number, "num", godObject, 1);;
    // strOrNum : !number|!string
    $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "strOrNum", godObject, Math.random() > .5 ? "string" : 1);;
    // strOrNum2 : !number|!string
    if (Math.random() > -1) {
        $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "strOrNum2", godObject, 1);;
        var shouldWork = godObject.$$cts$$value$strOrNum2;
        var shouldntWork = godObject.$$cts$$value$strOrNum2; // Error !string = !number 
    }
    else {
        $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "strOrNum2", godObject, "wee");;
    }
    godObject.$$cts$$value$strOrNum2 += "soup";
    // notConcreteNum : number
    if (Math.random() > -1) {
        $$cts$$runtime.protectAssignment(Number, "notConcreteNum", godObject, 1);;
    }
    $$cts$$runtime.protectAssignment(Number, "notConcreteNum", godObject, 1);; // Should be binding assignment
    godObject.$$cts$$value$notConcreteNum = 1; // Should not be binding assignment
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
go.$$cts$$value$strOrNum = "string";
go.$$cts$$value$strOrNum = 1;
go.$$cts$$value$strOrNum = ($$cts$$runtime.cast((new $$cts$$runtime.UnionType(String, Number)),({}))); // Error !number|!string = {}
go.strOrInterface = "string";
go.$$cts$$value$strOrNum2 = "string";
go.$$cts$$value$strOrNum2 = 1;
go.strOrNum2 = {}; // Runtime error
go.$$cts$$value$strOrNum2 = ($$cts$$runtime.cast((new $$cts$$runtime.UnionType(String, Number)),({}))); // Error !number|!string = {}
go.strOrNum3 = "string";
go.strOrNum3 = 1;
go.strOrNum3 = {}; // Error number|string = {}
go.$$cts$$value$notConcreteNum = "string"; // Error number = !string
