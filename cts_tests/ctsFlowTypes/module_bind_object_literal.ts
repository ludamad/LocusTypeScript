/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

module Module {
    export var a : declare Foo = {b: 0};
}
/* @assertType("!Declared") */ (Module.a);
assertType(Module.a, "b", Number);
