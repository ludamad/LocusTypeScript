//// [classAbstractManyKeywords.ts]
export default abstract class A {}
export abstract class B {}
default abstract class C {}
import abstract class D {}

//// [classAbstractManyKeywords.js]
var A = (function () {
    function A() {
    }
    return A;
})();
var B = (function () {
    function B() {
    }
    return B;
})();
exports.B = B;
var C = (function () {
    function C() {
    }
    return C;
})();
var D = (function () {
    function D() {
    }
    return D;
})();
