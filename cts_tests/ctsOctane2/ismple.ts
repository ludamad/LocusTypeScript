let a: !string|!null = '2';

/* @assertType("!string | !null") */ a;
let str:!string = 'hi';

let obj: declare Obj = {};

type nString = !string | !null;

obj.a = <nString> 'hi';

let b: nString = obj.a;
