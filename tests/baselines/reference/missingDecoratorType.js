//// [tests/cases/conformance/decorators/missingDecoratorType.ts] ////

//// [a.ts]

interface Object { }
interface Array<T> { }
interface String { }
interface Boolean { }
interface Number { }
interface Function { }
interface RegExp { }
interface IArguments { }

//// [b.ts]
/// <reference path="a.ts" />
declare function dec(t, k, d);

class C {
    @dec
    method() {}
}



//// [a.js]
//// [b.js]
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
/// <reference path="a.ts" />
var C = (function () {
    function C() {
    }
    C.prototype.method = function () { };
    Object.defineProperty(C.prototype, "method",
        __decorate([
            dec
        ], C.prototype, "method", Object.getOwnPropertyDescriptor(C.prototype, "method")));
    return C;
})();
