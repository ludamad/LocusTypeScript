//// [tests/cases/compiler/doNotEmitTripleSlashComments.ts] ////

//// [file0.ts]


//// [file2.ts]

//// [file1.ts]
/// <reference path="file0.ts" />
/// <reference path="file2.ts" />
/// <amd-dependency path="/js/libs/hgn.js!app/templates/home" name="compiler"/>
var OData: any;

//// [file0.js]
//// [file2.js]
//// [file1.js]
var OData;
