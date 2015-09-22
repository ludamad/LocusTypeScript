if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}let $$cts$$brandTypes = {};
$$cts$$brandTypes.Foo = new $$cts$$runtime.Brand('Foo');
$$cts$$brandTypes.D = new $$cts$$runtime.Brand('D');
var foo = {};
$$cts$$runtime.protectAssignment(Number, "x", foo, 1);;
$$cts$$runtime.protectAssignment(Number, "y", foo, 2);;
while (false) {
    foo.$$cts$$value$sss = 1;
    var bar = foo;
}
function WhateverDude() {
    var d = {};
}
$$cts$$runtime.cementGlobal("WhateverDude",WhateverDude);
