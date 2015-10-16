function MyClass() {
    var this: declare MyClass;
    /*@afterCheck[ThisKeyword]{assertType("!MyClass")}*/
    this;
}

MyClass.prototype.foo = function() { return this; }
MyClass.prototype.foo = function() { return this; } // Should error (at runtime?)
