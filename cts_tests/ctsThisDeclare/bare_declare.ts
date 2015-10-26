// Syntax not supported yet.
/* @KnownDefect */

function Foo(this: declare FooType) {
    this.init();
}

Foo.prototype.init = function(this:declare) {
    this.x = 1;
    this.y = 1;
}
