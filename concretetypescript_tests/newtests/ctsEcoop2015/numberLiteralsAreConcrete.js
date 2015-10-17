/* @TestExpectedToHaveCompileErrors */
if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var num = 1;
/*@assertType(concrete(numberType))*/
num;
/*
@afterCheck[isStatement]{
  assertError("Type 'number' is not assignable to type '!number'");
}
*/
num = ($$cts$$runtime.cast(Number,(num)));
