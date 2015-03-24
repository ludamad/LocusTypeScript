//// [tests/cases/conformance/es6/modules/exportsAndImports4-amd.ts] ////

//// [t1.ts]

export default "hello";

//// [t2.ts]
import a = require("./t1");
a.default;
import b from "./t1";
b;
import * as c from "./t1";
c.default;
import { default as d } from "./t1";
d;
import e1, * as e2 from "./t1";
e1;
e2.default;
import f1, { default as f2 } from "./t1";
f1;
f2;
import "./t1";

//// [t3.ts]
import a = require("./t1");
a.default;
import b from "./t1";
b;
import * as c from "./t1";
c.default;
import { default as d } from "./t1";
d;
import e1, * as e2 from "./t1";
e1;
e2.default;
import f1, { default as f2 } from "./t1";
f1;
f2;
export { a, b, c, d, e1, e2, f1, f2 };


//// [t1.js]
define(["require", "exports"], function (require, exports) {
    exports.default = "hello";
});
//// [t3.js]
define(["require", "exports", "./t1", "./t1", "./t1", "./t1", "./t1", "./t1"], function (require, exports, a, _t1, c, _t1_2, _t1_3, _t1_4) {
    exports.a = a;
    a.default;
    exports.b = _t1.default;
    _t1.default;
    exports.c = c;
    c.default;
    exports.d = _t1_2.default;
    _t1_2.default;
    var e2 = _t1_3;
    exports.e1 = _t1_3.default;
    exports.e2 = e2;
    _t1_3.default;
    e2.default;
    exports.f1 = _t1_4.default;
    exports.f2 = _t1_4.default;
    _t1_4.default;
    _t1_4.default;
});
