///<reference path="fourslash.ts" />

// @allowNonTsExtensions: true
// @Filename: Foo.js
/////** @/*1*/ */
////var v1;
////
/////** @p/*2*/ */
////var v2;
////
/////** @param /*3*/ */
////var v3;
////
/////** @param { n/*4*/ } bar */
////var v4;
////
/////** @type { n/*5*/ } */
////var v5;

goTo.marker('1');
verify.completionListContains("constructor");
verify.completionListContains("param");
verify.completionListContains("type");

goTo.marker('2');
verify.completionListContains("constructor");
verify.completionListContains("param");
verify.completionListContains("type");

goTo.marker('3');
verify.completionListIsEmpty();

goTo.marker('4');
verify.completionListContains('number');

goTo.marker('5');
verify.completionListContains('number');


