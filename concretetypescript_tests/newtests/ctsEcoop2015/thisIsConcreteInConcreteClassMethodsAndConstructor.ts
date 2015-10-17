
class Point {
    constructor(public x:!number, y:!number) {
        /*@assertType("!Point");*/
        this;
    }
    /*@afterEmit[isFunctionLike]{assertEmitted(/cement[^]*cement/);}       */
    /*@assertEmitted[isFunctionLike](/cts.*cast.*Point.*this/) */
    /*@assertEmitted[isFunctionLike](/cts.*cast.*String.*s/)   */
    test(s:!string) {
        /*@assertType("!Point");*/
        this;
    }
}
