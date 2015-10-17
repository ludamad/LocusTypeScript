if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
/*@afterEmit[isClassLike]{
    assertEmitted(/cts.*runtime.*cast.*Point.*this/);
    assertEmitted(/cts.*runtime.*cast.*Number.*x/);
    assertEmitted(/cts.*runtime.*cast.*Number.*y/);
    assertEmitted(/cts.*runtime.*addUnenum.*this.*cts..value.x.*\,.*x/);
    assertEmitted(/cts.*runtime.*addUnenum.*this.*cts..value.y.*\,.*y/);
}*/
var Point = (function () {
    function Point(x, y) {
        $$cts$$runtime.cast(Point,this);
        $$cts$$runtime.cast(Number,x);
        $$cts$$runtime.cast(Number,y);
        $$cts$$runtime.addUnenum(this,"$$cts$$value$x",x);
        $$cts$$runtime.addUnenum(this,"$$cts$$value$y",y);
    }
    $$cts$$runtime.protect(Number,"x",Point.prototype,true);
    $$cts$$runtime.protect(Number,"y",Point.prototype,true);
    return Point;
})();
/*@assert(isConcreteType(getType()), "Class types with concrete members should be concrete!")*/
new Point(1, 2);
