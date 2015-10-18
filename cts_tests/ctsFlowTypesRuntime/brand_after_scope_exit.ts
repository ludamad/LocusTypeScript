/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

var tester;
{
    let a : declare ScopeExit = {};
    tester = () => assertBranded(a);
    assertNotBranded(a);
    a.b = 0;
}
tester();
