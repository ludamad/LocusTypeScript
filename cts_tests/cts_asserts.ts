declare var require, $$cts$$runtime;

export var assert = require("assert")

require("./cts-runtime")

var __lookupSetter__ = (<any>Object.prototype).__lookupSetter__;
function getSetter(obj, prop) {
    return __lookupSetter__.call(obj, prop);
}

export function assertNotBranded(val) {
   assert(!val.$$cts$$brands);
}
export function assertBranded(val) {
   assert(val.$$cts$$brands);
}
export function assertFails(f) {
    var failed = false;
    try {
        f();
    } catch(err) {
        failed = true;
    }
    // TODO error regex matching
    assert(failed, "Operation should throw error!")
}
export function assertType(val, prop, type) {
   var setter = getSetter(val, prop);
   if (type == null) {
       assert(!setter, "Type not given, but setter installed.");
       return;
   }
   assert(setter, "Setter should be installed!");
   if (Array.isArray(type)) {
       assert(setter.$$cts$$type instanceof $$cts$$runtime.UnionType, "Union type not installed!");
       // FIX: Make sure type order doesn't matter. It changed from 1.4 to 1.6
       type.sort()
       setter.$$cts$$type.types.sort();
       for (var i = 0; i < type.length; i++) {
           assert.equal(setter.$$cts$$type.types[i], type[i]);
       }
   } else {
       assert.equal(setter.$$cts$$type, type);
   }
}
