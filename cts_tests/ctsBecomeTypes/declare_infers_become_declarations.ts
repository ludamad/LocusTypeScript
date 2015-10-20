// @KnownDefect

function setX(obj: becomes {x: number} extends {}) {
    obj.x = 1;
}

function becomeFoo(obj : declare Foo extends {}) {
    setX(obj);
    return obj;
}

let foo = becomeFoo();
/* @assertType("number") */ foo.x;

