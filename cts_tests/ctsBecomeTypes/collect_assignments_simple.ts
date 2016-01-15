// @KnownDefect
function f(x : {} becomes {a:string}) {
    x.a = "hey";
    /* @assertType("string") */ x.a;
}
f();
