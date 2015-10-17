/* @TestExpectedToHaveCompileErrors */
interface HasA {
    a:!string;
}

class ClassWithA {
    constructor(public a:string) {
    }
}

/* @assertError[isStatement]("Type 'string' is not assignable to type '!string'"); */
var hasA:HasA = new ClassWithA("string");
