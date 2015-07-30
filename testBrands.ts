
function makePoint(x, y) : Point {
    var point : brand Point = {x: x, y: y};
    return point;
}

function usePoint(x, y) {
    var point : Point = makePoint(1,2);
}
