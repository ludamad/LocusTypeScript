declare var require, process;

let clc = require ("cli-color")
var fs = require('fs');

var readline = require('readline');

readline.createInterface({
  input: process.stdin,
      output: process.stdout,
    terminal: false
}).on('line', printLine);

const AT_START = "    at ";
const CONTEXT = process.env.C || 3;

let nextNumber = 0;

function printErrorLine(rawLine) {
    let line = rawLine.substring(AT_START.length, rawLine.length).trim();
    let [func, pathComponents] = line.split(' ');
    if (!pathComponents) {
        pathComponents = func;
        func = "<unknown>";
    }
    pathComponents = pathComponents.substring(1, pathComponents.length - 1);
    let [filename, linenum, pos] = pathComponents.split(':');
    linenum = parseInt(linenum, 10) - 1;
    var fileContents = fs.readFileSync(filename, "utf8").toString();
    console.log(clc.white(`(${++nextNumber}) `) + clc.white.bold(`${func} +${linenum+1}`));
    var fileLines = fileContents.split('\n')
    for (var i = linenum - CONTEXT; i <= linenum + CONTEXT; i++) {
        if (!fileLines[i]) continue;
        if (i === linenum) 
            console.log(clc.white.bold(fileLines[i]))
        else
        console.log(clc.blue.bold(fileLines[i]))
    }
}

function printLine(line) {
    if (line.indexOf(AT_START) === 0) {
        printErrorLine(line)
    } else {
        console.log(line);
        nextNumber = 0;
    }
}
