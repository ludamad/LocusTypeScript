if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Func1 = new $$cts$$runtime.Brand('Func1');
$$cts$$runtime.brandTypes.Func1.prototype = new $$cts$$runtime.Brand();
$$cts$$runtime.brandTypes.Func2 = new $$cts$$runtime.Brand('Func2');
$$cts$$runtime.brandTypes.Func2.prototype = new $$cts$$runtime.Brand();
/*this-branded*/function func1() {
    $$cts$$runtime.cast($$cts$$runtime.brandTypes.Func1.prototype, Object.getPrototypeOf(this));
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Func1, this);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Func1, this);
    return 1;
}
$$cts$$runtime.cementGlobal("func1",func1);
$$cts$$runtime.brand($$cts$$runtime.brandTypes.Func1.prototype, func1.prototype);
/*this-branded*/function func2() {
    $$cts$$runtime.cast($$cts$$runtime.brandTypes.Func2.prototype, Object.getPrototypeOf(this));
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Func2, this);
    $$cts$$runtime.brand($$cts$$runtime.brandTypes.Func2, this);
    return 1;
}
$$cts$$runtime.cementGlobal("func2",func2);
$$cts$$runtime.brand($$cts$$runtime.brandTypes.Func2.prototype, func2.prototype);
var f0 = func1;
var f1 = func1;
f1 = func2;
