if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var Point = (function () {
    function Point(x, y) {
        $$cts$$runtime.cast(Point,this);
        $$cts$$runtime.cast(Number,x);
        $$cts$$runtime.cast(Number,y);
        $$cts$$runtime.addUnenum(this,"$$cts$$value$x",x);
        /*@assertType("!Point");*/
        this;
    }
    $$cts$$runtime.protect(Number,"x",Point.prototype,true);
    /*@assertEmitted[isFunctionLike](/cts.*cast.*Point.*this/) */
    /*@assertEmitted[isFunctionLike](/cts.*cast.*String.*s/)   */
    /*@assertEmitted[isFunctionLike](/cement[^]*cement/)       */
    $$cts$$runtime.cement(Point.prototype,"test",function (s) {
        $$cts$$runtime.cast(Point,this);
        $$cts$$runtime.cast(String,s);
        return this.$$cts$$value$test.apply(this, arguments);
        });
    $$cts$$runtime.cement(Point.prototype,"$$cts$$value$test",function (s) {
        /*@assertType("!Point");*/
        this;
    });
    return Point;
})();
