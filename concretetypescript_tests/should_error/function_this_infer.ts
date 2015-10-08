function Foo() {
    var this : declare Foo;
    this.x = "Beans";
}

Foo.prototype.make = function() {
    return "Canned " + this.y;
}
