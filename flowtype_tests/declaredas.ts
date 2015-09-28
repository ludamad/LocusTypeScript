function makeBranded() : !Branded {
    var branded : declare Branded = {};
    return branded;
}

var b = makeBranded();
var c = <any> b;
if (c declaredas Branded) {
   console.log("k")
}
