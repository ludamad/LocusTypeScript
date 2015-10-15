// Should output 1

export function Foo() {
    var this: declare FooType;
    this.x = 1;
}

Foo.prototype.foo = function() {
    /*@{assertType !Foo}*/ this;
    console.log(this.x);
}
