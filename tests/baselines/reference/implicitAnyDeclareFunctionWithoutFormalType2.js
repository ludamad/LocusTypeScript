//// [implicitAnyDeclareFunctionWithoutFormalType2.ts]
// generates function fn1(): number;
function fn1() {
    var x: number;
    return x;
}
// generates function fn2(): any;
function fn2(): any {
    var x: any;
    return x;
}
// generates function fn3();
function fn3() {
    var x: any;
    return x;
}


//// [implicitAnyDeclareFunctionWithoutFormalType2.js]
function fn1() {
    var x;
    return x;
}
function fn2() {
    var x;
    return x;
}
function fn3() {
    var x;
    return x;
}


//// [implicitAnyDeclareFunctionWithoutFormalType2.d.ts]
declare function fn1();
declare function fn2();
declare function fn3();
