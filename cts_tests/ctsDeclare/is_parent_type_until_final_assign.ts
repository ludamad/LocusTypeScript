/* @TestExpectedToHaveCompileErrors */

function usesFoo(foo:!Foo) {}

function Foo() {
    var foo: declare Foo  = {};
    foo.x = 1;
    /* @assertType("{x: !number} becomes !Foo") */ foo;
    usesFoo(foo);
    foo.y = 1;
    /* @assertType("!Foo") */ foo;
}
