
class ClassWithA {
    constructor(public a:!string) {
        // Check that the safe version is being used:
        /* @assertEmitted[isStatement](/this\.myMethod/) */
        (<ClassWithA>this).myMethod();
    }
    myMethod() {
    }
}

