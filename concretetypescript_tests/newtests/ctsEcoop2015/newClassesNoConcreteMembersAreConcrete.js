if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
/*@afterEmit[isClassLike]{
    assertEmitted(/\s+cts.*runtime.*cast.*Point;/);
}*/
var Point = (function () {
    function Point(x, y) {
        $$cts$$runtime.cast(Point,this);
        this.x = x;
    }
    return Point;
})();
// TODO Double check if this should be the case
/*@assert(isConcreteType(getType()), "Class types with no concrete members should be concrete!")*/
new Point(1, 2);
