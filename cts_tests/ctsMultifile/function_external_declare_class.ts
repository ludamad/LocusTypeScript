// @KnownDefect

// @RuntimeTest
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

import {Foo} from "./external_declare_class.inc";

function usesFoo() {
    var foo = new Foo();
    assertBranded(foo);
    /* @assertType("!Foo"); */ foo;
    /* @assertType("!number"); */ (foo.method());
    assert(foo.method() === 1);
}
usesFoo();
