/// <reference path="fourslash.ts" />

// @allowNonTsExtensions: true
// @Filename: a.js
//// var v: () => number;

verify.getSemanticDiagnostics(`[
  {
    "message": "'types' can only be used in TypeScript.",
    "start": 7,
    "length": 12,
    "category": "error",
    "code": 8010
  }
]`);