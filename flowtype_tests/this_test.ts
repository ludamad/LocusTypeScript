
function outer() : !Foo2.prototype {
    function Test2() {
        var this : declare Foo2;

        this.x = this.y;
    }
    Test2.prototype.y = 2;

    function Test() {
        var this : declare Foo;

        this.x = 1;
    }

    Test.prototype.test = 1;
    Test.prototype.test = "what";

    var foo : !Foo = new Test();
    var test: Foo;
    var foop : Foo.prototype = Test.prototype;
    return Test.prototype;
}

