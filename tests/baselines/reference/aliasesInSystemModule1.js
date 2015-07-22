//// [aliasesInSystemModule1.ts]

import alias = require('foo');
import cls = alias.Class;
export import cls2 = alias.Class;

let x = new alias.Class();
let y = new cls();
let z = new cls2();

module M {
  export import cls = alias.Class;
  let x = new alias.Class();
  let y = new cls(); 
  let z = new cls2();
}
  

//// [aliasesInSystemModule1.js]
System.register(['foo'], function(exports_1) {
    var alias;
    var cls, cls2, x, y, z, M;
    return {
        setters:[
            function (_alias) {
                alias = _alias;
            }],
        execute: function() {
            cls = alias.Class;
            exports_1("cls2", cls2 = alias.Class);
            x = new alias.Class();
            y = new cls();
            z = new cls2();
            (function (M) {
                M.cls = alias.Class;
                var x = new alias.Class();
                var y = new M.cls();
                var z = new cls2();
            })(M || (M = {}));
        }
    }
});
