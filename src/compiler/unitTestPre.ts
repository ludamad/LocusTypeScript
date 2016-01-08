global.ts = ts;
global.Harness = Harness;
require('source-map-support/register'); 

(<any>Error).stackTraceLimit = Infinity;

global.assert = require("chai").assert;
