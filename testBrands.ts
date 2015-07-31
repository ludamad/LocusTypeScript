
function makePoint(x: number, y: number) : Point {
    var point : brand Point = {};
    point.x = x;
    point.y = y;
    while (0) {
        point.shouldPass = 0;
    }
    return point;
}

var point : Point = makePoint(1,2);

point.x = 2;          // Passes, correct
point.shouldPass = 0; // Passes, correct
point.x = "Hello";    // Fails,  correct
point.shouldFail = 2; // Fails,  correct

