//// [es5-commonjs.ts]

export default class A
{
    constructor ()
    {

    }

    public B()
    {
        return 42;
    }
}


//// [es5-commonjs.js]
var A = (function () {
    function A() {
    }
    A.prototype.B = function () {
        return 42;
    };
    return A;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = A;
