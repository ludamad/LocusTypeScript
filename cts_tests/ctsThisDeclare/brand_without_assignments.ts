import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function Foo(this: declare Foo){}
assertBranded(Foo.prototype)
