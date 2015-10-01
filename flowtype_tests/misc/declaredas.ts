function makeBranded() : !Branded {
    var branded : declare Branded = {};
    branded.x = 1;
    branded.y = 1;
    return branded;
}

var b = makeBranded();
var c = <{}> b;
if (c declaredas Branded) {
   console.log(c.x)
}
