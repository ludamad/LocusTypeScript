function MyClass() {
    var this: declare MyClass;
}

MyClass.prototype.foo = function() { return this; }
MyClass.prototype.foo = function() { return this; } // Should error (at runtime?)
