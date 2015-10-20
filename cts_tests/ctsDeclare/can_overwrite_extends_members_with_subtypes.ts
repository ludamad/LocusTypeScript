// @KnownDefect
// @TestExpectedToHaveCompileErrors

interface HasA {
    a:number;
}

function Foo() {
    var val : declare FooType extends HasA = {a:1};
    val.a = true ? "hey" : 1;
    return val;
}
