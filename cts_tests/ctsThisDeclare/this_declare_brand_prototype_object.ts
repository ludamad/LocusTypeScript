/* @RuntimeTest */
import {assert, assertNotBranded, assertBranded, assertType, assertFails} from "../cts_asserts";

function ShouldBrandProto(this: declare ShouldBrandProto) {
    assertBranded(this)
}
ShouldBrandProto.prototype.x = 1;
assertBranded(ShouldBrandProto.prototype)
var val : ShouldBrandProto = new ShouldBrandProto();
