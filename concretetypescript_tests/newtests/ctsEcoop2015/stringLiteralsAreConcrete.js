if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
/* @TestExpectedToHaveCompileErrors */
var str = "string";
/*@assertType(concrete(stringType))*/ str;
str = ($$cts$$runtime.cast(String,(string)));
