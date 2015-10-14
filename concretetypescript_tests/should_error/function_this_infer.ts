function Foo() {
    var this : declare Foo;
    this.x = "Beans";
}

Foo.prototype.make = /* @thisType @Foo */ function() {
    return "Canned " + this.y;
}
