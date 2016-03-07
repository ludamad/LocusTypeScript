function Foo(this: declare Foo) {
    this.foo();
}

Foo.prototype.foo = function() {
};

