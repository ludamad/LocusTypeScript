// @KnownDefect
// @TestExpectedToHaveCompileErrors

function Foo() {
    var val : declare FooType extends string = "hi";
    val.x = 1;
    return val;
}
