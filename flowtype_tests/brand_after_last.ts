var foo : declare Foo = {};
foo.x = 1;
foo.y = 2;

while (false) {
    foo.sss = 1;
    var bar : Foo = foo;
}

function WhateverDude() {
    var d : declare D = {};
}
