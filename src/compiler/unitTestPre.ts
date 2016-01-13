global.ts = ts;
global.Harness = Harness;
require('source-map-support/register'); 

(<any>Error).stackTraceLimit = Infinity;
global.Debug = {
    assert(cond, msg) {
        if (!cond) {
            throw new Error(msg || "Assertion failiure");
        }
    }
}

global.assert = require("chai").assert;
