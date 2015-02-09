//// [derivedClassIncludesInheritedMembers.ts]
class Base {
    a: string;
    b() { }
    get c() { return ''; }
    set c(v) { }

    static r: string;
    static s() { }
    static get t() { return ''; }
    static set t(v) { }

    constructor(x) { }
}

class Derived extends Base {
}

var d: Derived = new Derived(1);
var r1 = d.a;
var r2 = d.b();
var r3 = d.c;
d.c = '';
var r4 = Derived.r;
var r5 = Derived.s();
var r6 = Derived.t;
Derived.t = '';

class Base2 {
    [x: string]: Object;
    [x: number]: Date;
}

class Derived2 extends Base2 {
}

var d2: Derived2;
var r7 = d2[''];
var r8 = d2[1];



//// [derivedClassIncludesInheritedMembers.js]
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base = (function () {
    function Base(x) {
    }
    Base.prototype.b = function () { };
    Object.defineProperty(Base.prototype, "c", {
        get: function () {
            return '';
        },
        set: function (v) { },
        enumerable: true,
        configurable: true
    });
    Base.s = function () { };
    Object.defineProperty(Base, "t", {
        get: function () {
            return '';
        },
        set: function (v) { },
        enumerable: true,
        configurable: true
    });
    return Base;
})();
var Derived = (function (_super) {
    __extends(Derived, _super);
    function Derived() {
        _super.apply(this, arguments);
    }
    return Derived;
})(Base);
var d = new Derived(1);
var r1 = d.a;
var r2 = d.b();
var r3 = d.c;
d.c = '';
var r4 = Derived.r;
var r5 = Derived.s();
var r6 = Derived.t;
Derived.t = '';
var Base2 = (function () {
    function Base2() {
    }
    return Base2;
})();
var Derived2 = (function (_super) {
    __extends(Derived2, _super);
    function Derived2() {
        _super.apply(this, arguments);
    }
    return Derived2;
})(Base2);
var d2;
var r7 = d2[''];
var r8 = d2[1];
