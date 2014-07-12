//// [tests/cases/compiler/exportAssignedTypeAsTypeAnnotation.ts] ////

//// [exportAssignedTypeAsTypeAnnotation_0.ts]

interface x {
    (): Date;
    foo: string;
}
export = x;
 
//// [exportAssignedTypeAsTypeAnnotation_1.ts]
///<reference path='exportAssignedTypeAsTypeAnnotation_0.ts'/>
import test = require('exportAssignedTypeAsTypeAnnotation_0');
var t2: test; // should not raise a 'container type' error


//// [exportAssignedTypeAsTypeAnnotation_0.js]
define(["require", "exports"], function (require, exports) {
});
//// [exportAssignedTypeAsTypeAnnotation_1.js]
define(["require", "exports"], function (require, exports) {
    var t2;
});
