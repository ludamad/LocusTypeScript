if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.Foo = new $$cts$$runtime.Brand();
$$cts$$brandTypes.D = new $$cts$$runtime.Brand();
var foo = {};
$$cts$$runtime.protectAssignment(Number, "x", foo, 1);;
$$cts$$runtime.protectAssignment(Number, "y", foo, 2);;$$cts$$runtime.brand($$cts$$brandTypes.Foo, foo);
var foo2 = { ss: 0 };
foo2.ss = 1;
function WhateverDude() {
    var d = {};$$cts$$runtime.brand($$cts$$brandTypes.D, d);
    $$cts$$runtime.brand($$cts$$brandTypes.D, d);
}
$$cts$$runtime.cementGlobal("WhateverDude",WhateverDude);
