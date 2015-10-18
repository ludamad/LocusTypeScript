
class ClassWithA {
    constructor(public a:!string) {
        // Check that the unsafe/direct version is being used:
        /* @assertEmitted[isStatement](/this.*cts.*myMethod/) */
        this.myMethod();
    }
    myMethod() {
    }
}

