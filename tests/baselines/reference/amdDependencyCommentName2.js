//// [amdDependencyCommentName2.ts]
///<amd-dependency path='bar' name='b'/>

import m1 = require("m2")
m1.f();

//// [amdDependencyCommentName2.js]
///<amd-dependency path='bar' name='b'/>
define(["require", "exports", "bar", "m2"], function (require, exports, b, m1) {
    m1.f();
});
