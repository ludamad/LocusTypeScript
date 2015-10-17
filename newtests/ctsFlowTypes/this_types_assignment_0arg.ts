/* @TextExpectedToHaveCompileErrors */
type T1 = (this:string) => number;
type T2 = (this:number) => number;

var t1:T1;
var t2:T2;

t1 = t2; // Should error

