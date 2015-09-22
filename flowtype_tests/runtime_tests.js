"use strict";
if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.BrandObjectLiteral2 = new $$cts$$runtime.Brand('BrandObjectLiteral2');
$$cts$$brandTypes.BrandObjectLiteral = new $$cts$$runtime.Brand('BrandObjectLiteral');
$$cts$$brandTypes.BlockExit = new $$cts$$runtime.Brand('BlockExit');
$$cts$$brandTypes.BeforeReturn = new $$cts$$runtime.Brand('BeforeReturn');
$$cts$$brandTypes.FunctionExit = new $$cts$$runtime.Brand('FunctionExit');
$$cts$$brandTypes.ScopeExit = new $$cts$$runtime.Brand('ScopeExit');
$$cts$$brandTypes.ShouldBrandProto = new $$cts$$runtime.Brand('ShouldBrandProto');
$$cts$$brandTypes.ShouldBrandProto.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.ShouldCheckThisProto = new $$cts$$runtime.Brand('ShouldCheckThisProto');
$$cts$$brandTypes.ShouldCheckThisProto.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.IfBranch = new $$cts$$runtime.Brand('IfBranch');
$$cts$$brandTypes.IfNoElse = new $$cts$$runtime.Brand('IfNoElse');
$$cts$$brandTypes.IfNoElseAfterAssign = new $$cts$$runtime.Brand('IfNoElseAfterAssign');
$$cts$$brandTypes.SwitchAllCasesWrite = new $$cts$$runtime.Brand('SwitchAllCasesWrite');
$$cts$$brandTypes.SwitchOneCaseWrites = new $$cts$$runtime.Brand('SwitchOneCaseWrites');
$$cts$$brandTypes.SwitchAllCasesWriteNoDefault = new $$cts$$runtime.Brand('SwitchAllCasesWriteNoDefault');
"use strict";
// For now, for non-concrete types, we simply test that there was no binding.
// The file can be inspected manually, otherwise.
var cts_test = require("./cts_test");
var assert = require("assert");
var BRANCH = parseInt(process.env.BRANCH, 10);
describe("Branding semantics", function () {
    function WheresTheBeef() {
        var a = {  };
        $$cts$$runtime.protectAssignment(Number, "b", a, 0);$$cts$$runtime.brand($$cts$$brandTypes.BrandObjectLiteral2, a);
        cts_test.assertType(a, "b", Number);
    }
    it("should bind object literal", function () {
        var a = {  };
        $$cts$$runtime.protectAssignment(Number, "b", a, 0);$$cts$$runtime.brand($$cts$$brandTypes.BrandObjectLiteral, a);
        cts_test.assertType(a, "b", Number);
    });
    it("should brand after scope break", function () {
        var leakedA;
        while (true) {
            // Note, we need es6 emit for the 'let' statement to work
            var a = {};
            leakedA = a;
            cts_test.assertNotBranded(a);
            $$cts$$runtime.protectAssignment(Number, "b", a, 0);;$$cts$$runtime.brand($$cts$$brandTypes.BlockExit, a);
            $$cts$$runtime.brand($$cts$$brandTypes.BlockExit, a);
            break;
        }
        cts_test.assertBranded(leakedA);
    });
    it("should brand before return", function () {
        (function () {
            var a = {};
            cts_test.assertNotBranded(a);
            $$cts$$runtime.protectAssignment(Number, "b", a, 0);;$$cts$$runtime.brand($$cts$$brandTypes.BeforeReturn, a);
            $$cts$$runtime.brand($$cts$$brandTypes.BeforeReturn, a);
            return cts_test.assertBranded(a);
        })();
    });
    it("should brand after function exit", function () {
        var tester;
        (function () {
            var a = {};
            tester = function () { return cts_test.assertBranded(a); };
            cts_test.assertNotBranded(a);
            $$cts$$runtime.protectAssignment(Number, "b", a, 0);;$$cts$$runtime.brand($$cts$$brandTypes.FunctionExit, a);
        })();
        tester();
    });
    it("should brand after scope exit", function () {
        var tester;
        {
            var a = {};
            tester = function () { return cts_test.assertBranded(a); };
            cts_test.assertNotBranded(a);
            $$cts$$runtime.protectAssignment(Number, "b", a, 0);;$$cts$$runtime.brand($$cts$$brandTypes.ScopeExit, a);
        }
        tester();
    });
});
describe("This branding semantics", function () {
    it("should brand prototype object", function () {
        function ShouldBrandProto() {
            $$cts$$runtime.cast($$cts$$brandTypes.ShouldBrandProto.prototype, Object.getPrototypeOf(this));
            $$cts$$runtime.brand($$cts$$brandTypes.ShouldBrandProto, this);
            cts_test.assertBranded(this);
        }
        $$cts$$runtime.protectProtoAssignment(Number, undefined, $$cts$$brandTypes.ShouldBrandProto.prototype, "x", ShouldBrandProto, 1);;
        $$cts$$runtime.brand($$cts$$brandTypes.ShouldBrandProto.prototype, ShouldBrandProto.prototype);
        cts_test.assertBranded(ShouldBrandProto.prototype);
        var val = new ShouldBrandProto();
    });
    it("should check prototype of this", function () {
        function ShouldCheckThisProto() {
            $$cts$$runtime.cast($$cts$$brandTypes.ShouldCheckThisProto.prototype, Object.getPrototypeOf(this));
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
describe("If statement runtime semantics", function () {
    it("branching", function () {
        var a = {};
        if (BRANCH) {
            $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(Number, String)), "b", a, 1);;
            cts_test.assertType(a, "b", [String, Number]);
        }
        else {
            $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(Number, String)), "b", a, "Hello");;
            cts_test.assertType(a, "b", [String, Number]);
        }$$cts$$runtime.brand($$cts$$brandTypes.IfBranch, a);
    });
    it("no else clause ", function () {
        var a = {};
        if (BRANCH) {
            a.$$cts$$value$b = 1;
            cts_test.assertType(a, "b", null); // non-concrete
        }$$cts$$runtime.brand($$cts$$brandTypes.IfNoElse, a);
    });
    it("no else clause; after assignment", function () {
        var a = {};
        $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "b", a, 1);;
        cts_test.assertType(a, "b", [String, Number]);
        if (BRANCH) {
            $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "b", a, "Hello");;
            cts_test.assertType(a, "b", [String, Number]);
        }$$cts$$runtime.brand($$cts$$brandTypes.IfNoElseAfterAssign, a);
    });
});
describe("Switch statement runtime semantics", function () {
    it("all cases write", function () {
        var a = {};
        switch (BRANCH) {
            case 0:
                a.$$cts$$value$b = 1;
                cts_test.assertType(a, "b", [String, Number]);
                break;
            default:
                a.$$cts$$value$b = "Hello";
                cts_test.assertType(a, "b", [String, Number]);
                break;
        }$$cts$$runtime.brand($$cts$$brandTypes.SwitchAllCasesWrite, a);
    });
    it("one case writes", function () {
        var a = {};
        switch (BRANCH) {
            case 0:
                a.$$cts$$value$b = 1;
                cts_test.assertType(a, "b", [String, Number]);
                break;
            default:
                break;
        }$$cts$$runtime.brand($$cts$$brandTypes.SwitchOneCaseWrites, a);
        cts_test.assertType(a, "b", null); // non-concrete
    });
    it("all cases write; no default", function () {
        var a = {};
        switch (BRANCH) {
            case 0:
                a.$$cts$$value$b = 1;
                break;
            case 1:
                a.$$cts$$value$b = "Hello";
                break;
        }$$cts$$runtime.brand($$cts$$brandTypes.SwitchAllCasesWriteNoDefault, a);
        // Default must be accounted for, causing an uncertain write.
        cts_test.assertType(a, "b", null); // non-concrete
    });
});
