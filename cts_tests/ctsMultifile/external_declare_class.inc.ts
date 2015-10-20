// @DontUseAsTest

export function Foo(this: declare Foo) {
    this.x = 1;
}

Foo.prototype.method = function() {
    return this.x;
}

// @assertType("!number")
(new Foo().method());

