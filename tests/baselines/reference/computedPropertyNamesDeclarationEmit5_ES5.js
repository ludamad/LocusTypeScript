//// [computedPropertyNamesDeclarationEmit5_ES5.ts]
var v = {
    ["" + ""]: 0,
    ["" + ""]() { },
    get ["" + ""]() { return 0; },
    set ["" + ""](x) { }
}

//// [computedPropertyNamesDeclarationEmit5_ES5.js]
var v = {
    ["" + ""]: 0,
    ["" + ""]: function () {
    },
    get ["" + ""]() {
        return 0;
    },
    set ["" + ""](x) {
    }
};
