// @out: a.js
// @sourcemap: true
// @Filename: a.ts
/*--------------------------------------------------------------------------
Copyright 
---------------------------------------------------------------------------*/

var x = {
    a: 10,
    b: 20
};

// @Filename: b.ts
/*--------------------------------------------------------------------------
Copyright 
---------------------------------------------------------------------------*/

///<reference path="a.ts"/>
var y = x;