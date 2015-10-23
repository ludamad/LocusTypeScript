interface PointWithCheckedElements {
    x:!number;
    y:!number;
}

interface PointWithUncheckedElements {
    x:number;
    y:number;
}

function usePointCheckedElements(point:PointWithCheckedElements) {
    // @assertEmitted[isStatement](/cts.*cast.*Number.*x/)
    var x = point.x;
    // @assertEmitted[isStatement](/cts.*cast.*Number.*y/)
    var y = point.y;
}

function usePointUncheckedElements(point:PointWithUncheckedElements) {
    // @assertNotEmitted[isStatement](/cts.*cast.*Number.*x/)
    var x = point.x;
    // @assertNotEmitted[isStatement](/cts.*cast.*Number.*y/)
    var y = point.y;
}
