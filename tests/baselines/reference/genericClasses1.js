//// [genericClasses1.ts]
class C<T> {
	public x: T;
}

var v1 = new C<string>();

var y = v1.x; // should be 'string'

//// [genericClasses1.js]
var C = (function () {
    function C() {
    }
    return C;
})();
var v1 = new C();
var y = v1.x;


//// [genericClasses1.d.ts]
