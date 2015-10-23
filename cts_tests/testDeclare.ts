function foo(this: declare Foo) {
    /* @assertType("!Foo") */ this;
}
