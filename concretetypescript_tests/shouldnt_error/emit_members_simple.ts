
type debug_empty = {};

/*@{assertEmit brand Point return obj}*/
function makePoint(x:!number, y:number) {
    var obj:declare Point = {};
    /*@{assertType debug_empty}*/ obj;
    obj.x = x;
    /*@{assertType !number}*/ (obj.x);
    obj.y = y;
    /*@{assertEmit $$cts$$runtime.brand($$cts$$runtime.brandTypes.Point, obj);*/
    /*@{assertEmit return\sobj;}*/
    return obj;
}
