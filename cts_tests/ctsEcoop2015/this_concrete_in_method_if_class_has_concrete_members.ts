
class Point {
    constructor(public x:!number, y:!number) {
        /*@assertType("!Point");*/
        this;
    }
    /*@assertEmitted[isFunctionLike](/cts.*cast.*Point.*this/) */
    /*@assertEmitted[isFunctionLike](/cts.*cast.*String.*s/)   */
    /*@assertEmitted[isFunctionLike](/cement[^]*cement/)       */
    test(s:!string) {
        /*@assertType("!Point");*/
        this;
    }
}
