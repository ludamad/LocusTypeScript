"use strict";
if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.BrandObjectLiteral2 = new $$cts$$runtime.Brand('BrandObjectLiteral2');
$$cts$$runtime.brandTypes.BrandObjectLiteral = new $$cts$$runtime.Brand('BrandObjectLiteral');
$$cts$$runtime.brandTypes.BlockExit = new $$cts$$runtime.Brand('BlockExit');
$$cts$$runtime.brandTypes.BeforeReturn = new $$cts$$runtime.Brand('BeforeReturn');
$$cts$$runtime.brandTypes.FunctionExit = new $$cts$$runtime.Brand('FunctionExit');
$$cts$$runtime.brandTypes.ScopeExit = new $$cts$$runtime.Brand('ScopeExit');
$$cts$$runtime.brandTypes.ShouldBrandProto = new $$cts$$runtime.Brand('ShouldBrandProto');
$$cts$$runtime.brandTypes.ShouldBrandProto.prototype = new $$cts$$runtime.Brand();
$$cts$$runtime.brandTypes.ShouldCheckThisProto = new $$cts$$runtime.Brand('ShouldCheckThisProto');
$$cts$$runtime.brandTypes.ShouldCheckThisProto.prototype = new $$cts$$runtime.Brand();
$$cts$$runtime.brandTypes.IfBranch = new $$cts$$runtime.Brand('IfBranch');
$$cts$$runtime.brandTypes.IfNoElse = new $$cts$$runtime.Brand('IfNoElse');
$$cts$$runtime.brandTypes.IfNoElseAfterAssign = new $$cts$$runtime.Brand('IfNoElseAfterAssign');
$$cts$$runtime.brandTypes.SwitchAllCasesWrite = new $$cts$$runtime.Brand('SwitchAllCasesWrite');
$$cts$$runtime.brandTypes.SwitchOneCaseWrites = new $$cts$$runtime.Brand('SwitchOneCaseWrites');
$$cts$$runtime.brandTypes.SwitchAllCasesWriteNoDefault = new $$cts$$runtime.Brand('SwitchAllCasesWriteNoDefault');
$$cts$$runtime.brandTypes.ShouldCheckBrandOnMethodWithThis = new $$cts$$runtime.Brand('ShouldCheckBrandOnMethodWithThis');
$$cts$$runtime.brandTypes.ShouldCheckBrandOnMethodWithThis.prototype = new $$cts$$runtime.Brand();
$$cts$$runtime.brandTypes.ShouldNotCheckBrandOnMethodWithoutThis = new $$cts$$runtime.Brand('ShouldNotCheckBrandOnMethodWithoutThis');
$$cts$$runtime.brandTypes.ShouldNotCheckBrandOnMethodWithoutThis.prototype = new $$cts$$runtime.Brand();
"use strict";
// For now, for non-concrete types, we simply test that there was no binding.
// The file can be inspected manually, otherwise.
var cts_test = require("./cts_test");
var assert = require("assert");
var BRANCH = parseInt(process.env.BRANCH, 10);
describe("Branding semantics", function () {
    function WheresTheBeef() {
        var /*downgraded*/a = {  };
        $$cts$$runtime.protectAssignment(Number, "b", a, 0);$$cts$$runtime.brand($$cts$$runtime.brandTypes.BrandObjectLiteral2, a);
        cts_test.assertType(a, "b", Number);
    }
    it("should bind object literal", function () {
        var /*downgraded*/a = {  };
        $$cts$$runtime.protectAssignment(Number, "b", a, 0);$$cts$$runtime.brand($$cts$$runtime.brandTypes.BrandObjectLiteral, a);
        cts_test.assertType(a, "b", Number);
    });
    it("should brand after scope break", function () {
        var leakedA;
        while (true) {
            // Note, we need es6 emit for the 'let' statement to work
            var /*downgraded*/a = {};
            leakedA = /*downgraded*/a;
            cts_test.assertNotBranded(/*downgraded*/a);
            $$cts$$runtime.protectAssignment(Number, "b", a, 0);;$$cts$$runtime.brand($$cts$$runtime.brandTypes.BlockExit, a);
            $$cts$$runtime.brand($$cts$$runtime.brandTypes.BlockExit, a);
            break;
        }
        cts_test.assertBranded(leakedA);
    });
    it("should brand before return", function () {
        (function () {
            var /*downgraded*/a = {};
            cts_test.assertNotBranded(/*downgraded*/a);
            $$cts$$runtime.protectAssignment(Number, "b", a, 0);;$$cts$$runtime.brand($$cts$$runtime.brandTypes.BeforeReturn, a);
            $$cts$$runtime.brand($$cts$$runtime.brandTypes.BeforeReturn, a);
            return cts_test.assertBranded(a);
        })();
    });
    it("should brand after function exit", function () {
        var tester;
        (function () {
            var /*downgraded*/a = {};
            tester = function () { return cts_test.assertBranded(/*downgraded*/a); };
            cts_test.assertNotBranded(/*downgraded*/a);
            $$cts$$runtime.protectAssignment(Number, "b", a, 0);;$$cts$$runtime.brand($$cts$$runtime.brandTypes.FunctionExit, a);
        })();
        tester();
    });
    it("should brand after scope exit", function () {
        var tester;
        {
            var /*downgraded*/a = {};
            tester = function () { return cts_test.assertBranded(/*downgraded*/a); };
            cts_test.assertNotBranded(/*downgraded*/a);
            $$cts$$runtime.protectAssignment(Number, "b", a, 0);;$$cts$$runtime.brand($$cts$$runtime.brandTypes.ScopeExit, a);
        }
        tester();
    });
});
describe("This branding semantics", function () {
    it("should brand prototype object", function () {
        /*this-branded*/function ShouldBrandProto() {
            $$cts$$runtime.cast($$cts$$runtime.brandTypes.ShouldBrandProto.prototype, Object.getPrototypeOf(this));
            $$cts$$runtime.brand($$cts$$runtime.brandTypes.ShouldBrandProto, this);
            cts_test.assertBranded(this);
        }
        $$cts$$runtime.protectProtoAssignment(Number, undefined, $$cts$$runtime.brandTypes.ShouldBrandProto.prototype, "x", ShouldBrandProto, 1);;
        $$cts$$runtime.brand($$cts$$runtime.brandTypes.ShouldBrandProto.prototype, ShouldBrandProto.prototype);
        cts_test.assertBranded(ShouldBrandProto.prototype);
        var val = new ShouldBrandProto();
    });
    it("should check prototype of this", function () {
        /*this-branded*/function ShouldCheckThisProto() {
            $$cts$$runtime.cast($$cts$$runtime.brandTypes.ShouldCheckThisProto.prototype, Object.getPrototypeOf(this));
            $$cts$$runtime.brand($$cts$$runtime.brandTypes.ShouldCheckThisProto, this);
            cts_test.assertBranded(this);
        }
        $$cts$$runtime.protectProtoAssignment(Number, undefined, $$cts$$runtime.brandTypes.ShouldCheckThisProto.prototype, "x", ShouldCheckThisProto, 1);;
        $$cts$$runtime.brand($$cts$$runtime.brandTypes.ShouldCheckThisProto.prototype, ShouldCheckThisProto.prototype);
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
        var /*downgraded*/a = {};
        if (BRANCH) {
            $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(Number, String)), "b", a, 1);;
            cts_test.assertType(/*downgraded*/a, "b", [String, Number]);
        }
        else {
            $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(Number, String)), "b", a, "Hello");;
            cts_test.assertType(/*downgraded*/a, "b", [String, Number]);
        }$$cts$$runtime.brand($$cts$$runtime.brandTypes.IfBranch, a);
    });
    it("no else clause ", function () {
        var /*downgraded*/a = {};
        if (BRANCH) {
            a.b = 1;
            cts_test.assertType(/*downgraded*/a, "b", null); // non-concrete
        }$$cts$$runtime.brand($$cts$$runtime.brandTypes.IfNoElse, a);
    });
    it("no else clause; after assignment", function () {
        var /*downgraded*/a = {};
        $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "b", a, 1);;
        cts_test.assertType(/*downgraded*/a, "b", [String, Number]);
        if (BRANCH) {
            $$cts$$runtime.protectAssignment((new $$cts$$runtime.UnionType(String, Number)), "b", a, "Hello");;
            cts_test.assertType(/*downgraded*/a, "b", [String, Number]);
        }$$cts$$runtime.brand($$cts$$runtime.brandTypes.IfNoElseAfterAssign, a);
    });
});
describe("Switch statement runtime semantics", function () {
    it("all cases write", function () {
        var /*downgraded*/a = {};
        switch (BRANCH) {
            case 0:
                a.b = 1;
                cts_test.assertType(/*downgraded*/a, "b", [String, Number]);
                break;
            default:
                a.b = "Hello";
                cts_test.assertType(/*downgraded*/a, "b", [String, Number]);
                break;
        }$$cts$$runtime.brand($$cts$$runtime.brandTypes.SwitchAllCasesWrite, a);
    });
    it("one case writes", function () {
        var /*downgraded*/a = {};
        switch (BRANCH) {
            case 0:
                a.b = 1;
                cts_test.assertType(/*downgraded*/a, "b", [String, Number]);
                break;
            default:
                break;
        }$$cts$$runtime.brand($$cts$$runtime.brandTypes.SwitchOneCaseWrites, a);
        cts_test.assertType(a, "b", null); // non-concrete
    });
    it("all cases write; no default", function () {
        var /*downgraded*/a = {};
        switch (BRANCH) {
            case 0:
                a.b = 1;
                break;
            case 1:
                a.b = "Hello";
                break;
        }$$cts$$runtime.brand($$cts$$runtime.brandTypes.SwitchAllCasesWriteNoDefault, a);
        // Default must be accounted for, causing an uncertain write.
        cts_test.assertType(a, "b", null); // non-concrete
    });
});
describe("brand type method semantics", function () {
    it("should check this brand on method with 'this'", function () {
        /*this-branded*/function Foo() {
            $$cts$$runtime.cast($$cts$$runtime.brandTypes.ShouldCheckBrandOnMethodWithThis.prototype, Object.getPrototypeOf(this));
            $$cts$$runtime.protectAssignment(Boolean, "fine", this, true);;$$cts$$runtime.brand($$cts$$runtime.brandTypes.ShouldCheckBrandOnMethodWithThis, this);
        }
        var methodFinishedFine = false;
        var exceptionOccurred = false;
        Foo.prototype.method = function () {
            methodFinishedFine = ($$cts$$runtime.cast(Boolean,(this.fine)));
        };
        $$cts$$runtime.brand($$cts$$runtime.brandTypes.ShouldCheckBrandOnMethodWithThis.prototype, Foo.prototype);
        try {
            var method = new Foo().method;
            method.call({ fine: true });
        }
        catch (err) {
            exceptionOccurred = true;
        }
        assert.ok(exceptionOccurred);
        assert.ok(methodFinishedFine);
    });
    it("should not check this brand on method without 'this'", function () {
        /*this-branded*/function Foo() {
            $$cts$$runtime.cast($$cts$$runtime.brandTypes.ShouldNotCheckBrandOnMethodWithoutThis.prototype, Object.getPrototypeOf(this));
            $$cts$$runtime.brand($$cts$$runtime.brandTypes.ShouldNotCheckBrandOnMethodWithoutThis, this);
        }
        var methodFinishedFine = false;
        var exceptionOccurred = false;
        Foo.prototype.method = function () {
            methodFinishedFine = true;
        };
        $$cts$$runtime.brand($$cts$$runtime.brandTypes.ShouldNotCheckBrandOnMethodWithoutThis.prototype, Foo.prototype);
        try {
            var method = new Foo().method;
            method.call({ fine: true });
        }
        catch (err) {
            exceptionOccurred = true;
        }
        assert.ok(exceptionOccurred);
        assert.ok(methodFinishedFine);
    });
});
