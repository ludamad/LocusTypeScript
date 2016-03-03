
class C {}
module M {
    export var a = 1;
}
function F() {}

var c = C;
/* @assertType("typeof C") */ c;
var m = M;
/* @assertType("typeof M") */ m;
var f = F;
/* @assertType("() => void") */ f;

// Test binding in for loop: 
for (let i = C; false;) {
    /* @assertType("typeof C") */ i;
}

// Test binding in for loop: 
for (let i = M; false;) {
    /* @assertType("typeof M") */ i;
}

// Test binding in for loop: 
for (let i = F; false;) {
    /* @assertType("() => void") */ i;
}

function getC() {
    return C;
}

function getM() {
    return M;
}

function getF() {
    return F;
}

/* @assertType("!() => typeof C") */ getC;
/* @assertType("!() => typeof M") */ getM;
/* @assertType("!() => () => void") */ getF;

// Quick test if calling works with concrete functions in place:
/* @assertType("typeof C")*/ (getC());

