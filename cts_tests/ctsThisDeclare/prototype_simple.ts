export function Foo(this: declare Foo; a:!number) {
    /* @assertType('!number') */(this.x);
}

Foo.prototype.x = 1;

