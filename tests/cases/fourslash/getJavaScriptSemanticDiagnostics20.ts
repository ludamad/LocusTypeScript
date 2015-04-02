/// <reference path="fourslash.ts" />

// @allowNonTsExtensions: true
// @Filename: a.js
//// var v = <string>undefined;

verify.getSemanticDiagnostics(`[
  {
    "message": "'type assertion expressions' can only be used in a .ts file.",
    "start": 9,
    "length": 6,
    "category": "error",
    "code": 8016
  }
]`);