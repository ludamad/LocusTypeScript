// @KnownDefect
function becomeFoo(obj : {} declare Foo) {
    obj.a = 1;
    return obj;
}

function useBecomeFoo(obj : {}) {
    becomeFoo(obj);
}
function useBecomeFooIndirectly(obj : {} becomes !Foo) {
    useBecomeFoo(obj);
}

useBecomeFooIndirectly();
