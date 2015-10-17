interface HasA {
    a:!string;
}

class ClassWithA {
    constructor(public a:!string) {
    }
}

var hasA:HasA = new ClassWithA("string");

