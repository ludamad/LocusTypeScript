/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

// @KnownDefect
function f(x : becomes {a:number|string} extends {}) {
    if (true) x.a := 1;
    else x.a := "hey";
    /* @assertType("!number|!string") */ x.a;
    assertType(x, "a", [Number, String]);
}
f();
