// @KnownDefect
/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function Foo(foo : declare FooType extends {}) : !FooType {
    /*@assertType("{}") */ foo;
    foo.x = 1;
    /*@assertType("!FooType") */ foo;
    assertBranded(foo);
    return foo;
}

/* @assertType("(foo: !FooType) => !FooType") */ (Foo);

// @assertNotError[isStatement]()
var foo = Foo({});
/*@assertType("!FooType") */ foo;
/*@assertType("!number") */ (foo.x);
