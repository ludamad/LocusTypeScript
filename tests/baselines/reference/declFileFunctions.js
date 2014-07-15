//// [tests/cases/compiler/declFileFunctions.ts] ////

//// [declFileFunctions_0.ts]

/** This comment should appear for foo*/
export function foo() {
}
/** This is comment for function signature*/
export function fooWithParameters(/** this is comment about a*/a: string,
    /** this is comment for b*/
    b: number) {
    var d = a;
}
export function fooWithRestParameters(a: string, ...rests: string[]) {
    return a + rests.join("");
}

export function fooWithOverloads(a: string): string;
export function fooWithOverloads(a: number): number;
export function fooWithOverloads(a: any): any {
    return a;
}

/** This comment should appear for nonExportedFoo*/
function nonExportedFoo() {
}
/** This is comment for function signature*/
function nonExportedFooWithParameters(/** this is comment about a*/a: string,
    /** this is comment for b*/
    b: number) {
    var d = a;
}
function nonExportedFooWithRestParameters(a: string, ...rests: string[]) {
    return a + rests.join("");
}

function nonExportedFooWithOverloads(a: string): string;
function nonExportedFooWithOverloads(a: number): number;
function nonExportedFooWithOverloads(a: any): any {
    return a;
}

//// [declFileFunctions_1.ts]
/** This comment should appear for foo*/
function globalfoo() {
}
/** This is comment for function signature*/
function globalfooWithParameters(/** this is comment about a*/a: string,
    /** this is comment for b*/
    b: number) {
    var d = a;
}
function globalfooWithRestParameters(a: string, ...rests: string[]) {
    return a + rests.join("");
}
function globalfooWithOverloads(a: string): string;
function globalfooWithOverloads(a: number): number;
function globalfooWithOverloads(a: any): any {
    return a;
}

//// [declFileFunctions_0.js]
function foo() {
}
exports.foo = foo;
function fooWithParameters(a, b) {
    var d = a;
}
exports.fooWithParameters = fooWithParameters;
function fooWithRestParameters(a) {
    var rests = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rests[_i - 1] = arguments[_i];
    }
    return a + rests.join("");
}
exports.fooWithRestParameters = fooWithRestParameters;
function fooWithOverloads(a) {
    return a;
}
exports.fooWithOverloads = fooWithOverloads;
function nonExportedFoo() {
}
function nonExportedFooWithParameters(a, b) {
    var d = a;
}
function nonExportedFooWithRestParameters(a) {
    var rests = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rests[_i - 1] = arguments[_i];
    }
    return a + rests.join("");
}
function nonExportedFooWithOverloads(a) {
    return a;
}
//// [declFileFunctions_1.js]
function globalfoo() {
}
function globalfooWithParameters(a, b) {
    var d = a;
}
function globalfooWithRestParameters(a) {
    var rests = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        rests[_i - 1] = arguments[_i];
    }
    return a + rests.join("");
}
function globalfooWithOverloads(a) {
    return a;
}


//// [declFileFunctions_0.d.ts]
export declare function foo();
export declare function fooWithParameters(a, b);
export declare function fooWithRestParameters(a, ...rests);
export declare function fooWithOverloads(a);
export declare function fooWithOverloads(a);
//// [declFileFunctions_1.d.ts]
declare function globalfoo();
declare function globalfooWithParameters(a, b);
declare function globalfooWithRestParameters(a, ...rests);
declare function globalfooWithOverloads(a);
declare function globalfooWithOverloads(a);
