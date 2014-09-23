//// [classWithProtectedProperty.ts]
// accessing any private outside the class is an error

class C {
    protected x;
    protected a = '';
    protected b: string = '';
    protected c() { return '' }
    protected d = () => '';
    protected static e;
    protected static f() { return '' }
    protected static g = () => '';
}

class D extends C {
    method() {
        // No errors
        var d = new D();
        var r1: string = d.x;
        var r2: string = d.a;
        var r3: string = d.b;
        var r4: string = d.c();
        var r5: string = d.d();
        var r6: string = C.e;
        var r7: string = C.f();
        var r8: string = C.g();
    }
}

//// [classWithProtectedProperty.js]
// accessing any private outside the class is an error
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var C = (function () {
    function C() {
        this.a = '';
        this.b = '';
        this.d = function () { return ''; };
    }
    C.prototype.c = function () {
        return '';
    };
    C.f = function () {
        return '';
    };
    C.g = function () { return ''; };
    return C;
})();
var D = (function (_super) {
    __extends(D, _super);
    function D() {
        _super.apply(this, arguments);
    }
    D.prototype.method = function () {
        // No errors
        var d = new D();
        var r1 = d.x;
        var r2 = d.a;
        var r3 = d.b;
        var r4 = d.c();
        var r5 = d.d();
        var r6 = C.e;
        var r7 = C.f();
        var r8 = C.g();
    };
    return D;
})(C);
