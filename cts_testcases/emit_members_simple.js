if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var Point = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("Point",Point);
function makePoint(x, y) {
    $$cts$$runtime.cast(Number,x);
    var obj = {};
    $$cts$$runtime.protectAssignment(Number, "x", "obj"x);;
    obj.y = y;
    $$cts$$runtime.brand(Point, obj);
    return obj;
}
$$cts$$runtime.cementGlobal("makePoint",makePoint);
