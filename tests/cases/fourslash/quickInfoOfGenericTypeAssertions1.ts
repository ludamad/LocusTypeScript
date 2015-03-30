/// <reference path='fourslash.ts'/>

////function f<T>(x: T): T { return null; }
////var /*1*/r = <T>(x: T) => x;
////var /*2*/r2 = < <T>(x: T) => T>f;

////var a;
////var /*3*/r3 = < <T>(x: <A>(y: A) => A) => T>a;

goTo.marker('1');
verify.quickInfoIs('var r: <T>(x: T) => T');

goTo.marker('2');
verify.quickInfoIs('var r2: <T>(x: T) => T');

goTo.marker('3');
verify.quickInfoIs('var r3: <T>(x: <A>(y: A) => A) => T');
