//// [tests/cases/conformance/externalModules/exportAssignDottedName.ts] ////

//// [foo1.ts]
export function x(){
	return true;
}

//// [foo2.ts]
import foo1 = require('./foo1');
export = foo1.x; // Ok


//// [foo1.js]
function x() {
    return true;
}
exports.x = x;
//// [foo2.js]
var foo1 = require('./foo1');
module.exports = foo1.x;
