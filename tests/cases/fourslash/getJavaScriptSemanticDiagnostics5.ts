/// <reference path="fourslash.ts" />

// @allowNonTsExtensions: true
// @Filename: a.js
//// class C implements D { }

verify.getSemanticDiagnostics(`[
  {
    "message": "'implements clauses' can only be used in TypeScript.",
    "start": 8,
    "length": 12,
    "category": "error",
    "code": 8005
  }
]`);