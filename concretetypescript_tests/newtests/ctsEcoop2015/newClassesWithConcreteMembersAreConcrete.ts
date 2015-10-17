/*@afterEmit[isClassLike]{
    assertEmitted(/\s+cts.*runtime.*cast.*Point;/);
}*/ 
class Point {
    constructor(public x:!number, y:!number) {
    }
}
/*@assert(isConcreteType(getType()), "Class types with concrete members should be concrete!")*/ 
new Point(1,2);
