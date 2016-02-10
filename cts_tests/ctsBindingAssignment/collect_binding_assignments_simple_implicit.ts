// @KnownDefect
/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function f(x : {} becomes {a:!string}) {
    x.a := "hey";
    /* @assertType("!string") */ x.a;
    assertType(x, "a", String);
}
f();
