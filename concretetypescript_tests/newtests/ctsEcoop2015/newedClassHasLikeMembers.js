if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
// TODO Double check the behaviour here
/* @assertEmitted[isClassLike](/cts.*runtime.*cast.*Point.*this/) */
var Point = (function () {
    function Point(x, y) {
        $$cts$$runtime.cast(Point,this);
        this.x = x;
        this.y = y;
    }
    return Point;
})();
/*@assert(isConcreteType(getType()), "Class types with no concrete members should be concrete!")*/
new Point(1, 2);
