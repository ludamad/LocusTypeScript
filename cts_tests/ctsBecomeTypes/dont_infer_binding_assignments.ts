// @KnownDefect
// @TestExpectedToHaveCompileErrors

function setX(obj: {}) {
    obj.x := 1;
}

function becomeFoo(obj : {} declare Foo) {
    setX(obj);
    return obj;
}

let foo = becomeFoo();
/* @assertError[isStatement](/does not exist/) */ foo.x;

