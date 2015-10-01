///////////////////////////////////////////////////////////////////////
// BOILERPLATE
///////////////////////////////////////////////////////////////////////

declare var require, it, describe;

var fs = require("fs");
var execSync = require("child_process").execSync;
var assert = require("assert");

function test(testBody, testFunc) {
    // function onCompile(error: Error, stdout, stderr) {
    //     var js = fs.readFileSync("temp.js", "utf8");
    //     var stdoutString = stdout.toString();
    //     console.log(`STDOUT: ${stdoutString} </STDOUT>`);
    // }
    fs.writeFileSync("temp.ts", `
        var a : declare A = {};
        ${testBody}
    `);
    var stdoutString = execSync("./compile.sh").toString();
    var js = fs.readFileSync("temp.js", "utf8");
    describe(`<TEST>\n${testBody}</TEST>`, function() {testFunc(js, stdoutString)});
}

function testForErrors(testBody, errorRegexes) {
    test(testBody, function(js, stdout) {
        console.log(`<STDOUT>${stdout}</STDOUT>`);
        errorRegexes.forEach(function(regex) {
            it('should error(' + regex.toString() + ')', function () {
                assert.ok(stdout.match(regex));
            });
        });
    });
}

///////////////////////////////////////////////////////////////////////
// TESTS
///////////////////////////////////////////////////////////////////////

testForErrors(`
    a.b = 1;
    a.b = "string";
`, [
    /error TS2322: Type '!string' is not assignable to type '!number'/
]);


testForErrors(`
    function test(a:A) {}
    test(a);
`, [
    /error/
]);

