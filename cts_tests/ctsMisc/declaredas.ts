// @RuntimeTest
import {assert} from "../cts_asserts";

function makeBranded() : !Branded {
    var branded : declare Branded = {};
    branded.x = 1;
    branded.y = 1;
    return branded;
}

// @assertType("!Branded");
var b = makeBranded();
var c = <{}> b;
assert(c declaredas Branded);

