
abstract class A {}

class B extends A {}

abstract class C extends B {}

new A;
new B;
new C;

var a : A;
var b : B;
var c : C;

a = new B;
b = new B;
c = new B;
