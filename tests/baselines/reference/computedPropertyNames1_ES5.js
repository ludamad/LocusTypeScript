//// [computedPropertyNames1_ES5.ts]
var v = {
    get [0 + 1]() { return 0 },
    set [0 + 1](v: string) { } //No error
}

//// [computedPropertyNames1_ES5.js]
var v = {
    get [0 + 1]() {
        return 0;
    },
    set [0 + 1](v) {
    } //No error
};
