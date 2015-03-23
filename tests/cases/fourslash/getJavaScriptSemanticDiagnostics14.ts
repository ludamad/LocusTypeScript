/// <reference path="fourslash.ts" />

// @allowNonTsExtensions: true
// @Filename: a.js
//// Foo<number>();

verify.getSemanticDiagnostics(`[
  {
    "message": "'type arguments' can only be used in TypeScript.",
    "start": 4,
    "length": 6,
    "category": "error",
    "code": 8011
  }
]`);