//// [ES5For-of20.ts]
for (let v of []) {
    let v;
    for (let v of [v]) {
        const v;
    }
}

//// [ES5For-of20.js]
for (var v, _i = 0, _a = []; _i < _a.length; _i++) {
    v = _a[_i];
    var _v;
    for (var _v_1, _i_1 = 0, _a_1 = [_v_1]; _i_1 < _a_1.length; _i_1++) {
        _v_1 = _a_1[_i_1];
        var _v_2;
    }
}
