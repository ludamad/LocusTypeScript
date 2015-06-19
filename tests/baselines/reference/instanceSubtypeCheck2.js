//// [instanceSubtypeCheck2.ts]
class C1<T> {
    x: C2<T>;
}

class C2<T> extends C1<T> {
    x: string
}

//// [instanceSubtypeCheck2.js]
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var C1 = (function () {
    function C1() {
    }
    return C1;
})();
var C2 = (function (_super) {
    __extends(C2, _super);
    function C2() {
        _super.apply(this, arguments);
    }
    return C2;
})(C1);
