//// [systemModule4.ts]

export var x = 1;
export var y;

//// [systemModule4.js]
System.register([], function(exports_1) {
    var x, y;
    return {
        setters:[],
        execute: function() {
            exports_1("x", x = 1);
            exports_1("y", y);
        }
    }
});
