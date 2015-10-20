if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
// @RuntimeTest
var cts_asserts_1 = require("../cts_asserts");
function usesFoo() {
    var foo = new external_declare_class_inc_1.Foo();
    cts_asserts_1.assertBranded(foo);
    /* @assertType("!Foo"); */ foo;
    /* @assertType("!number"); */ (foo.method());
    cts_asserts_1.assert(foo.method() === 1);
}
$$cts$$runtime.cementGlobal("usesFoo",usesFoo);
usesFoo();
