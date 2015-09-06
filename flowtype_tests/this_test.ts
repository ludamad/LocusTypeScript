
function outer() : !Foo2.prototype {
    function Test2() {
        var this : declare Foo2;

        this.x = 1;
    }
    Test2.prototype.test = 1;


    function Test() {
        var this : declare Foo;

        this.x = 1;
    }


    function foop( n : !number ) {
        return 1;
    }
    Test.prototype.test = 1;
    Test.prototype.test = "what";

    console.log(foop(2));
    var foo : !Foo = new Test();
    var test: Foo;
    //var test : Foo = new Test();
    return Test.prototype;
}

