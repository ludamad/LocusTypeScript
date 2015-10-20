/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

// @KnownDefect
function f(x : becomes {a:!string} extends {}) {
    x.a :!string= "hey";
    /* @assertType("!string") */ x.a;
    assertType(x, "a", String);
}
f();
