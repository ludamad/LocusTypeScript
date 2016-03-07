
class C {}
module M {
    export var a = 1;
}
function F() {}

/* @assertType("!typeof C") */ C;
/* @assertType("!typeof M") */ M;
/* @assertType("!() => void") */ F;
/* @assertType("!() => void") */ (function(){});

