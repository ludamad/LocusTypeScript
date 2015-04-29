//// [tests/cases/compiler/systemModule11.ts] ////

//// [file1.ts]

// set of tests cases that checks generation of local storage for exported names


export var x;
export function foo() {}
export * from 'bar';

//// [file2.ts]

var x;
var y;
export {x};
export {y as y1}

export * from 'bar';

//// [file3.ts]

export {x, y as z} from 'a';
export * from 'bar';

//// [file4.ts]

export var x;
export function foo() {}

var z, z1;
export {z, z1 as z2};

export {s, s1 as s2} from 'a'

//// [file5.ts]

function foo() {}
export * from 'a';

//// [file1.js]
// set of tests cases that checks generation of local storage for exported names
System.register(['bar'], function(exports_1) {
    var x;
    function foo() { }
    exports_1("foo", foo);
    var exportedNames_1 = {
        'x': true,
        'foo': true
    };
    function exportStar_1(m) {
        for(var n in m) {
            if (!exportedNames_1.hasOwnProperty(n)) exports_1(n, m[n]);
        }
    }
    return {
        setters:[
            function (_bar_1) {
                exportStar_1(_bar_1);
            }],
        execute: function() {
            exports_1("x", x);
        }
    }
});
//// [file2.js]
System.register(['bar'], function(exports_1) {
    var x, y;
    var exportedNames_1 = {
        'x': true,
        'y1': true
    };
    function exportStar_1(m) {
        for(var n in m) {
            if (!exportedNames_1.hasOwnProperty(n)) exports_1(n, m[n]);
        }
    }
    return {
        setters:[
            function (_bar_1) {
                exportStar_1(_bar_1);
            }],
        execute: function() {
            exports_1("x", x);
            exports_1("y1", y);
        }
    }
});
//// [file3.js]
System.register(['a', 'bar'], function(exports_1) {
    var exportedNames_1 = {
        'x': true,
        'z': true
    };
    function exportStar_1(m) {
        for(var n in m) {
            if (!exportedNames_1.hasOwnProperty(n)) exports_1(n, m[n]);
        }
    }
    return {
        setters:[
            function (_a_1) {
                exports_1("x", _a_1["x"]);
                exports_1("z", _a_1["y"]);
            },
            function (_bar_1) {
                exportStar_1(_bar_1);
            }],
        execute: function() {
        }
    }
});
//// [file4.js]
System.register(['a'], function(exports_1) {
    var x, z, z1;
    function foo() { }
    exports_1("foo", foo);
    return {
        setters:[
            function (_a_1) {
                exports_1("s", _a_1["s"]);
                exports_1("s2", _a_1["s1"]);
            }],
        execute: function() {
            exports_1("x", x);
            exports_1("z", z);
            exports_1("z2", z1);
        }
    }
});
//// [file5.js]
System.register(['a'], function(exports_1) {
    function foo() { }
    function exportStar_1(m) {
        for(var n in m) {
            exports_1(n, m[n]);
        }
    }
    return {
        setters:[
            function (_a_1) {
                exportStar_1(_a_1);
            }],
        execute: function() {
        }
    }
});
