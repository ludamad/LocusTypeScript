var Foo = function() {
    function Foo() {
        var this : declare Foo;
        this.x = this.y;
    }
    Foo.prototype.y = 1;
    return Foo;
}

var Bar = function() {
    function Bar() {
        var this : declare Bar extends Foo;
        this.total = this.x + this.y + this.z;
    }
    Bar.prototype.z = 1;
    return Bar;
}

