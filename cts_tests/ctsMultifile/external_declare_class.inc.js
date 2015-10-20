// @DontUseAsTest
if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
$$cts$$runtime.brandTypes.Foo.prototype = new $$cts$$runtime.Brand();
/*this-branded*/function Foo() {
    this.x = 1;
}
exports.Foo = Foo;
$$cts$$runtime.cementGlobal("Foo",Foo);
Foo.prototype.method = function () {
    return this.x;
}(new Foo().method());
