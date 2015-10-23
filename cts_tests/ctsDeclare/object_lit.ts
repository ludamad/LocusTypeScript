var a : declare Foo = {a: 1};
a.b = 1;
/*@assertType("!number")*/ (a.a);
/*@assertType("!number")*/ (a.b);
if (1) {
    a.a = "hey";
    /*@assertType("!string")*/ (a.a);
    a.b = "hey"
    /*@assertType("!string")*/ (a.b);
}
/*@assertType("!number|!string")*/ (a.a);
/*@assertType("!number|!string")*/ (a.b);
