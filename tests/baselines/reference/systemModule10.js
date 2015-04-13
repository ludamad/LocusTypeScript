//// [systemModule10.ts]

import n, {x} from 'file1'
import n2 = require('file2');
export {x}
export {x as y}
export {n}
export {n as n1}
export {n2}
export {n2 as n3}

//// [systemModule10.js]
System.register(['file1', 'file2'], function(exports_1) {
    var file1_1, n2;
    return {
        setters:[
            function (v_1) {
                file1_1 = v_1
                exports_1("n", file1_1.default);
                exports_1("n1", file1_1.default);
                exports_1("x", file1_1.x);
                exports_1("y", file1_1.x);
            },
            function (v_1) {
                n2 = v_1
                exports_1("n2", n2);
                exports_1("n3", n2);
            }],
        execute: function() {
        }
    }
});
