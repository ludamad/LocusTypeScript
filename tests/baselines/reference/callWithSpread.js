//// [callWithSpread.ts]
interface X {
    foo(x: number, y: number, ...z: string[]);
}

function foo(x: number, y: number, ...z: string[]) {
}

var a: string[];
var z: number[];
var obj: X;
var xa: X[];

foo(1, 2, "abc");
foo(1, 2, ...a);
foo(1, 2, ...a, "abc");

obj.foo(1, 2, "abc");
obj.foo(1, 2, ...a);
obj.foo(1, 2, ...a, "abc");

(obj.foo)(1, 2, "abc");
(obj.foo)(1, 2, ...a);
(obj.foo)(1, 2, ...a, "abc");

xa[1].foo(1, 2, "abc");
xa[1].foo(1, 2, ...a);
xa[1].foo(1, 2, ...a, "abc");

(<Function>xa[1].foo)(...[1, 2, "abc"]);

class C {
    constructor(x: number, y: number, ...z: string[]) {
        this.foo(x, y);
        this.foo(x, y, ...z);
    }
    foo(x: number, y: number, ...z: string[]) {
    }
}

class D extends C {
    constructor() {
        super(1, 2);
        super(1, 2, ...a);
    }
    foo() {
        super.foo(1, 2);
        super.foo(1, 2, ...a);
    }
}

// Only supported in when target is ES6
var c = new C(1, 2, ...a);


//// [callWithSpread.js]
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function foo(x, y) {
    var z = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        z[_i - 2] = arguments[_i];
    }
}
var a;
var z;
var obj;
var xa;
foo(1, 2, "abc");
foo.apply(void 0, [1, 2].concat(a));
foo.apply(void 0, [1, 2].concat(a, ["abc"]));
obj.foo(1, 2, "abc");
obj.foo.apply(obj, [1, 2].concat(a));
obj.foo.apply(obj, [1, 2].concat(a, ["abc"]));
(obj.foo)(1, 2, "abc");
obj.foo.apply(obj, [1, 2].concat(a));
obj.foo.apply(obj, [1, 2].concat(a, ["abc"]));
xa[1].foo(1, 2, "abc");
(_a = xa[1]).foo.apply(_a, [1, 2].concat(a));
(_b = xa[1]).foo.apply(_b, [1, 2].concat(a, ["abc"]));
(_c = xa[1]).foo.apply(_c, [1, 2, "abc"]);
var C = (function () {
    function C(x, y) {
        var z = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            z[_i - 2] = arguments[_i];
        }
        this.foo(x, y);
        this.foo.apply(this, [x, y].concat(z));
    }
    C.prototype.foo = function (x, y) {
        var z = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            z[_i - 2] = arguments[_i];
        }
    };
    return C;
})();
var D = (function (_super) {
    __extends(D, _super);
    function D() {
        _super.call(this, 1, 2);
        _super.apply(this, [1, 2].concat(a));
    }
    D.prototype.foo = function () {
        _super.prototype.foo.call(this, 1, 2);
        _super.prototype.foo.apply(this, [1, 2].concat(a));
    };
    return D;
})(C);
// Only supported in when target is ES6
var c = new C(1, 2, ...a);
var _a, _b, _c;
