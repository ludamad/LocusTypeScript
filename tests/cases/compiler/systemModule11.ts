// @module: system
// @separateCompilation: true

// set of tests cases that checks generation of local storage for exported names

// @filename: file1.ts

export var x;
export function foo() {}
export * from 'bar';

// @filename: file2.ts

var x;
var y;
export {x};
export {y as y1}

export * from 'bar';

// @filename: file3.ts

export {x, y as z} from 'a';
export * from 'bar';

// @filename: file4.ts

export var x;
export function foo() {}

var z, z1;
export {z, z1 as z2};

export {s, s1 as s2} from 'a'