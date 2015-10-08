function func1() {
    var this: declare Func1;
    return 1;
}

function func2() {
    var this: declare Func2;
    return 1;
}

var f0 : () => !number = func1;

var f1 : (this:Func1)=> !number = func1;
f1 = func2;
