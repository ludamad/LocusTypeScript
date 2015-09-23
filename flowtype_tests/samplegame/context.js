var clc = require("cli-color");
var fs = require('fs');
var readline = require('readline');
readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
}).on('line', printLine);
var AT_START = "    at ";
var CONTEXT = process.env.C || 3;
var nextNumber = 0;
function printErrorLine(rawLine) {
    var line = rawLine.substring(AT_START.length, rawLine.length).trim();
    var _a = line.split(' '), func = _a[0], pathComponents = _a[1];
    if (!pathComponents) {
        pathComponents = func;
        func = "<unknown>";
    }
    pathComponents = pathComponents.substring(1, pathComponents.length - 1);
    var _b = pathComponents.split(':'), filename = _b[0], linenum = _b[1], pos = _b[2];
    if (filename.indexOf("home") === 0)
        filename = '/' + filename; // HACK FIX
    linenum = parseInt(linenum, 10) - 1;
    if (!fs.existsSync(filename)) {
        console.log(rawLine);
        return;
    }
    var fileContents = fs.readFileSync(filename, "utf8").toString();
    console.log(clc.white("(" + ++nextNumber + ") ") + clc.white.bold(func + " +" + (linenum + 1)));
    var fileLines = fileContents.split('\n');
    for (var i = linenum - CONTEXT; i <= linenum + CONTEXT; i++) {
        if (!fileLines[i])
            continue;
        if (i === linenum)
            console.log(clc.white.bold(fileLines[i]));
        else
            console.log(clc.blue.bold(fileLines[i]));
    }
}
function printLine(line) {
    if (line.indexOf(AT_START) === 0) {
        printErrorLine(line);
    }
    else {
        console.log(line);
        nextNumber = 0;
    }
}
