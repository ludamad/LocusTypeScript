//// [emptyArrayBindingPatternParameter04.ts]


function f([] = [1,2,3,4]) {
    var x, y, z;
}

//// [emptyArrayBindingPatternParameter04.js]
function f(_a) {
    var _a = [1, 2, 3, 4];
    var x, y, z;
}
