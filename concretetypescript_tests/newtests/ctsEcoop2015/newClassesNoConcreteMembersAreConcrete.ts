/*@afterEmit[isClassLike]{
    assertEmitted(/\s+cts.*runtime.*cast.*Point;/);
}*/ 
class Point {
    constructor(public x:number, y:number) {
    }
}
// TODO Double check if this should be the case
/*@assert(isConcreteType(getType()), "Class types with no concrete members should be concrete!")*/ 
new Point(1,2);
