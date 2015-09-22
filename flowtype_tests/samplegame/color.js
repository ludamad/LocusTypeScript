var clc = require("clc-color");
var fs = require('fs');
var content = '';
process.stdin.resume();
process.stdin.on('data', function (buf) { content += buf.toString(); });
process.stdin.on('end', main);
var AT_START = "    at ";
function printLine(rawLine) {
    var line = rawLine.substring(AT_START.length, rawLine.length).trim();
    var _a = line.split(' '), func = _a[0], pathComponents = _a[1];
    pathComponents = pathComponents.substring(1, pathComponents.length - 1);
    var _b = pathComponents.split(':'), filename = _b[0], linenum = _b[1], pos = _b[2];
    var fileContents = fs.readFileSync(filename, "utf8").toString();
    console.log(filename);
}
function main() {
    var lines = content.split("\n");
    for (var _i = 0; _i < lines.length; _i++) {
        var line = lines[_i];
        if (line.indexOf(AT_START) === 0) {
            printLine(line);
        }
        else {
            console.log(line);
        }
    }
}
