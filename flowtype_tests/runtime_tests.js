"use strict";
if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}
var BlockExit = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("BlockExit",BlockExit);
var BeforeReturn = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("BeforeReturn",BeforeReturn);
var FunctionExit = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("FunctionExit",FunctionExit);
var ScopeExit = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("ScopeExit",ScopeExit);
var IfBranch = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("IfBranch",IfBranch);
var IfNoElse = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("IfNoElse",IfNoElse);
var IfNoElseAfterAssign = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("IfNoElseAfterAssign",IfNoElseAfterAssign);
var SwitchAllCasesWrite = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("SwitchAllCasesWrite",SwitchAllCasesWrite);
var SwitchOneCaseWrites = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("SwitchOneCaseWrites",SwitchOneCaseWrites);
var SwitchAllCasesWriteNoDefault = new $$cts$$runtime.Brand();
$$cts$$runtime.cementGlobal("SwitchAllCasesWriteNoDefault",SwitchAllCasesWriteNoDefault);"use strict";
// For now, for non-concrete types, we simply test that there was no binding.
// The file can be inspected manually, otherwise.
var cts_test = require("./cts_test");
var BRANCH = parseInt(process.env.BRANCH, 10);
describe("Branding semantics", function () {
    it("should declare after scope break", function () {
        var leakedA;
        while (true) {
            // Note, we need es6 emit for the 'let' statement to work
            let a = {};
            leakedA = a;
            cts_test.assertNotBranded(a);
            $$cts$$runtime.brand(BlockExit, a);
            break;
            $$cts$$runtime.brand(BlockExit, a);
        }
        cts_test.assertBranded(leakedA);
    });
    it("should declare before return", function () {
        (function () {
            var a = {};
            cts_test.assertNotBranded(a);
            $$cts$$runtime.brand(BeforeReturn, a);
            return cts_test.assertBranded(a);
        })();
    });
    it("should declare after function exit", function () {
        var tester;
        (function () {
            var a = {};
            tester = function () { return cts_test.assertBranded(a); };
            cts_test.assertNotBranded(a);$$cts$$runtime.brand(FunctionExit, a);
        })();
        tester();
    });
    it("should declare after scope exit", function () {
        var tester;
        {
            let a = {};
            tester = function () { return cts_test.assertBranded(a); };
            cts_test.assertNotBranded(a);
            $$cts$$runtime.brand(ScopeExit, a);
        }
        tester();
    });
});
describe("If statement runtime semantics", function () {
    it("branching", function () {
        var a = {};
        if (BRANCH) {
            a.b = 1;
            cts_test.assertType(a, "b", [String, Number]);
        }
        else {
            a.b = "Hello";
            cts_test.assertType(a, "b", [String, Number]);
        }$$cts$$runtime.brand(IfBranch, a);
    });
    it("no else clause ", function () {
        var a = {};
        if (BRANCH) {
            a.b = 1;
            cts_test.assertType(a, "b", null); // non-concrete
        }$$cts$$runtime.brand(IfNoElse, a);
    });
    it("no else clause; after assignment", function () {
        var a = {};
        a.b = 1;
        cts_test.assertType(a, "b", [String, Number]);
        if (BRANCH) {
            a.b = "Hello";
            cts_test.assertType(a, "b", [String, Number]);
        }$$cts$$runtime.brand(IfNoElseAfterAssign, a);
    });
});
describe("Switch statement runtime semantics", function () {
    it("all cases write", function () {
        var a = {};
        switch (BRANCH) {
            case 0:
                a.b = 1;
                cts_test.assertType(a, "b", [String, Number]);
                break;
            default:
                a.b = "Hello";
                cts_test.assertType(a, "b", [String, Number]);
                break;
        }$$cts$$runtime.brand(SwitchAllCasesWrite, a);
    });
    it("one case writes", function () {
        var a = {};
        switch (BRANCH) {
            case 0:
                a.b = 1;
                cts_test.assertType(a, "b", [String, Number]);
                break;
            default:
                break;
        }
        cts_test.assertType(a, "b", null); // non-concrete
        $$cts$$runtime.brand(SwitchOneCaseWrites, a);
    });
    it("all cases write; no default", function () {
        var a = {};
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
        $$cts$$runtime.brand(SwitchAllCasesWriteNoDefault, a);
    });
});
