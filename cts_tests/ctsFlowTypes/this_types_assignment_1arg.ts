/* @TestExpectedToHaveCompileErrors */
type T1 = (this:string; num:number) => number;
type T2 = (this:number; num:number) => number;

var t1:T1;
var t2:T2;

t1 = t2; // Should error
