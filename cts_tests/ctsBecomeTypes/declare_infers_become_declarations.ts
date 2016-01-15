// @KnownDefect

function setX(obj: {} becomes {x: number}) {
    obj.x = 1;
}

function becomeFoo(obj : {} declare Foo) {
    setX(obj);
    return obj;
}

let foo = becomeFoo();
/* @assertType("number") */ foo.x;

