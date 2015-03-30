//// [derivedClassWithPrivateStaticShadowingProtectedStatic.ts]

class Base {
    protected static x: string;
    protected static fn(): string {
        return '';
    }

    protected static get a() { return 1; }
    protected static set a(v) { }
}

// should be error
class Derived extends Base {
    private static x: string; 
    private static fn(): string {
        return '';
    }

    private static get a() { return 1; }
    private static set a(v) { }
}

//// [derivedClassWithPrivateStaticShadowingProtectedStatic.js]
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base = (function () {
    function Base() {
    }
    Base.fn = function () {
        return '';
    };
    Object.defineProperty(Base, "a", {
        get: function () { return 1; },
        set: function (v) { },
        enumerable: true,
        configurable: true
    });
    return Base;
})();
// should be error
var Derived = (function (_super) {
    __extends(Derived, _super);
    function Derived() {
        _super.apply(this, arguments);
    }
    Derived.fn = function () {
        return '';
    };
    Object.defineProperty(Derived, "a", {
        get: function () { return 1; },
        set: function (v) { },
        enumerable: true,
        configurable: true
    });
    return Derived;
})(Base);
