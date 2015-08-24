interface IAnything {
}

function makeGodObject() : !GodObject {
    var godObject : brand GodObject = {};
    // num : !number
    godObject.num = 1;
    // strOrNum : !number|!string
    godObject.strOrNum = Math.random() > .5 ? "string" : 1;
    // strOrNum2 : !number|!string
    if (Math.random() > .5) {
        godObject.strOrNum2 = 1;
        var shouldWork : string = godObject.strOrNum2; // Error !string = !number 
    } else {
        godObject.strOrNum2 = "wee";
    }
    // strOrInterface : !string|IAnything
    // Should this degrade to string|IAnything = IAnything?
    godObject.strOrInterface = Math.random() > .5 ? "string" : <IAnything> {};
    return godObject;
}

var go:!GodObject = makeGodObject();
go.num = "string"; // Error !number = !string
go.strOrNum = "string";
go.strOrNum = 1;
go.strOrNum = {}; // Error !number|!string = {}
go.strOrInterface = "string";
go.strOrInterface = <IAnything>"string";
go.strOrNum2 = "string";
go.strOrNum2 = 1;
go.strOrNum2 = {}; // Error !string|IAnything = {}
