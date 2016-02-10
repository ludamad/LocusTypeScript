// @KnownDefect
function f(x : {} becomes {a: string} ) {
    x.a = "hey";
    /* @assertType("string") */ (x.a);
}

var obj = {};
f(obj);
