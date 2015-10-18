#!/bin/mocha

declare var require, process, it, describe, after;

var assert = require("assert");
var path = require("path");
var clc = require("cli-color");
require("./cts-runtime");
var {exec,spawn}   = require('child_process');
var fs = require("fs");
var testBundles = {
    ctsEcoop2015: "Features of ConcreteTypeScript as of ECOOP2015", 
    ctsMisc:"Small refinements post ECOOP2015",
    ctsFlowTypes:"Flow types that analyze assignment", 
    ctsFlowTypesRuntime: "Runtime tests for aspects of flow type branding, etc"
};

for (var testBundle of Object.keys(testBundles)) {
    createTestBundle(testBundle);
}

function createTestBundle(testBundle:string) {
    var numberPassedAsserts = 0;
    var numberAsserts = 0;
    describe(testBundles[testBundle], () => {
        after(() => {
            console.log(`Passed assertions inline in ${testBundle}/ files: ${numberPassedAsserts} / ${numberAsserts}`);
        });
        for (var entry of fs.readdirSync(testBundle)) {
            if (entry.match(/\.ts$/)) {
                var file = path.join(testBundle, entry);
                createTestForFileInBundle(file);
            }
        }
    });

    function createTestForFileInBundle(file:string) {
        var fileContent = fs.readFileSync(file, 'utf8');
        var compileFailureExpected = fileContent.indexOf("@TestExpectedToHaveCompileErrors") >= 0;
        var testFailureExpected = fileContent.indexOf("@KnownDefect") >= 0;
        var isRuntimeTest = fileContent.indexOf("@RuntimeTest") >= 0;
        if (isRuntimeTest && compileFailureExpected) {
            throw new Error("Annotation conflict");
        }
        if (isRuntimeTest) {
            var testName = `should run ${file} as a test`;
        } else {
            let prefix = compileFailureExpected ? "shouldnt" : "should";
            var testName = `${prefix} compile ${file}`;
        }
        if (testFailureExpected) testName = `**KNOWN TO FAIL** ${testName}`;
        it(testName, function(doneCallback) {
            this.timeout(20000); // Give a generous 20 seconds for compilation and test running
            function afterCompile() {
                if (isRuntimeTest) {
                   let testModule = './' + file.replace(/\.ts$/, '')
                   let test = require(testModule);
                }
                doneCallback();
            }
            spawnTsc(file, afterCompile, compileFailureExpected);
        });
    }

    function processInlineAssertions(testFile) {
        var outputfileRegex = new RegExp(`${path.basename(testFile)}\\.[a-zA-Z]+\\.output$`);
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
        var tscInstance = spawn('node', ['../built/local/tsc.js', '--module', 'commonjs', file]);
        tscInstance.on('exit', (exitCode) => {
            if (expectedBad) {
                var compiledWithErrors  = (exitCode !== 0);
                assert(compiledWithErrors, "Expected to compile with errors!");
            } else {
                var compiledSuccessfully = (exitCode === 0);
                if (!compiledSuccessfully) console.log(clc.red(`Failed to compile '${file}'`));
                assert(compiledSuccessfully, "Expected to compile successfully!");
            }
            processInlineAssertions(file);
            doneCallback();
        });
    }
}
