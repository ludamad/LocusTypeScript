/// <reference path="fourslash.ts"/>

////var x = 1;
////module M {
////    export var x = 2;
////    console.log(/*1*/x); // 2
////}
////module M {
////    console.log(/*2*/x); // 2
////}
////module M {
////    var x = 3;
////    console.log(/*3*/x); // 3
////}

goTo.marker('1');
verify.quickInfoIs("var M.x: number", undefined);

goTo.marker('2');
verify.quickInfoIs("var M.x: number", undefined);

goTo.marker('3');
verify.quickInfoIs("var x: number", undefined);
