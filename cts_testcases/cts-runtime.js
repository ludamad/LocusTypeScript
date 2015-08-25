/* ConcreteTypeScript runtime
 *
 * Copyright (c) 2015 Gregor Richards
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
 * SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
 * OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
 * CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

if (typeof $$cts$$runtime === "undefined") (function(global) {
    runtime = new (function() {
        var cement, getSetter;

        if (Object.__lookupSetter__) {
            // Deprecated but overall more desirable:
            var __lookupSetter__ = Object.prototype.__lookupSetter__;
            getSetter = function (obj, prop) {
                return __lookupSetter__.call(obj, prop);
            }
        } else {
            // Standard in ES6 but unlikely to be well optimized:
            getSetter = function (obj, prop) {
                return Object.setOwnPropertyDescriptor(obj, prop).set;
            };
        }
        if (Object.defineProperty) {
            // use Object.defineProperty to cement object members
            cement = function(obj, prop, val, enumerable) {
                Object.defineProperty(obj, prop, {
                    configurable: false,
                    enumerable: !!enumerable,
                    writable: false,
                    value: val
                });
            };
        } else {
            // Pre-ECMAScript-5 can't cement properties!
            cement = function(obj, prop, val) {
                obj[prop] = val;
            };

        }

        cement(this, "cement", cement);

        // plus a way to cement anything to global
        cement(this, "cementGlobal", function(prop, val, enumerable) {
            cement(global, prop, val, enumerable);
        });

        // now we can cement all other properties, starting with the globals we care about
        function cg(nm) {
            cement(global, nm, global[nm]);
            try { cement(global[nm], "prototype", global[nm].prototype); } catch(ex) {}
        }
        cg("Boolean");
        cg("Number");
        cg("Object");
        cg("String");
        if (Object.defineProperty) cement(Object, "defineProperty", Object.defineProperty);

        // now we cement checkers to each of those
        cement(Boolean, "$$cts$$check", function(val) { return typeof val === "boolean"; });
        cement(Number, "$$cts$$check", function(val) { return typeof val === "number"; });
        cement(String, "$$cts$$check", function(val) { return typeof val === "string"; });
        cement(Function.prototype, "$$cts$$check", function(val) { return val instanceof this || val === null || typeof val === "undefined"; });

        // A union of concrete types, eg !(a | b).
        // We consider !a | !b to be equivalent and reinterpret it as !(a | b).
        cement(this, "UnionType", function() {
            // Copy arguments object as an array:
            this.types = [].slice.call(arguments);
        });
        cement(this.UnionType, "prototype", this.UnionType.prototype); 
        cement(this.UnionType.prototype, "$$cts$$check", function(val) { 
            for (var i = 0; i < this.types.length; i++) {
                var type = this.types[i];
                if (type.$$cts$$check(val)) {
                    return true;
                }
            }
            return false;
        });

        // and a global caster, which checks and returns the value if the check succeeded or an exception otherwise
        cement(this, "cast", function(type, val) {
            if (type.$$cts$$check(val)) return val;
            if (!val) {
                switch (type) {
                    case Boolean: return false;
                    case Number: return 0;
                    case String: return "";
                    default: return null;
                }
            } else {
                switch (type) {
                    case Boolean: return !!val;
                    case Number: return +val;
                    case String: return ""+val;
                }
            }
            throw new Error("Cannot cast value " + val + " to type " + type);
        }, true);

        // because there are so few falsey values, we can do a "half-coercion"
        // of false values. This is useful for the common pattern of using &&
        // for an embedded conditional, e.g.
        // return this.type && getTypeConstructor(this.type)
        cement(Boolean, "$$cts$$falsey", function(val) { if (!val) return false; else return val; });
        cement(Number, "$$cts$$falsey", function(val) { if (!val) return 0; else return val; });
        cement(String, "$$cts$$falsey", function(val) { if (!val) return ""; else return val; });
        cement(Function.prototype, "$$cts$$falsey", function(val) { if (!val) return void 0; else return val; });
        
        // the "protect" function adds a protector for a given type and name to an object
        function protect(type, name, obj, enumerable) {
            var pname = "$$cts$$value$" + name;
            var getter = function() { return this[pname]; };
            var setter = type.$$cts$$setter;
            if (!setter) {
                setter = type.$$cts$$setter = function(val) { this[pname] = $$cts$$runtime.cast(type, val); };
            }

            if (Object.defineProperty) {
                Object.defineProperty(obj, name, {
                    configurable: false,
                    enumerable: (typeof enumerable === "undefined") ? true : !!enumerable,
                    get: getter,
                    set: setter
                });

            } else throw new Error("Cannot protect properties!");
        }
        cement(this, "protect", protect);

        // a way of adding unenumerable properties to an object
        var addUnenum;
        if (Object.defineProperty) {
            addUnenum = function(obj, prop, val) {
                Object.defineProperty(obj, prop, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: val
                });
            };
        } else {
            addUnenum = function(obj, prop, val) {
                obj[prop] = val;
            };
        }
        cement(this, "addUnenum", addUnenum);

        // the "protectAssignment" adds a protector for a given type and name to an object, if one does not
        // already exist.
        cement(this, "protectAssignment", function(type, name, obj, value) {
            var existingSetter = getSetter(obj, name);
            if (existingSetter != null && existingSetter === type.$$cts$$setter) {
                // Just use existingSetter:
                this[name] = obj;
                return;
            }
            if (existingSetter != null) {
                // Incompatible case:
                throw new Error("Cannot reprotect '" + name + "'!");
            }
            // OK, protection needed:
            addUnenum(obj,"$$cts$$value$" + name, value);
            protect(type, name, obj, true);
        });

        function Brand() {}
        cement(Brand, "prototype", Brand.prototype);
        cement(Brand.prototype, "$$cts$$check", function(obj) {
            if (typeof obj !== "object" || typeof obj.$$cts$$brands === "undefined") {
                return false;
            }
            for (var i = 0; i < obj.$$cts$$brands.length; i++) {
                if (this === obj.$$cts$$brands[i]) {
                    return true;
                }
            }
            return false;
        });
        cement(this, "brand", function(brand, obj) {
            if (typeof obj === "undefined") {
                return;
            }
            if (typeof obj.$$cts$$brands === "undefined") {
                addUnenum(obj, "$$cts$$brands", []);
            }
            obj.$$cts$$brands.push(brand);
        });
        

        // Branding is 
        cement(this, "Brand", Brand);

    })();

    runtime.cement(global, "$$cts$$runtime", runtime);
})((typeof window !== "undefined") ? window : (typeof global !== "undefined") ? global : this);
