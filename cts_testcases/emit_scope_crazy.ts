var globalBrand : brand GlobalBrand = {};

function f1() : !A1 {
    var a1 : brand A1 = {};

    return a1;
}

function f2() : !A2 {
    if (true) var a2 : brand A2 = {};

    return a2;
}

function f3() : !A3 {
    var test = function() : !A3 {
        var a3 : brand A3 = {};
        return a3;
    }

    return test();
}

function f4() : !A4 {
    for (var a4 : brand A4 = {}; false;) {
        return a4;
    }
}

function f5() : !A5 {
    for (; true;) {
        var a5 : brand A5 = {};
        break;
    }
    var foo1:!A1 = f1();
    console.log("Foo1 ", foo1);
    var foo2:!A2 = f2();
    console.log("Foo2 ", foo1);
    var foo3:!A3 = f3();
    console.log("Foo3 ", foo1);
    var foo4:!A4 = f4();
    console.log("Foo4 ", foo1);
    return a5;
}

f5();
