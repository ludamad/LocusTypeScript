if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
/* @RuntimeTest */
var cts_asserts_1 = require("../cts_asserts");
var leakedA;
while (true) {
    var a = {};
    leakedA = /*downgraded*/a;
    cts_asserts_1.assertNotBranded(/*downgraded*/a);
    $$cts$$runtime.protectAssignment(Number, "b", a, 0);;
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo, a);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Foo, a);
    break;
}
cts_asserts_1.assertBranded(leakedA);
