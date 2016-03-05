/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

var tester;
{
    let a : declare Foo = {};
    tester = () => assertBranded(a);
    /* @assertType("{} becomes !Foo") */ a;
    assertNotBranded(a);
    a.b = 0;
    /* @assertType("!number") */ (a.b);
}
tester();
