#!/bin/node

require("./cts-runtime");
var file = process.argv[2]; // First argument
require("./" + file);
