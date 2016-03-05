// @DontUseAsTest

function Foo(this: declare Foo) {
    this.x = 1;
}

Foo.prototype.method = function() {
    /* @assertType('!Foo') */ this;
    return this.x;
}

// @assertType("!number")
(new Foo().method());

