/* @TestExpectedToHaveCompileErrors */
/*
@afterCheck[isStatement]{
  assertError("Type 'string' is not assignable to type '!string'");
} 
*/ 
var str:!string = <string>"string";
