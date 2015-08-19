class Foo {
}

function makeFoo() {
    return new Foo();
}

function test() : !Foo {
    var v:!Foo = makeFoo();
    if (1) {
        let t : brand Foop = 2;
        if (2) {
            let t2 : brand Foop2 = 2;
        }
    }
    return v;
}
