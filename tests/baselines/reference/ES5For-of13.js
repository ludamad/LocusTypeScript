//// [ES5For-of13.ts]
for (let v of []) {
    var x = v;
}

//// [ES5For-of13.js]
for (var v, _i = 0, _a = []; _i < _a.length; _i++) {
    v = _a[_i];
    var x = v;
}
