//// [tests/cases/conformance/internalModules/DeclarationMerging/ModuleAndFunctionWithSameNameAndCommonRoot.ts] ////

//// [module.ts]
module A {
    export module Point {
        export var Origin = { x: 0, y: 0 };
    }
}

//// [function.ts]
module A {
    // duplicate identifier error
    export function Point() {
        return { x: 0, y: 0 };
    }
}

//// [simple.ts]
module B {

    export module Point {
        export var Origin = { x: 0, y: 0 };
    }

    // duplicate identifier error
    export function Point() {
        return { x: 0, y: 0 };
    }
}


//// [module.js]
var A;
(function (A) {
    (function (Point) {
        Point.Origin = { x: 0, y: 0 };
    })(A.Point || (A.Point = {}));
    var Point = A.Point;
})(A || (A = {}));
//// [function.js]
var A;
(function (A) {
    // duplicate identifier error
    function Point() {
        return { x: 0, y: 0 };
    }
    A.Point = Point;
})(A || (A = {}));
//// [simple.js]
var B;
(function (B) {
    (function (Point) {
        Point.Origin = { x: 0, y: 0 };
    })(B.Point || (B.Point = {}));
    var Point = B.Point;
    // duplicate identifier error
    function Point() {
        return { x: 0, y: 0 };
    }
    B.Point = Point;
})(B || (B = {}));
