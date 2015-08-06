
function makePoint(x: number, y: number) {
    var point : brand Point = {};
    point.x = x;
    point.y = y;
    point.x = "Hey";
    while (0) {
        point.shouldPass = 0;
        console.log(point.shouldPass);
    }
    function willItPass() {
        point.maybePass = 0;
    }
    return point;
    point.afterReturn = 0;
}

var point = makePoint(1,2);

point.x = 0;          // Passes, correct
point.shouldPass = 0; // Passes, correct
point.x = "0";        // Fails,  correct
point.shouldFail = 0; // Fails,  correct
point.maybePass = 0;  // Passes, not sure

