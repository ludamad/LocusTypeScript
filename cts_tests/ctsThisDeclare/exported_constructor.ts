export function Foo(this: declare Foo) {
    // Problematic line, triggers recursive analysis:
    this.foo(this);
}

Foo.prototype.foo = function(foo) {
}
