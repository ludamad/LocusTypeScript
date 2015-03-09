//// [computedPropertyNames23_ES6.ts]
class C {
    bar() {
        return 0;
    }
    [
        { [this.bar()]: 1 }[0]
    ]() { }
}

//// [computedPropertyNames23_ES6.js]
var C = (function () {
    function C() {
    }
    C.prototype.bar = function () {
        return 0;
    };
    C.prototype[{
        [this.bar()]: 1
    }[0]] = function () {
    };
    return C;
})();
