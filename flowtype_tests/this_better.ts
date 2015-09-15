function Foo() {
    var this : declare Foo;
    this.x = this.y;
}
Foo.prototype.y = 1;


function Baz() {
    var this : declare Baz;
}

function Bar() {
    var this : declare Bar extends Foo;
    this.total = this.x + this.y + this.z;
}
// Do we error if this assignment does not exist?
Bar.prototype = Baz.prototype;

Bar.prototype.z = 2;
