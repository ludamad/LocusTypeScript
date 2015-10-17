

/* @TestExpectedToHaveCompileErrors */
var str = "string";
/*@assertType(concrete(stringType))*/ str;
str = <string>string;
