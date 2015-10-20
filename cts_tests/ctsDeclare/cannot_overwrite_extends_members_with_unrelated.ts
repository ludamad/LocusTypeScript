// @KnownDefect
// @TestExpectedToHaveCompileErrors

interface HasA {
    a:number;
}

function Foo() {
    var val : declare FooType extends HasA = {a:1};
    // @assertError[isStatement](/neither.*assignable/);
    val.a = "hey";
    return val;
}
