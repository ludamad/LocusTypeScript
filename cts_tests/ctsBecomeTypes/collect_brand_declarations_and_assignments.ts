// @KnownDefect
/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function becomeFoo(obj : {} declare Foo) {
    obj.a = 1;
    return obj;
}

function useBecomeFoo(obj : {} becomes {a:!number, b:number}) {
    becomeFoo(obj);
    /* @assertType("!number") */ (obj.a);
    assertType(obj, "a", Number);
    obj.b = 1;
    /* @assertType("!number") */ (obj.a);
}

useBecomeFoo();
