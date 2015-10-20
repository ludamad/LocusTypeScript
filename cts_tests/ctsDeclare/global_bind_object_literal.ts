/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

var a : declare Foo = {b: 0};
/* @assertType("!Foo") */ a;
assertType(a, "b", Number);
