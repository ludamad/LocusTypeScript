class Foo {
}

function makeFoo() {
    return new Foo();
}

function test() : !Foo {
    /*@{assertType !Foo}*/ new Foo;
    var v:!Foo = makeFoo();
    if (1) {
        let t : declare Foop = 2;
        if (2) {
            let t2 : declare Foop2 = 2;
        }
    }
    return v;
}
