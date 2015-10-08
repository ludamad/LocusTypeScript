function foo() {
    var this: declare Foo;
}

foo.prototype.test = function(this: !Foo) {
    this.x = 1;
}

var f: () => void = foo.prototype.test;
