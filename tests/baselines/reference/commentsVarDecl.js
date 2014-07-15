//// [commentsVarDecl.ts]

/** Variable comments*/
var myVariable = 10;

/** This is another variable comment*/
var anotherVariable = 30;

// shouldn't appear
var aVar = "";

/** this is multiline comment
  * All these variables are of number type */
var anotherAnotherVariable = 70;

/** Triple slash multiline comment*/
/** another line in the comment*/
/** comment line 2*/
var x = 70;

/** Triple slash comment on the assignement shouldnt be in .d.ts file*/
x = myVariable;

/** triple slash comment1*/
/** jsdocstyle comment - only this comment should be in .d.ts file*/
var n = 30;

/** var deckaration with comment on type as well*/
var y = /** value comment */ 20;

/// var deckaration with comment on type as well
var yy =
    /// value comment
    20;

/** comment2 */
var z = /** lambda comment */ (x: number, y: number) => x + y;

var z2: /** type comment*/ (x: number) => string;

var x2 = z2;

var n4: (x: number) => string;
n4 = z2;

//// [commentsVarDecl.js]
var myVariable = 10;
var anotherVariable = 30;
var aVar = "";
var anotherAnotherVariable = 70;
var x = 70;
x = myVariable;
var n = 30;
var y = 20;
var yy = 20;
var z = function (x, y) { return x + y; };
var z2;
var x2 = z2;
var n4;
n4 = z2;


//// [commentsVarDecl.d.ts]
declare var myVariable;
declare var anotherVariable;
declare var aVar;
declare var anotherAnotherVariable;
declare var x;
declare var n;
declare var y;
declare var yy;
declare var z;
declare var z2;
declare var x2;
declare var n4;
