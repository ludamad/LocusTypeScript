/// <reference path='fourslash.ts' />

// @Filename: indents.ts
/////*0*/
////    /*1*/
////        /*2*/function foo() { }

const noIndentEmptyScaffolding = "/**\n * \n */";
const oneIndentEmptyScaffolding = "/**\n     * \n     */";
const twoIndentEmptyScaffolding = "/**\n         * \n         */";
const noIndentOffset = 7;
const oneIndentOffset = noIndentOffset + 4;
const twoIndentOffset = oneIndentOffset + 4;

goTo.marker("0");
verify.DocCommentScaffolding(noIndentEmptyScaffolding, noIndentOffset);

goTo.marker("1");
verify.DocCommentScaffolding(oneIndentEmptyScaffolding, oneIndentOffset);

goTo.marker("2");
verify.DocCommentScaffolding(twoIndentEmptyScaffolding, twoIndentOffset);