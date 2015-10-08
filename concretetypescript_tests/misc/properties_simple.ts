function foo() {
    var point : declare Point = {};

    if (true) {
        point.something = 1;
        point.something = "Hey"; // Error: !string not assignable to !number
    } else {
        point.something = "Hey";
    }

    return point;
}

var p = foo();
