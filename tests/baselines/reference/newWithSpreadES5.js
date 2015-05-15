//// [newWithSpreadES5.ts]

function f(x: number, y: number, ...z: string[]) {
}

interface A {
    f: {
        new (x: number, y: number, ...z: string[]);
    }
}

class B {
    constructor(x: number, y: number, ...z: string[]) {}
}

interface C {
    "a-b": typeof B;
}

interface D {
    1: typeof B;
}

var a: string[];
var b: A;
var c: C;
var d: A[];
var e: { [key: string]: A };
var g: C[];
var h: { [key: string]: C };
var i: C[][];

// Basic expression
new f(1, 2, "string");
new f(1, 2, ...a);
new f(1, 2, ...a, "string");

// Call expression
new f(1, 2, "string")();
new f(1, 2, ...a)();
new f(1, 2, ...a, "string")();

// Property access expression
new b.f(1, 2, "string");
new b.f(1, 2, ...a);
new b.f(1, 2, ...a, "string"); 

// Parenthesised expression
new (b.f)(1, 2, "string");
new (b.f)(1, 2, ...a);
new (b.f)(1, 2, ...a, "string"); 

// Element access expression
new d[1].f(1, 2, "string");
new d[1].f(1, 2, ...a);
new d[1].f(1, 2, ...a, "string");

// Element access expression with a punctuated key
new e["a-b"].f(1, 2, "string");
new e["a-b"].f(1, 2, ...a);
new e["a-b"].f(1, 2, ...a, "string");

// Basic expression
new B(1, 2, "string");
new B(1, 2, ...a);
new B(1, 2, ...a, "string");

// Property access expression
new c["a-b"](1, 2, "string");
new c["a-b"](1, 2, ...a);
new c["a-b"](1, 2, ...a, "string");

// Parenthesised expression
new (c["a-b"])(1, 2, "string");
new (c["a-b"])(1, 2, ...a);
new (c["a-b"])(1, 2, ...a, "string");

// Element access expression
new g[1]["a-b"](1, 2, "string");
new g[1]["a-b"](1, 2, ...a);
new g[1]["a-b"](1, 2, ...a, "string");

// Element access expression with a punctuated key
new h["a-b"]["a-b"](1, 2, "string");
new h["a-b"]["a-b"](1, 2, ...a);
new h["a-b"]["a-b"](1, 2, ...a, "string");

// Element access expression with a number
new i["a-b"][1](1, 2, "string");
new i["a-b"][1](1, 2, ...a);
new i["a-b"][1](1, 2, ...a, "string");

//// [newWithSpreadES5.js]
function f(x, y) {
    var z = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        z[_i - 2] = arguments[_i];
    }
}
var B = (function () {
    function B(x, y) {
        var z = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            z[_i - 2] = arguments[_i];
        }
    }
    return B;
})();
var a;
var b;
var c;
var d;
var e;
var g;
var h;
var i;
// Basic expression
new f(1, 2, "string");
new (Function.bind.apply(f, [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply(f, [void 0].concat([1, 2].concat(a, ["string"]))));
// Call expression
new f(1, 2, "string")();
new (Function.bind.apply(f, [void 0].concat([1, 2].concat(a))))();
new (Function.bind.apply(f, [void 0].concat([1, 2].concat(a, ["string"]))))();
// Property access expression
new b.f(1, 2, "string");
new (Function.bind.apply(b.f, [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply(b.f, [void 0].concat([1, 2].concat(a, ["string"]))));
// Parenthesised expression
new (b.f)(1, 2, "string");
new (Function.bind.apply((b.f), [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply((b.f), [void 0].concat([1, 2].concat(a, ["string"]))));
// Element access expression
new d[1].f(1, 2, "string");
new (Function.bind.apply(d[1].f, [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply(d[1].f, [void 0].concat([1, 2].concat(a, ["string"]))));
// Element access expression with a punctuated key
new e["a-b"].f(1, 2, "string");
new (Function.bind.apply(e["a-b"].f, [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply(e["a-b"].f, [void 0].concat([1, 2].concat(a, ["string"]))));
// Basic expression
new B(1, 2, "string");
new (Function.bind.apply(B, [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply(B, [void 0].concat([1, 2].concat(a, ["string"]))));
// Property access expression
new c["a-b"](1, 2, "string");
new (Function.bind.apply(c["a-b"], [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply(c["a-b"], [void 0].concat([1, 2].concat(a, ["string"]))));
// Parenthesised expression
new (c["a-b"])(1, 2, "string");
new (Function.bind.apply((c["a-b"]), [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply((c["a-b"]), [void 0].concat([1, 2].concat(a, ["string"]))));
// Element access expression
new g[1]["a-b"](1, 2, "string");
new (Function.bind.apply(g[1]["a-b"], [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply(g[1]["a-b"], [void 0].concat([1, 2].concat(a, ["string"]))));
// Element access expression with a punctuated key
new h["a-b"]["a-b"](1, 2, "string");
new (Function.bind.apply(h["a-b"]["a-b"], [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply(h["a-b"]["a-b"], [void 0].concat([1, 2].concat(a, ["string"]))));
// Element access expression with a number
new i["a-b"][1](1, 2, "string");
new (Function.bind.apply(i["a-b"][1], [void 0].concat([1, 2].concat(a))));
new (Function.bind.apply(i["a-b"][1], [void 0].concat([1, 2].concat(a, ["string"]))));
