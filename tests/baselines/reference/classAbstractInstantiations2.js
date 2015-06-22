//// [classAbstractInstantiations2.ts]
class A {
    // ...
}

abstract class B {
    foo(): number { return bar(); }
    abstract bar() : number;
}

new B; // error

var BB: typeof B = B;
var AA: typeof A = BB; // error, AA is not of abstract type.
new AA;

function constructB(Factory : typeof B) {
    new Factory; // error -- Factory is of type typeof C
}

var BB = B;
new BB; // error -- BB is of type typeof C

var x : any = C;
new x; // okay -- undefined behavior at runtime

class C extends B { } // error -- not declared abstract

abstract class D extends B { } // okay

class E extends B { // okay -- implements abstract method
    bar() { return 1; }
}

abstract class F extends B {
    abstract foo() : number;
    bar() { return 2; }
}

abstract class G {
    abstract qux(x : number) : string;
    abstract qux() : number;
    y : number;
    abstract quz(x : number, y : string) : boolean; // error -- declarations must be adjacent

    abstract nom() boolean;
    nom(x : number) boolean; // error -- use of modifier abstract must match on all overloads.
}

class H { // error -- not declared abstract
    abstract baz() : number;
}

//// [classAbstractInstantiations2.js]
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var A = (function () {
    function A() {
    }
    return A;
})();
var B = (function () {
    function B() {
    }
    B.prototype.foo = function () { return bar(); };
    return B;
})();
new B; // error
var BB = B;
var AA = BB; // error, AA is not of abstract type.
new AA;
function constructB(Factory) {
    new Factory; // error -- Factory is of type typeof C
}
var BB = B;
new BB; // error -- BB is of type typeof C
var x = C;
new x; // okay -- undefined behavior at runtime
var C = (function (_super) {
    __extends(C, _super);
    function C() {
        _super.apply(this, arguments);
    }
    return C;
})(B); // error -- not declared abstract
var D = (function (_super) {
    __extends(D, _super);
    function D() {
        _super.apply(this, arguments);
    }
    return D;
})(B); // okay
var E = (function (_super) {
    __extends(E, _super);
    function E() {
        _super.apply(this, arguments);
    }
    E.prototype.bar = function () { return 1; };
    return E;
})(B);
var F = (function (_super) {
    __extends(F, _super);
    function F() {
        _super.apply(this, arguments);
    }
    F.prototype.bar = function () { return 2; };
    return F;
})(B);
var G = (function () {
    function G() {
    }
    G.prototype.nom = ;
    G.prototype.nom = ;
    return G;
})();
var H = (function () {
    function H() {
    }
    return H;
})();
