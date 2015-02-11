//// [taggedTemplateStringsTypeArgumentInference.ts]


// Generic tag with one parameter
function noParams<T>(n: T) { }
noParams ``;

// Generic tag with parameter which does not use type parameter
function noGenericParams<T>(n: string[]) { }
noGenericParams ``;

// Generic tag with multiple type parameters and only one used in parameter type annotation
function someGenerics1a<T, U>(n: T, m: number) { }
someGenerics1a `${3}`;

function someGenerics1b<T, U>(n: string[], m: U) { }
someGenerics1b `${3}`;

// Generic tag with argument of function type whose parameter is of type parameter type
function someGenerics2a<T>(strs: string[], n: (x: T) => void) { }
someGenerics2a `${(n: string) => n}`;

function someGenerics2b<T, U>(strs: string[], n: (x: T, y: U) => void) { }
someGenerics2b `${ (n: string, x: number) => n }`;

// Generic tag with argument of function type whose parameter is not of type parameter type but body/return type uses type parameter
function someGenerics3<T>(strs: string[], producer: () => T) { }
someGenerics3 `${() => ''}`;
someGenerics3 `${() => undefined}`;
someGenerics3 `${() => 3}`;

// 2 parameter generic tag with argument 1 of type parameter type and argument 2 of function type whose parameter is of type parameter type
function someGenerics4<T, U>(strs: string[], n: T, f: (x: U) => void) { }
someGenerics4 `${4}${ () => null }`;
someGenerics4 `${''}${ () => 3 }`;
someGenerics4 `${ null }${ null }`;

// 2 parameter generic tag with argument 2 of type parameter type and argument 1 of function type whose parameter is of type parameter type
function someGenerics5<U, T>(strs: string[], n: T, f: (x: U) => void) { }
someGenerics5 `${ 4 } ${ () => null }`;
someGenerics5 `${ '' }${ () => 3 }`;
someGenerics5 `${null}${null}`;

// Generic tag with multiple arguments of function types that each have parameters of the same generic type
function someGenerics6<A>(strs: string[], a: (a: A) => A, b: (b: A) => A, c: (c: A) => A) { }
someGenerics6 `${ n => n }${ n => n}${ n => n}`;
someGenerics6 `${ n => n }${ n => n}${ n => n}`;
someGenerics6 `${ (n: number) => n }${ (n: number) => n }${ (n: number) => n }`;

// Generic tag with multiple arguments of function types that each have parameters of different generic type
function someGenerics7<A, B, C>(strs: string[], a: (a: A) => A, b: (b: B) => B, c: (c: C) => C) { }
someGenerics7 `${ n => n }${ n => n }${ n => n }`;
someGenerics7 `${ n => n }${ n => n }${ n => n }`;
someGenerics7 `${(n: number) => n}${ (n: string) => n}${ (n: number) => n}`;

// Generic tag with argument of generic function type
function someGenerics8<T>(strs: string[], n: T): T { return n; }
var x = someGenerics8 `${ someGenerics7 }`;
x `${null}${null}${null}`;

// Generic tag with multiple parameters of generic type passed arguments with no best common type
function someGenerics9<T>(strs: string[], a: T, b: T, c: T): T {
    return null;
}
var a9a = someGenerics9 `${ '' }${ 0 }${ [] }`;
var a9a: {};

// Generic tag with multiple parameters of generic type passed arguments with multiple best common types
interface A91 {
    x: number;
    y?: string;
}
interface A92 {
    x: number;
    z?: Date;
}

var a9e = someGenerics9 `${ undefined }${ { x: 6, z: new Date() } }${ { x: 6, y: '' } }`;
var a9e: {};

// Generic tag with multiple parameters of generic type passed arguments with a single best common type
var a9d = someGenerics9 `${ { x: 3 }}${ { x: 6 }}${ { x: 6 } }`;
var a9d: { x: number; };

// Generic tag with multiple parameters of generic type where one argument is of type 'any'
var anyVar: any;
var a = someGenerics9 `${ 7 }${ anyVar }${ 4 }`;
var a: any;

// Generic tag with multiple parameters of generic type where one argument is [] and the other is not 'any'
var arr = someGenerics9 `${ [] }${ null }${ undefined }`;
var arr: any[];



//// [taggedTemplateStringsTypeArgumentInference.js]
// Generic tag with one parameter
function noParams(n) { }
noParams "";
// Generic tag with parameter which does not use type parameter
function noGenericParams(n) { }
noGenericParams "";
// Generic tag with multiple type parameters and only one used in parameter type annotation
function someGenerics1a(n, m) { }
someGenerics1a "" + 3;
function someGenerics1b(n, m) { }
someGenerics1b "" + 3;
// Generic tag with argument of function type whose parameter is of type parameter type
function someGenerics2a(strs, n) { }
someGenerics2a "" + function (n) { return n; };
function someGenerics2b(strs, n) { }
someGenerics2b "" + function (n, x) { return n; };
// Generic tag with argument of function type whose parameter is not of type parameter type but body/return type uses type parameter
function someGenerics3(strs, producer) { }
someGenerics3 "" + function () { return ''; };
someGenerics3 "" + function () { return undefined; };
someGenerics3 "" + function () { return 3; };
// 2 parameter generic tag with argument 1 of type parameter type and argument 2 of function type whose parameter is of type parameter type
function someGenerics4(strs, n, f) { }
someGenerics4 "" + 4 + function () { return null; };
someGenerics4 "" + '' + function () { return 3; };
someGenerics4 "" + null + null;
// 2 parameter generic tag with argument 2 of type parameter type and argument 1 of function type whose parameter is of type parameter type
function someGenerics5(strs, n, f) { }
someGenerics5 4 + " " + function () { return null; };
someGenerics5 "" + '' + function () { return 3; };
someGenerics5 "" + null + null;
// Generic tag with multiple arguments of function types that each have parameters of the same generic type
function someGenerics6(strs, a, b, c) { }
someGenerics6 "" + function (n) { return n; } + function (n) { return n; } + function (n) { return n; };
someGenerics6 "" + function (n) { return n; } + function (n) { return n; } + function (n) { return n; };
someGenerics6 "" + function (n) { return n; } + function (n) { return n; } + function (n) { return n; };
// Generic tag with multiple arguments of function types that each have parameters of different generic type
function someGenerics7(strs, a, b, c) { }
someGenerics7 "" + function (n) { return n; } + function (n) { return n; } + function (n) { return n; };
someGenerics7 "" + function (n) { return n; } + function (n) { return n; } + function (n) { return n; };
someGenerics7 "" + function (n) { return n; } + function (n) { return n; } + function (n) { return n; };
// Generic tag with argument of generic function type
function someGenerics8(strs, n) {
    return n;
}
var x = someGenerics8 "" + someGenerics7;
x "" + null + null + null;
// Generic tag with multiple parameters of generic type passed arguments with no best common type
function someGenerics9(strs, a, b, c) {
    return null;
}
var a9a = someGenerics9 "" + '' + 0 + [];
var a9a;
var a9e = someGenerics9 "" + undefined + { x: 6, z: new Date() } + { x: 6, y: '' };
var a9e;
// Generic tag with multiple parameters of generic type passed arguments with a single best common type
var a9d = someGenerics9 "" + { x: 3 } + { x: 6 } + { x: 6 };
var a9d;
// Generic tag with multiple parameters of generic type where one argument is of type 'any'
var anyVar;
var a = someGenerics9 "" + 7 + anyVar + 4;
var a;
// Generic tag with multiple parameters of generic type where one argument is [] and the other is not 'any'
var arr = someGenerics9 "" + [] + null + undefined;
var arr;
