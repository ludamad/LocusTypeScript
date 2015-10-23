// @KnownDefect
/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function Foo(foo : declare FooType extends {}) : !FooType {
    foo.x = 1;
    assertBranded(foo);
    return foo;
}
/* @afterCheck{console.log(typeToString(getType()))} */  Foo;

var foo = Foo({});
/*@assertType("!FooType") */ foo;
/*@assertType("!number") */ (foo.x);
