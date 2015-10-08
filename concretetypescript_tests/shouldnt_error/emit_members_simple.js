if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Point = new $$cts$$runtime.Brand('Point');
function makePoint(x, y) {
    $$cts$$runtime.cast(Number,x);
    return $$cts$$value$makePoint.apply(this, arguments);
    }
$$cts$$runtime.cementGlobal("makePoint",makePoint);function $$cts$$value$makePoint(x, y) {
    var /*downgraded*/obj = {};
    $$cts$$runtime.protectAssignment(Number, "x", obj, x);;
    obj.y = y;$$cts$$runtime.brand($$cts$$runtime.brandTypes.Point, obj);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Point, obj);
    return obj;
}
$$cts$$runtime.cementGlobal("$$cts$$value$makePoint",makePoint);
