// @KnownDefect

// @assertEmitted[isStatement](/protectAssignment/)
var a : declare Foo = {a: 1};
// @assertEmitted[isStatement](/protectAssignment/)
a.b = 1;
/*@assertType("!number")*/ (a.a);
/*@assertType("!number")*/ (a.b);
if (1) {
    a.a = "hey";
    /*@assertType("!string")*/ (a.a);
    a.b = "hey"
    /*@assertType("!string")*/ (a.b);
}
/*@assertType("!string|!number")*/ (a.a);
/*@assertType("!string|!number")*/ (a.b);
