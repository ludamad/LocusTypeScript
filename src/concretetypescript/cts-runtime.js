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
"use strict";
var runtime;

if (typeof $$cts$$runtime === "undefined") (function(global) {
    runtime = new (function() {
        var cement, getSetter;

        var __hasOwnProperty = Object.hasOwnProperty;
        var hasProperty = function(obj, prop) {
            return __hasOwnProperty.call(obj, prop);
        }
        if (Object.__lookupSetter__) {
            // Deprecated but overall more desirable:
            var __lookupSetter__ = Object.prototype.__lookupSetter__;
            getSetter = function (obj, prop) {
                return __lookupSetter__.call(obj, prop);
            }
        } else {
            var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
            // Standard in ES6 but unlikely to be well optimized:
            getSetter = function (obj, prop) {
                return getOwnPropertyDescriptor(obj, prop).set;
            };
        }
        if (Object.defineProperty) {
            var defineProperty = Object.defineProperty;
            var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
            // use Object.defineProperty to cement object members
            cement = function(obj, prop, val, enumerable) {
                var descriptor  = getOwnPropertyDescriptor(obj, prop);
                var configurable  = (descriptor === undefined) ? true : descriptor.configurable;

                var writable  = configurable ? false : descriptor.writable;
                enumerable  = configurable ? !!enumerable : descriptor.enumerable;

                defineProperty(obj, prop, {
                    configurable: false,
                    enumerable: enumerable,
                    writable: writable,
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

        // A union of concrete types, eg !a | !b.
        // We consider the concreteness of !(a | b) to be and reinterpret it as !a | !b.
        function UnionType() {
            // Copy arguments object as an array:
            this.types = [].slice.call(arguments).sort();
        }
        cement(this, "UnionType", UnionType);
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

        cement(this, "Null", {});
        cement(this.Null, "$$cts$$check", function(val) { 
            return (val === null);
        });
        cement(this.Null, "toString", function(val) {return "null"});

        cement(this, "Undefined", {});
        cement(this.Undefined, "$$cts$$check", function(val) { 
            return (typeof val === "undefined");
        });
        cement(this.Undefined, "toString", function(val) {return "undefined"});

        // and a global caster, which checks and returns the value if the check succeeded or an exception otherwise
        function cast(type, val) {
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
        }
        // A special case for emitting purposes, that takes the value to cast in 'val', but a value to propagate in 'ret'
        function castRet3rd(type, val, ret) {
            cast(type, val);
            return ret;
        }
        cement(this, "cast", cast, true);
        cement(this, "castRet3rd", cast, true);

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
            var setterName ="$$cts$$setter$"+name;
            var getter = function() { return this[pname]; };
            var setter = type[setterName];
            if (!setter) {
                setter = function(val) { this[pname] = $$cts$$runtime.cast(type, val); };
                addUnenum(type, setterName, setter);
                if (!type.$$cts$$type) {
                    addUnenum(setter, "$$cts$$type", type);
                }
            }

            if (Object.defineProperty) {
                Object.defineProperty(obj, name, {
                    configurable: false,
                    enumerable: (typeof enumerable === "undefined") ? true : !!enumerable,
                    get: getter,
                    set:  setter
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

        // TODO: It will be better to canonicalize union types, instead of 'new'ing them each time and needing a deep equals op.
        function typeEquals(type1, type2) {
            if (type1 === type2) return true;
            if (!(type1 instanceof UnionType)) return false;
            if (!(type2 instanceof UnionType)) return false;
            if (type1.types.length !== type2.types.length) return false;
            for (var i = 0; i < type1.types.length; i++) {
                // Theoretically we should use 'typeEquals' here, but we don't have nested unions in practice:
                if (type1.types[i] !== type2.types[i]) {
                    return false;
                }
            }
            return true;
        }

        // the "protectAssignment" adds a protector for a given type and name to an object, if one does not
        // already exist.
        cement(this, "protectAssignment", function(disabled, type, name, obj, value) {
            if (disabled) {
                return value;
            }
            var existingSetter = getSetter(obj, name);
            if (existingSetter != null && typeEquals(existingSetter.$$cts$$type, type)) {
                // Just use existing setter:
                obj[name] = value;
                return;
            }
            if (existingSetter != null) {
                // Incompatible case:
                throw new Error("Cannot reprotect '" + name + "'!");
            }
            // OK, protection needed:
            addUnenum(obj,"$$cts$$value$" + name, value);
            protect(type, name, obj, true);
            return value;
        });
        cement(this, "protectAssignmentThenBrand", function(protectDisabled, type, name, obj, value, 
                    brandDisabled, brandType) {
            if (protectDisabled) {
                this.protectAssignment(false, type, name, obj, value);
            }
            if (!brandDisabled) {
                this.brand(brandType, obj);
            }
            return value;
        });

        cement(this, "protectProtoAssignment", function(disabled, type, protoCheckType, name, obj, value) {
            if (disabled) {
                return value;
            }
            if (!hasProperty(obj, "$$cts$$prototypeFrozen")) {
                addUnenum(obj,"$$cts$$prototypeFrozen", true);
                var prototype = obj.prototype;
                if (typeof protoCheckType !== "undefined") {
                    cast(protoCheckType, prototype);
                }
                cement(obj, "prototype", prototype);
            }
            this.protectAssignment(false, type, name, obj.prototype, value);
        });

        function Brand(brandName) {
            this.brandName = brandName;
        }

        cement(Brand, "prototype", Brand.prototype);
        cement(Brand, "toString", function() {return this.brandName;});
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
            if (typeof obj === "undefined" || obj === null) {
                throw new Error("Attempt to brand undefined/null object!")
            }
            if (typeof obj.$$cts$$brands === "undefined") {
                addUnenum(obj, "$$cts$$brands", [brand]);
            } else {
                for (var i = 0; i < obj.$$cts$$brands.length; i++) {
                    if (obj.$$cts$$brands[i] === brand) {
                        // Alredy has brand, exit
                        return;
                    }
                }
                obj.$$cts$$brands.push(brand);
            }
        });
        

        cement(this, "Brand", Brand);
        cement(this, "brandTypes", {});

    })();

    runtime.cement(global, "$$cts$$runtime", runtime);
})((typeof window !== "undefined") ? window : (typeof global !== "undefined") ? global : this);
