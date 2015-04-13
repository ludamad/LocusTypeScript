//// [classExtendingPrimitive2.ts]
// classes cannot extend primitives

class C4a extends void {}
class C5a extends null { }

//// [classExtendingPrimitive2.js]
// classes cannot extend primitives
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var C4a = (function () {
    function C4a() {
    }
    return C4a;
})();
void {};
var C5a = (function (_super) {
    __extends(C5a, _super);
    function C5a() {
        _super.apply(this, arguments);
    }
    return C5a;
})(null);
