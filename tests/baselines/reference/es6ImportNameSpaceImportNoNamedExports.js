//// [tests/cases/compiler/es6ImportNameSpaceImportNoNamedExports.ts] ////

//// [es6ImportNameSpaceImportNoNamedExports_0.ts]

var a = 10;
export = a;

//// [es6ImportNameSpaceImportNoNamedExports_1.ts]
import * as nameSpaceBinding from "./es6ImportNameSpaceImportNoNamedExports_0"; // error

//// [es6ImportNameSpaceImportNoNamedExports_0.js]
var a = 10;
module.exports = a;
//// [es6ImportNameSpaceImportNoNamedExports_1.js]
