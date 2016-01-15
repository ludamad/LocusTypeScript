// @KnownDefect
function f(x : becomes {a:number|string}) {
    x.a = "hey";
    if (true) x.a = 1;
    else x.a = "hey";
    /* @assertType("number|string") */ x.a;
}
f();
