interface HasA {
    a: string;
}

function f(x : {} becomes HasA) {
    x.a = "hey";
    /* @assertType("string") */ (x.a);
}

var obj = {};
f(obj);
