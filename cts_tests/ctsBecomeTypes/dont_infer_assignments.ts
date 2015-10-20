// @KnownDefect
function setX(obj : {}) {
    obj.x := 1;
}
function setXIndirectly(obj : becomes {x:!number} extends {}) {
    setX(obj);
    // @assertError[isStatement]('TODO')
    obj.x += 1;

}

setXIndirectly();
