// TODO Double check the behaviour here
/* @assertEmitted[isClassLike](/cts.*runtime.*cast.*Point.*this/) */ 
class Point {
    constructor(public x:number, public y:number) {

    }
}
/*@assert(isConcreteType(getType()), "Class types with no concrete members should be concrete!")*/ 
new Point(1,2);
