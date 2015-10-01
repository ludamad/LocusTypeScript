var Foo = function () {
    function Foo() {
        var this;
        this.x = this.y;
    }
    Foo.prototype.y = 1;
    return Foo;
};
var Bar = function () {
    function Bar() {
        var this;
        this.total = this.x + this.y + this.z;
    }
    // Do we error if this assignment does not exist?
    Bar.prototype.z = 1;
    return Bar;
};
