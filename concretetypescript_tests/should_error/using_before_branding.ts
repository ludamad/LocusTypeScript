
function usesFoo(foo:!Foo) {
    
}

function Foo() {
    var foo: declare Foo  = {};
    foo.x = 1;
    usesFoo(foo);
    foo.y = 1;
}
