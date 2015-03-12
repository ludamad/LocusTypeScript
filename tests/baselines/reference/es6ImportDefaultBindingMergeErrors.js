//// [tests/cases/compiler/es6ImportDefaultBindingMergeErrors.ts] ////

//// [es6ImportDefaultBindingMergeErrors_0.ts]

var a = 10;
export = a;

//// [es6ImportDefaultBindingMergeErrors_1.ts]
import defaultBinding from "es6ImportDefaultBindingMergeErrors_0";
interface defaultBinding { // This is ok
}
var x = defaultBinding;
import defaultBinding2 from "es6ImportDefaultBindingMergeErrors_0"; // Should be error
var defaultBinding2 = "hello world"; 
import defaultBinding3 from "es6ImportDefaultBindingMergeErrors_0"; // Should be error
import defaultBinding3 from "es6ImportDefaultBindingMergeErrors_0"; // SHould be error


//// [es6ImportDefaultBindingMergeErrors_0.js]
var a = 10;
module.exports = a;
//// [es6ImportDefaultBindingMergeErrors_1.js]
var defaultBinding = require("es6ImportDefaultBindingMergeErrors_0");
var x = defaultBinding;
var defaultBinding2 = "hello world";
