"use strict";

declare var process, branch, describe, it, require;

// For now, for non-concrete types, we simply test that there was no binding.
// The file can be inspected manually, otherwise.

var cts_test = require("./cts_test");
var assert = require("assert");
var BRANCH = parseInt(process.env.BRANCH, 10);

describe("??", () => {
    it("should fail", () => {
        function ShouldCheckThisProto() {
            var this : declare ShouldCheckThisProto;
            cts_test.assertBranded(this)
        }
        ShouldCheckThisProto.prototype.x = 1;
        var failedLikeShould = true;
        try {
            ShouldCheckThisProto.call({});
            failedLikeShould = false;
        } catch (err) {
            // Should error
            console.log("EXPECTED ERROR:")
            console.log(err)
            cts_test.assertBranded(ShouldCheckThisProto.prototype)
        }
        assert.ok(failedLikeShould)
    });
})


function ThisShouldBeTheSequel() {
    var this : declare ThisShouldBeTheSequel;
    cts_test.assertBranded(this)
}
ThisShouldBeTheSequel.prototype.x = 1;
