//// [genericOfACloduleType1.ts]
class G<T>{ bar(x: T) { return x; } }
module M {
    export class C { foo() { } }
    export module C {
        export class X {
        }
    }
 
    var g1 = new G<C>();
    g1.bar(null).foo();
}
var g2 = new G<M.C>() // was: error Type reference cannot refer to container 'M.C'.

//// [genericOfACloduleType1.js]
var G = (function () {
    function G() {
    }
    G.prototype.bar = function (x) {
        return x;
    };
    return G;
})();
var M;
(function (M) {
    var C = (function () {
        function C() {
        }
        C.prototype.foo = function () {
        };
        return C;
    })();
    M.C = C;
    (function (C) {
        var X = (function () {
            function X() {
            }
            return X;
        })();
        C.X = X;
    })(M.C || (M.C = {}));
    var C = M.C;
    var g1 = new G();
    g1.bar(null).foo();
})(M || (M = {}));
var g2 = new G();