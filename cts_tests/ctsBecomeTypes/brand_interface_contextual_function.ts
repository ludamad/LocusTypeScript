
type MethodType = (x:number) => void;
brand interface Foo {
    x : number; // Control variable
    method : !MethodType;
}

var foo : declare Foo = {};
foo.x = 1;
foo.method = function (x) {
    /* @assertType("number") */ x;

}

/* @assertType("!Foo") */ foo;
