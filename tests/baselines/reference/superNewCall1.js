//// [superNewCall1.ts]

class A<T1, T2> {
    constructor(private map: (value: T1) => T2) {

    }
}

class B extends A<number, string> {
    constructor() {
        new super(value => String(value));
    }
}

//// [superNewCall1.js]
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var A = (function () {
    function A(map) {
        this.map = map;
    }
    return A;
})();
var B = (function (_super) {
    __extends(B, _super);
    function B() {
        new _super.prototype(function (value) { return String(value); });
    }
    return B;
})(A);
