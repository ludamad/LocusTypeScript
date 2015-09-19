"use strict";
"use strict";
// For now, for non-concrete types, we simply test that there was no binding.
// The file can be inspected manually, otherwise.
var cts_test = require("./cts_test");
var assert = require("assert");
var BRANCH = parseInt(process.env.BRANCH, 10);
describe("Branding semantics", () => {
    function WheresTheBeef() {
        var a = BrandObjectLiteral2 = { b: 0 };
        cts_test.assertType(a, "b", Number);
    }
    it("should bind object literal", () => {
        var a = BrandObjectLiteral = { b: 0 };
        cts_test.assertType(a, "b", Number);
    });
    it("should declare after scope break", () => {
        var leakedA;
        while (true) {
            // Note, we need es6 emit for the 'let' statement to work
            let a = BlockExit = {};
            leakedA = a;
            cts_test.assertNotBranded(a);
            a.b = 0;
            break;
        }
        cts_test.assertBranded(leakedA);
    });
    it("should declare before return", () => {
        (function () {
            var a = BeforeReturn = {};
            cts_test.assertNotBranded(a);
            a.b = 0;
            return cts_test.assertBranded(a);
        })();
    });
    it("should declare after function exit", () => {
        var tester;
        (function () {
            var a = FunctionExit = {};
            tester = () => cts_test.assertBranded(a);
            cts_test.assertNotBranded(a);
            a.b = 0;
        })();
        tester();
    });
    it("should declare after scope exit", () => {
        var tester;
        {
            let a = ScopeExit = {};
            tester = () => cts_test.assertBranded(a);
            cts_test.assertNotBranded(a);
            a.b = 0;
        }
        tester();
    });
});
describe("This branding semantics", () => {
    it("should brand prototype object", () => {
        function ShouldBrandProto() {
            var ;
            this;
            declare;
            ShouldBrandProto;
            cts_test.assertBranded(this);
        }
        ShouldBrandProto.prototype.x = 1;
        cts_test.assertBranded(ShouldBrandProto.prototype);
        var val = new ShouldBrandProto();
    });
    it("should check prototype of this", () => {
        function ShouldCheckThisProto() {
            var ;
            this;
            declare;
            ShouldCheckThisProto;
            cts_test.assertBranded(this);
        }
        ShouldCheckThisProto.prototype.x = 1;
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
describe("If statement runtime semantics", () => {
    it("branching", () => {
        var a = IfBranch = {};
        if (BRANCH) {
            a.b = 1;
            cts_test.assertType(a, "b", [String, Number]);
        }
        else {
            a.b = "Hello";
            cts_test.assertType(a, "b", [String, Number]);
        }
    });
    it("no else clause ", () => {
        var a = IfNoElse = {};
        if (BRANCH) {
            a.b = 1;
            cts_test.assertType(a, "b", null); // non-concrete
        }
    });
    it("no else clause; after assignment", () => {
        var a = IfNoElseAfterAssign = {};
        a.b = 1;
        cts_test.assertType(a, "b", [String, Number]);
        if (BRANCH) {
            a.b = "Hello";
            cts_test.assertType(a, "b", [String, Number]);
        }
    });
});
describe("Switch statement runtime semantics", () => {
    it("all cases write", () => {
        var a = SwitchAllCasesWrite = {};
        switch (BRANCH) {
            case 0:
                a.b = 1;
                cts_test.assertType(a, "b", [String, Number]);
                break;
            default:
                a.b = "Hello";
                cts_test.assertType(a, "b", [String, Number]);
                break;
        }
    });
    it("one case writes", () => {
        var a = SwitchOneCaseWrites = {};
        switch (BRANCH) {
            case 0:
                a.b = 1;
                cts_test.assertType(a, "b", [String, Number]);
                break;
            default:
                break;
        }
        cts_test.assertType(a, "b", null); // non-concrete
    });
    it("all cases write; no default", () => {
        var a = SwitchAllCasesWriteNoDefault = {};
        switch (BRANCH) {
            case 0:
                a.b = 1;
                break;
            case 1:
                a.b = "Hello";
                break;
        }
        // Default must be accounted for, causing an uncertain write.
        cts_test.assertType(a, "b", null); // non-concrete
    });
});
