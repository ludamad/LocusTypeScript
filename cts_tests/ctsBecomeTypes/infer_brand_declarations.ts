// @KnownDefect
function becomeFoo(obj : declare Foo extends {}) {
    obj.a = 1;
    return obj;
}

function useBecomeFoo(obj : {}) {
    becomeFoo(obj);
}
function useBecomeFooIndirectly(obj : becomes !Foo extends {}) {
    useBecomeFoo(obj);
}

useBecomeFooIndirectly();
