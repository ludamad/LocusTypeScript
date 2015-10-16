/* @{assertEmit [wholeFile] "$$cts$$brandTypes ="} */

/* @onEmit{
    if (node === sourceFile) {
        assertEmit(node, "$$cts$$brandTypes =")
    }
}*/

"use strict";

declare var process, branch, describe, it, require;

// For now, for non-concrete types, we simply test that there was no binding.
// The file can be inspected manually, otherwise.

var cts_test = require("./cts_test");
var assert = require("assert");
var BRANCH = parseInt(process.env.BRANCH, 10);

describe("Branding semantics", () => {
    function WheresTheBeef() {
        var a : declare BrandObjectLiteral2 = {b: 0};
        cts_test.assertType(a, "b", Number);
    }

    it("should bind object literal", () => {
        var a : declare BrandObjectLiteral = {b: 0};
        cts_test.assertType(a, "b", Number);
    })
    it("should brand after scope break", () => {
        var leakedA;
        while (true) {
            // Note, we need es6 emit for the 'let' statement to work
            let a : declare BlockExit = {};
            leakedA = a;
            cts_test.assertNotBranded(a);
            a.b = 0;
            break;
        }
        cts_test.assertBranded(leakedA);
    });
    it("should brand before return", () => {
        (function() {
            var a : declare BeforeReturn = {};
            cts_test.assertNotBranded(a);
            a.b = 0;
            return cts_test.assertBranded(a);
        })();
    });
    it("should brand after function exit", () => {
        var tester;
        (function() {
            var a : declare FunctionExit = {};
            tester = () => cts_test.assertBranded(a);
            cts_test.assertNotBranded(a);
            a.b = 0;
        })();
        tester();
    });
    it("should brand after scope exit", () => {
        var tester;
        {
            let a : declare ScopeExit = {};
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
            var this : declare ShouldBrandProto;
            cts_test.assertBranded(this)
        }
        ShouldBrandProto.prototype.x = 1;
        cts_test.assertBranded(ShouldBrandProto.prototype)
        var val : ShouldBrandProto = new ShouldBrandProto();
    });
    it("should check prototype of this", () => {
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

describe("If statement runtime semantics", () => {
    it("branching", () => {
        var a : declare IfBranch = {};
        if (BRANCH) {
            a.b = 1;
            cts_test.assertType(a, "b", [String, Number]);
        } else {
            a.b = "Hello";
            cts_test.assertType(a, "b", [String, Number]);
        }
    });
    it("no else clause ", () => {
        var a : declare IfNoElse = {};
        if (BRANCH) {
            a.b = 1;
            cts_test.assertType(a, "b", null); // non-concrete
        }
    });
    it("no else clause; after assignment", () => {
        var a : declare IfNoElseAfterAssign = {};
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
        var a : declare SwitchAllCasesWrite = {};
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
        var a : declare SwitchOneCaseWrites = {};
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
        var a : declare SwitchAllCasesWriteNoDefault = {};
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

describe("brand type method semantics", () => {
    it("should check this brand on constructor with 'this'", () => {
        function Foo() {
            var this : declare ShouldCheckBrandOnConstructorWithThis;
            this.fine = true;
        }
        var methodFinishedFine = false;
        var exceptionOccurred = false;
        try {
            Foo.call({fine: true});
        } catch (err) {
            exceptionOccurred = true;
        }
        assert.ok(exceptionOccurred)
        assert.ok(!methodFinishedFine)
    });

    it("should check this brand on method with 'this'", () => {
        function Foo() {
            var this : declare ShouldCheckBrandOnMethodWithThis;
            this.fine = true;
        }
        var methodFinishedFine = false;
        var exceptionOccurred = false;
        Foo.prototype.method = function() {
            methodFinishedFine = this.fine;
        }
        try {
            var method = new Foo().method;
            method.call({fine: true});
        } catch (err) {
            exceptionOccurred = true;
        }
        assert.ok(exceptionOccurred)
        assert.ok(!methodFinishedFine)
    });

    it("should not check this brand on method without 'this'", () => {
        function Foo() {
            var somethingElse : declare ShouldNotCheckBrandOnMethodWithoutThis = {};
        }
        var methodFinishedFine = false;
        var exceptionOccurred = false;
        Foo.prototype.method = function() {
            methodFinishedFine = true;
        }
        try {
            var method = new Foo().method;
            method.call({fine: true});
        } catch (err) {
            exceptionOccurred = true;
        }
        assert.ok(!exceptionOccurred)
        assert.ok(methodFinishedFine)
    });
});
