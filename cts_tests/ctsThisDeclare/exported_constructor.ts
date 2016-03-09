export function Foo(this: declare Foo) {
    // Potentially problematic line, triggers recursive analysis:
    this.foo(this);
}

Foo.prototype.foo = function(foo) {
}
