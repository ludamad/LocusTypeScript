//// [qualifiedModuleLocals.ts]
module A {

  function b() {}

  export function a(){  A.b();  } // A.b should be an unresolved symbol error

}

A.a();


//// [qualifiedModuleLocals.js]
var A;
(function (A) {
    function b() {
    }
    function a() {
        A.b();
    }
    A.a = a;// A.b should be an unresolved symbol error 
})(A || (A = {}));
A.a();
