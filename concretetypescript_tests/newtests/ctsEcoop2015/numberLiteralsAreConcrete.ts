/* @TestExpectedToHaveCompileErrors */

var num = 1;
/*@assertType(concrete(numberType))*/ 
num;

/*
@afterCheck[isStatement]{
  assertError("Type 'number' is not assignable to type '!number'");
} 
*/ 
num = <number>num;
