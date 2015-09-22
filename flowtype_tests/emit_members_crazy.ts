interface Test {
}

function makeGodObject() : !GodObject {
    var godObject : declare GodObject = {};
    godObject.num = 1;
    godObject.strOrNum = Math.random() > .5 ? "string" : 1;
    godObject.strOrInterface = Math.random() > .5 ? "string" : <Test> 1;
    godObject.strOrInterface = 1;
    if (Math.random() > .5) {
        godObject.strOrNum2 = 1;
    }
    var test : number = godObject.strOrNum2;
    return godObject;
}

var go:!GodObject = makeGodObject();
go.num = "string"; // Error
go.strOrNum = "string";
go.strOrNum = 1;
go.strOrNum = {}; // Error
go.strOrInterface = "string";
go.strOrInterface = <Test>"string";
go.strOrNum2 = "string";
go.strOrNum2 = 1;
go.strOrNum2 = {}; // Error
