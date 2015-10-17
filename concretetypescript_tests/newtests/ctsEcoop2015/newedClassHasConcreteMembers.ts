/*@afterEmit[isClassLike]{
    assertEmitted(/cts.*runtime.*cast.*Point.*this/);
    assertEmitted(/cts.*runtime.*cast.*Number.*x/);
    assertEmitted(/cts.*runtime.*cast.*Number.*y/);
    assertEmitted(/cts.*runtime.*addUnenum.*this.*cts..value.x.*\,.*x/);
    assertEmitted(/cts.*runtime.*addUnenum.*this.*cts..value.y.*\,.*y/);
}*/ 
class Point {
    constructor(public x:!number, public y:!number) {
    }
}
/*@assert(isConcreteType(getType()), "Class types with concrete members should be concrete!")*/ 
new Point(1,2);
