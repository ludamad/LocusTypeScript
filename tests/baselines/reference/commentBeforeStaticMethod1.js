//// [commentBeforeStaticMethod1.ts]
class C {
  /**
   * Returns bar
   */
  public static foo(): string {
    return "bar";
  }
}

//// [commentBeforeStaticMethod1.js]
var C = (function () {
    function C() {
    }
    C.foo = function () {
        return "bar";
    };
    return C;
})();
