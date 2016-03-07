// @KnownDefect
// @TestExpectedToHaveCompileErrors

function Bar(this: declare BarType) {
    this.y = 1;
}

function Foo() {
    var val : declare FooType extends BarType = new Bar();
    val.x = val.y;
    return val;
}
