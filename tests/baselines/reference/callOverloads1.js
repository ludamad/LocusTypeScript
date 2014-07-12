//// [callOverloads1.ts]
class Foo {    
    bar1() { /*WScript.Echo("bar1");*/ }

    constructor(x: any) {
        // WScript.Echo("Constructor function has executed");
    }
}

function Foo(); // error
function F1(s:string);
function F1(a:any) { return a;}

var f1 = new Foo("hey");


f1.bar1();
Foo();

//// [callOverloads1.js]
var Foo = (function () {
    function Foo(x) {
    }
    Foo.prototype.bar1 = function () {
    };
    return Foo;
})();
function F1(a) {
    return a;
}
var f1 = new Foo("hey");
f1.bar1();
Foo();
