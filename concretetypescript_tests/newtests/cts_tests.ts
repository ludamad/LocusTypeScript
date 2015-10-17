#!/bin/mocha

declare var require, process, it, describe, after;

var assert = require("assert");
var path = require("path");
var clc = require("cli-color");
var {exec,spawn}   = require('child_process');
var fs = require("fs");
var testBundles = {"ctsEcoop2015": "Pre-ECOOP2015"};

for (var testBundle of Object.keys(testBundles)) {
    var numberPassedAsserts = 0;
    var numberAsserts = 0;
    describe(testBundles[testBundle], () => {
        after(() => {
            console.log(`Passed assertions inline in ${testBundle}/ files: ${numberPassedAsserts} / ${numberAsserts}`);
        });
        for (var entry of fs.readdirSync(testBundle)) {
            var file = path.join(testBundle, entry);
            if (file.match(/\.ts$/)) {
                createTestForFileInBundle(file);
            }
        }
    });

    function createTestForFileInBundle(file:string) {
        var fileContent = fs.readFileSync(file, 'utf8');
        var compileFailureExpected = fileContent.match("@TestExpectedToHaveCompileErrors");
        let prefix = compileFailureExpected ? "shouldnt" : "should";
        it(`${prefix} compile ${file}`, function(doneCallback) {
            spawnTsc(file, doneCallback, compileFailureExpected);
        });
    }

    function processInlineAssertions(testFile) {
        var outputfileRegex = new RegExp(`${testFile}\\.[a-zA-Z]+\\.output$`);
        var outputFiles = fs.readdirSync(testBundle);
        outputFiles = outputFiles.map(s => path.join(testBundle, s));
        outputFiles = outputFiles.filter(s => s.match(outputfileRegex));
        for (var outputFile of outputFiles) {
            var content = fs.readFileSync(outputFile, 'utf8');
            for (var line of content.split('\n')) {
                if (line.match(/^(Passes|FAILURE)/)) {
                    numberAsserts++;
                    var passed = line.match(/^Passes/);
                    if (passed) {
                        numberPassedAsserts++;
                        console.log(clc.blackBright(line));
                    } else {
                        console.log(clc.red(line));
                    }
                    assert(passed, line);
                }
            }
        }
    }

    function spawnTsc(file, doneCallback, expectedBad) {
        var tscInstance = spawn('node', ['../../built/local/tsc.js', file]);
        tscInstance.on('exit', (exitCode) => {
            if (expectedBad) {
                var compiledWithErrors  = (exitCode !== 0);
                assert(compiledWithErrors, "Expected to compile with errors!");
            } else {
                var compiledSuccessfully = (exitCode === 0);
                assert(compiledSuccessfully, "Expected to compiled successfully!");
            }
            processInlineAssertions(file);
            doneCallback();
        });
    }

}
