//// [decoratorOnClassMethodParameter1.ts]
declare function dec(target: Function, propertyKey: string | symbol, parameterIndex: number): void;

class C {
    method(@dec p: number) {}
}

//// [decoratorOnClassMethodParameter1.js]
var __decorate = this.__decorate || function (decorators, target, key, value) {
    var kind = typeof (arguments.length == 2 ? value = target : value);
    for (var i = decorators.length - 1; i >= 0; --i) {
        var decorator = decorators[i];
        switch (kind) {
            case "function": value = decorator(value) || value; break;
            case "number": decorator(target, key, value); break;
            case "undefined": decorator(target, key); break;
            case "object": value = decorator(target, key, value) || value; break;
        }
    }
    return value;
};
var __metadata = this.__metadata || (typeof Reflect === "object" && Reflect.metadata) || function (metadataKey, metadataValue) { return function() { } };
var C = (function () {
    function C() {
    }
    C.prototype.method = function (p) { };
    __decorate([dec, __metadata('design:type', Number)], C.prototype, "method", 0);
    return C;
})();
