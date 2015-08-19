if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var GlobalBrand = new $$cts$$runtime.Brand();
var A1 = new $$cts$$runtime.Brand();
var A2 = new $$cts$$runtime.Brand();
var A3 = new $$cts$$runtime.Brand();
var A4 = new $$cts$$runtime.Brand();
var A5 = new $$cts$$runtime.Brand();
var globalBrand = {};
function f1() {
    var a1 = {};
    $$cts$$runtime.brand(A1, a1);
    return a1;
}
$$cts$$runtime.cementGlobal("f1",f1);
function f2() {
    if (true) {
        var a2 = {};
    }
    $$cts$$runtime.brand(A2, a2);
    return a2;
}
$$cts$$runtime.cementGlobal("f2",f2);
function f3() {
    var test = function () {
        var a3 = {};
        $$cts$$runtime.brand(A3, a3);
        return a3;
    };
    return ($$cts$$runtime.cast(A3,(test())));
}
$$cts$$runtime.cementGlobal("f3",f3);
function f4() {
    for (var a4 = {}; false;) {
        $$cts$$runtime.brand(A4, a4);
        return a4;
    }
}
$$cts$$runtime.cementGlobal("f4",f4);
function f5() {
    for (; true;) {
        var a5 = {};
        break;
    }
    var foo1 = ($$cts$$runtime.cast(A1,(f1())));
    console.log("Foo1 ", foo1);
    var foo2 = ($$cts$$runtime.cast(A2,(f2())));
    console.log("Foo2 ", foo1);
    var foo3 = ($$cts$$runtime.cast(A3,(f3())));
    console.log("Foo3 ", foo1);
    var foo4 = ($$cts$$runtime.cast(A4,(f4())));
    console.log("Foo4 ", foo1);
    $$cts$$runtime.brand(A5, a5);
    return a5;
}
$$cts$$runtime.cementGlobal("f5",f5);
($$cts$$runtime.cast(A5,(f5())));
