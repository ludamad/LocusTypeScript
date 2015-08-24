if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var Point = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("Point",Point);
function foo() {
    var point = {};
    if (true) {
        ;
        ;
    }
    else {
        ;
    }
    $$cts$$runtime.brand(Point, point);
    return point;
}
$$cts$$runtime.cementGlobal("foo",foo);
var p = ($$cts$$runtime.cast(Point,(foo())));
