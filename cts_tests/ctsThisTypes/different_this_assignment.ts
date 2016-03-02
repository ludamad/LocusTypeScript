// @KnownDefect
/* @TestExpectedToHaveCompileErrors */
type T1 = (this:string) => number;
type T2 = (this:number) => number;
type T3 = () => number;

var t1:T1;
var t2:T2;
var t3:T3;

// @assertError[isStatement](/'string'.*'number'/)
t1 = t2; 

// @assertNotError[isStatement](/.*/)
t3 = t1;
t3 = t2;


// Test with extra arguments, just in case:

type T1_1arg = (this:string; num:number) => number;
type T2_1arg = (this:number; num:number) => number;

var t1_1arg:T1_1arg;
var t2_1arg:T2_1arg;

// @assertError[isStatement](/'string'.*'number'/)
t1_1arg = t2_1arg; 

