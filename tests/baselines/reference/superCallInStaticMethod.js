//// [superCallInStaticMethod.ts]
class Doing {
    public static staticMethod() {
    }
}

class Other extends Doing {
    // in static method
    public static staticMethod() {
        super.staticMethod();
    }

    // in a lambda inside a static method
    public static lambdaInsideAStaticMethod() {
        () => {
            super.staticMethod();
        }
    }

    // in an object literal inside a static method
    public static objectLiteralInsideAStaticMethod() {
        return {
            a: () => {
                super.staticMethod();
            },
            b: super.staticMethod()
        };
    }

    // in a getter
    public static get staticGetter() {
        super.staticMethod();

        return 0;
    }

    // in a setter
    public static set staticGetter(value: number) {
        super.staticMethod();
    }

    // in static method
    public static initializerInAStaticMethod(a = super.staticMethod()) {
        super.staticMethod();
    }
}


//// [superCallInStaticMethod.js]
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Doing = (function () {
    function Doing() {
    }
    Doing.staticMethod = function () {
    };
    return Doing;
})();
var Other = (function (_super) {
    __extends(Other, _super);
    function Other() {
        _super.apply(this, arguments);
    }
    // in static method
    Other.staticMethod = function () {
        _super.staticMethod.call(this);
    };
    // in a lambda inside a static method
    Other.lambdaInsideAStaticMethod = function () {
        var _this = this;
        (function () {
            _super.staticMethod.call(_this);
        });
    };
    // in an object literal inside a static method
    Other.objectLiteralInsideAStaticMethod = function () {
        var _this = this;
        return {
            a: function () {
                _super.staticMethod.call(_this);
            },
            b: _super.staticMethod.call(this)
        };
    };
    Object.defineProperty(Other, "staticGetter", {
        // in a getter
        get: function () {
            _super.staticMethod.call(this);
            return 0;
        },
        // in a setter
        set: function (value) {
            _super.staticMethod.call(this);
        },
        enumerable: true,
        configurable: true
    });
    // in static method
    Other.initializerInAStaticMethod = function (a) {
        if (a === void 0) { a = _super.staticMethod.call(this); }
        _super.staticMethod.call(this);
    };
    return Other;
})(Doing);
