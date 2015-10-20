// @KnownDefect
function f(x : becomes {a:string} extends {}) {
    x.a = "hey";
    /* @assertType("string") */ x.a;
}
f();
