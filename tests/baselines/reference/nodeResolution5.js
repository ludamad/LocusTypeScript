//// [tests/cases/compiler/nodeResolution5.ts] ////

//// [a.d.ts]

declare module "a" {
    var x: number;
}

//// [b.ts]
import y = require("a"); 


//// [b.js]
