
// @RuntimeTest
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

import {Foo, makeFoo} from "./external_declare.inc";

function usesFoo() {
    var foo = makeFoo();
    assertBranded(foo);
    /* @assertType("!Foo"); */ foo;
    /* @assertType("!number"); */ (foo.method());
    assert(foo.method() === 1);
}
usesFoo();
