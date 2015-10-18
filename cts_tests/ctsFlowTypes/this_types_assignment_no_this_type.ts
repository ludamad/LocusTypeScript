/* @TestExpectedToHaveCompileErrors */
type T1 = (this:any) => number;
type T2 = () => number;

var t1:T1;
var t2:T2;

t1 = t2; // Should error

