if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeln("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var cts$$temp$$types_0$$0;
exports.assert = require("assert");
require("./cts-runtime");
var __lookupSetter__ = Object.prototype.__lookupSetter__;
function getSetter(obj, prop) {
    return __lookupSetter__.call(obj, prop);
}
$$cts$$runtime.cementGlobal("getSetter",getSetter);
function assertNotBranded(val) {
    exports.assert(!val.$$cts$$brands);
}
exports.assertNotBranded = assertNotBranded;
$$cts$$runtime.cementGlobal("assertNotBranded",assertNotBranded);
function assertBranded(val) {
    exports.assert(val.$$cts$$brands);
}
exports.assertBranded = assertBranded;
$$cts$$runtime.cementGlobal("assertBranded",assertBranded);
function assertFails(f) {
    var failed = false;
    try {
        f();
    }
    catch (err) {
        failed = true;
    }
    // TODO error regex matching
    exports.assert(failed, "Operation should throw error!");
}
exports.assertFails = assertFails;
$$cts$$runtime.cementGlobal("assertFails",assertFails);
function assertType(val, prop, type) {
    var setter = getSetter(val, prop);
    if (type == null) {
        exports.assert(!setter, "Type not given, but setter installed.");
        return;
    }
    exports.assert(setter, "Setter should be installed!");
    if (Array.isArray(type)) {
        exports.assert(setter.$$cts$$type instanceof $$cts$$runtime.UnionType, "Union type not installed!");
        // FIX: Make sure type order doesn't matter. It changed from 1.4 to 1.6
        type.sort();
        setter.$$cts$$type.types.sort();
        for (var i = 0; i < type.length; i++) {
            exports.assert.equal(setter.$$cts$$type.types[i], type[i]);
        }
    }
    else {
        exports.assert.equal(setter.$$cts$$type, type);
    }
}
exports.assertType = assertType;
$$cts$$runtime.cementGlobal("assertType",assertType);
