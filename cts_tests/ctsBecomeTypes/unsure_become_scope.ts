// @TestExpectedToHaveCompileErrors

brand interface HasANumber {
    a:!number
}

function f(x : {} declare HasANumber) {
    x.a = 1;
    /* @assertType("!number") */ (x.a);
    /* @assertType("!HasANumber") */ x;
    // @assertError[isStatement](/.*/)
    x.otherAssignment = true;
}

f({});
