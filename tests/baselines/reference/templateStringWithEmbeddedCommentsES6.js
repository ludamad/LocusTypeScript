//// [templateStringWithEmbeddedCommentsES6.ts]
`head${ // single line comment
10
}
middle${
/* Multi-
 * line
 * comment
 */
 20
 // closing comment
}
tail`;

//// [templateStringWithEmbeddedCommentsES6.js]
"head" + 10 + "\nmiddle" + 20 + "\ntail";
