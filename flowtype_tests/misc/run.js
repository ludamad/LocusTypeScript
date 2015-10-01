if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.ShouldCheckThisProto = new $$cts$$runtime.Brand('ShouldCheckThisProto');
$$cts$$brandTypes.ShouldCheckThisProto.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.ThisShouldBeTheSequel = new $$cts$$runtime.Brand('ThisShouldBeTheSequel');
$$cts$$brandTypes.ThisShouldBeTheSequel.prototype = new $$cts$$runtime.Brand();
"use strict";
// For now, for non-concrete types, we simply test that there was no binding.
// The file can be inspected manually, otherwise.
var cts_test = require("./cts_test");
var assert = require("assert");
var BRANCH = parseInt(process.env.BRANCH, 10);
describe("??", function () {
    it("should fail", function () {
        function ShouldCheckThisProto() {
            $$cts$$runtime.cast($$cts$$brandTypes.ShouldCheckThisProto.prototype, this.prototype);
            $$cts$$runtime.brand($$cts$$brandTypes.ShouldCheckThisProto, this);
            cts_test.assertBranded(this);
        }
        $$cts$$runtime.protectProtoAssignment(Number, undefined, $$cts$$brandTypes.ShouldCheckThisProto.prototype, "x", ShouldCheckThisProto, 1);;
        $$cts$$runtime.brand($$cts$$brandTypes.ShouldCheckThisProto.prototype, ShouldCheckThisProto.prototype);
        var failedLikeShould = true;
        try {
            ShouldCheckThisProto.call({});
            failedLikeShould = false;
        }
        catch (err) {
            // Should error
            console.log("EXPECTED ERROR:");
            console.log(err);
            cts_test.assertBranded(ShouldCheckThisProto.prototype);
        }
        assert.ok(failedLikeShould);
    });
});
function ThisShouldBeTheSequel() {
    $$cts$$runtime.cast($$cts$$brandTypes.ThisShouldBeTheSequel.prototype, this.prototype);
    $$cts$$runtime.brand($$cts$$brandTypes.ThisShouldBeTheSequel, this);
    cts_test.assertBranded(this);
}
$$cts$$runtime.cementGlobal("ThisShouldBeTheSequel",ThisShouldBeTheSequel);
$$cts$$runtime.protectProtoAssignment(Number, undefined, $$cts$$brandTypes.ThisShouldBeTheSequel.prototype, "x", ThisShouldBeTheSequel, 1);;
$$cts$$runtime.brand($$cts$$brandTypes.ThisShouldBeTheSequel.prototype, ThisShouldBeTheSequel.prototype);
