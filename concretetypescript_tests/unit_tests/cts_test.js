var assert = require("assert")

var __lookupSetter__ = Object.prototype.__lookupSetter__;
function getSetter(obj, prop) {
    return __lookupSetter__.call(obj, prop);
}

module.exports = {
   assertNotBranded: function(val) {
       assert.ok(!val.$$cts$$brands);
   },
   assertBranded: function(val) {
       assert.ok(val.$$cts$$brands);
   },
   assertType: function(val, prop, type) {
       var setter = getSetter(val, prop);
       if (type == null) {
           assert.ok(!setter, "Type not given, but setter installed.");
           return;
       }
       assert.ok(setter, "Setter should be installed!");
       if (Array.isArray(type)) {
           assert.ok(setter.$$cts$$type instanceof $$cts$$runtime.UnionType, "Union type not installed!");
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
};
