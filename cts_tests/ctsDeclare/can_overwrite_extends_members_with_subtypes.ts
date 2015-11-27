// @TestExpectedToHaveCompileErrors

interface HasA {
    a:number;
}

function Foo() {
    var val : HasA declare FooType = {a:1};
    val.a = true ? "hey" : 1;
    return val;
}
