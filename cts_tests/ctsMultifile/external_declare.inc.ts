// @DontUseAsTest

export function makeFoo() {
    var foo: declare Foo = {};
    foo.x = 1;
    foo.method = function () {
        return this.x;
    }
    return foo;
}

