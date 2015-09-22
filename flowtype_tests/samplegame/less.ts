
function MyMethod() {
    var test = this.x;
    return 1;
}

var mySig:(this: {})=>number = MyMethod;
