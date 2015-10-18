var a : declare Foo = {a: 1};
var test:!number = a.a;
a.b = 1;
if (1) {
    a.a = "hey";
    a.b = "hey"
}
