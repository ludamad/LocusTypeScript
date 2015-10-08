function func1() {
    var this: number;
    return 1;
}

function func2() {
    var this: string;
    return 1;
}

var f1 : (this:number)=> !number = func1;
f1 = func2;
