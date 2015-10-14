function Foo(this: declare Foo) {
    this.init();
}

Foo.prototype.init = function(this:declare) {
    this.x = 1;
    this.y = 1;
}
