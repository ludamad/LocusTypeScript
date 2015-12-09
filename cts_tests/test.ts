function addNumbers(a, b) {
    console.log("a + b = ", a + b);
}

var a = 1;
var b:!number = 1;

function evilFunction() {
    b = eval("'1'");
}

evilFunction();
addNumbers(a, b);
