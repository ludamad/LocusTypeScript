// @TestExpectedToHaveCompileErrors

interface ConcreteInterface {
    myString: !string;
}

interface LikeInterface {
    myString: string;
}

var concreteInterface:ConcreteInterface = {myString: "string"};
var likeInterface:LikeInterface         = {myString: "string"};

// @assertError[isStatement](/string.*string/)
concreteInterface = likeInterface;
// @assertNotError[isStatement]()
likeInterface = concreteInterface;
