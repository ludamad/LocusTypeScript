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
        var shouldntWork : string = godObject.strOrNum2; // Error !string = !number 
    } else {
        godObject.strOrNum2 = "wee";
    }
    // notConcreteNum : number
    if (Math.random() > .5) {
        godObject.notConcreteNum = 1;
    }
    // strOrNum3: !number|string -> number|string
    godObject.strOrNum3 =  Math.random() > .5 ? <string>"string" : <number>1;

    // strOrInterface : !string|IAnything -> string|IAnything -> IAnything
    godObject.strOrInterface = Math.random() > .5 ? "string" : <IAnything> {};
    return godObject;
}

var go:!GodObject = makeGodObject();
go.num = "string"; // Error !number = !string
go.strOrNum = "string";
go.strOrNum = 1;
go.strOrNum = {}; // Error !number|!string = {}
go.strOrInterface = "string";
go.strOrNum2 = "string";
go.strOrNum2 = 1;
(<any>go).strOrNum2 = {}; // Runtime error
go.strOrNum2 = {}; // Error !number|!string = {}
go.strOrNum3 = "string";
go.strOrNum3 = 1;
go.strOrNum3 = {}; // Error number|string = {}
go.notConcreteNum = "string"; // Error number = !string

