/// <reference path="fourslash.ts" />

// @allowNonTsExtensions: true
// @Filename: a.js
//// class C<T> { }

verify.getSemanticDiagnostics(`[
  {
    "message": "'type parameter declarations' can only be used in TypeScript.",
    "start": 8,
    "length": 1,
    "category": "error",
    "code": 8004
  }
]`);