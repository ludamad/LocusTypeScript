if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
function makePoint(x, y) {
    $$cts$$runtime.cast(Number,x);
    switch (1) {
        case 1:
            var p = { x: x, y: y };
        default:
    }
    $$cts$$runtime.brand(Point, p);
    return p;
}
$$cts$$runtime.cementGlobal("makePoint",makePoint);
