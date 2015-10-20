// @KnownDefect
/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function becomeFoo(obj : declare Foo extends {}) {
    obj.a = 1;
    return obj;
}

function useBecomeFoo(obj : becomes !Foo extends {}) {
    becomeFoo(obj);
    /* @assertType("!number") */ obj.a;
    assertType(obj, "a", Number;
}

useBecomeFoo();
