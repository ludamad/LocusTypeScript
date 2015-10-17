if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
/* @TestExpectedToHaveCompileErrors */
/*
@afterCheck[isStatement]{
  assertError("Type 'string' is not assignable to type '!string'");
}
*/
var str = ($$cts$$runtime.cast(String,("string")));
