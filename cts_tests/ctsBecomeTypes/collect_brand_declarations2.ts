// @KnownDefect
/* @RuntimeTest */

function becomeFoo(foo:number, obj2 : {} declare Foo1) {
    obj2.a = 1;
    /* @assertType("!Foo1") */ obj2;
    /* @assertType("!number") */ (obj2.a);
    return obj2;
}

function useBecomeFoo(obj : {} declare Foo2) {
    (/*
        @afterCheck[isExpression]{smartPrint(Object.keys(getType()),'type')}
      */ becomeFoo)(2, obj);
    /* @assertType("!number") */ (obj.a);
    obj.b = 1;
    /* @assertType("!Foo2") */ (obj);
    /* @assertType("!number") */ (obj.a);
}
