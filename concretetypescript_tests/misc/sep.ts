class Base {
    constructor(public testItOut:string) {
    }
}


//var test : declare MonkeyPatched = {};
function foo() : !MonkeyPatched {
    var test : declare MonkeyPatched = new Base("ok");
    test.newParam = "Heyo";
    var testString:string = test.testItOut;
    var foo = test;
    return foo;
}

var aa : !null = 1;
//var monkey : !MonkeyPatched = test;
