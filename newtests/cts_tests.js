#!/bin/mocha
var assert = require("assert");
var path = require("path");
var clc = require("cli-color");
var _a = require('child_process'), exec = _a.exec, spawn = _a.spawn;
var fs = require("fs");
var testBundles = { "ctsEcoop2015": "Features of ConcreteTypeScript as of ECOOP2015" };
for (var _i = 0, _b = Object.keys(testBundles); _i < _b.length; _i++) {
    var testBundle = _b[_i];
    var numberPassedAsserts = 0;
    var numberAsserts = 0;
    describe(testBundles[testBundle], function () {
        after(function () {
            console.log("Passed assertions inline in " + testBundle + "/ files: " + numberPassedAsserts + " / " + numberAsserts);
        });
        for (var _i = 0, _a = fs.readdirSync(testBundle); _i < _a.length; _i++) {
            var entry = _a[_i];
            var file = path.join(testBundle, entry);
            if (file.match(/\.ts$/)) {
                createTestForFileInBundle(file);
            }
        }
    });
    function createTestForFileInBundle(file) {
        var fileContent = fs.readFileSync(file, 'utf8');
        var compileFailureExpected = fileContent.match("@TestExpectedToHaveCompileErrors");
        var testFailureExpected = fileContent.match("@KnownDefect");
        var prefix = compileFailureExpected ? "shouldnt" : "should";
        if (testFailureExpected)
            prefix = "**KNOWN TO FAIL** " + prefix;
        it(prefix + " compile " + file, function (doneCallback) {
            spawnTsc(file, doneCallback, compileFailureExpected);
        });
    }
    function processInlineAssertions(testFile) {
        var outputfileRegex = new RegExp(testFile + "\\.[a-zA-Z]+\\.output$");
        var outputFiles = fs.readdirSync(testBundle);
        outputFiles = outputFiles.map(function (s) { return path.join(testBundle, s); });
        outputFiles = outputFiles.filter(function (s) { return s.match(outputfileRegex); });
        for (var _i = 0; _i < outputFiles.length; _i++) {
            var outputFile = outputFiles[_i];
            var content = fs.readFileSync(outputFile, 'utf8');
            for (var _a = 0, _b = content.split('\n'); _a < _b.length; _a++) {
                var line = _b[_a];
                if (line.match(/^(Passes|FAILURE)/)) {
                    numberAsserts++;
                    var passed = line.match(/^Passes/);
                    if (passed) {
                        numberPassedAsserts++;
                        console.log(clc.blackBright(line));
                    }
                    else {
                        console.log(clc.red(line));
                    }
                    assert(passed, line);
                }
            }
        }
    }
    function spawnTsc(file, doneCallback, expectedBad) {
        var tscInstance = spawn('node', ['../../built/local/tsc.js', file]);
        tscInstance.on('exit', function (exitCode) {
            if (expectedBad) {
                var compiledWithErrors = (exitCode !== 0);
                assert(compiledWithErrors, "Expected to compile with errors!");
            }
            else {
                var compiledSuccessfully = (exitCode === 0);
                assert(compiledSuccessfully, "Expected to compile successfully!");
            }
            processInlineAssertions(file);
            doneCallback();
        });
    }
}
