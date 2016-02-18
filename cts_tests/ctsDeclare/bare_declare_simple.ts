// @KnownDefect
var test : declare = {};

test.field = 0;

/* @assertType("!number") */ (test.field);

