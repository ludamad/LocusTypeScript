// @KnownDefect

var becomeFoo = function(foo: {} declare Foo) {
    foo.x = 1;
}

var a = {};
// @assertEmitted[isStatement](/protectAssignment/)
becomeFoo(a);
