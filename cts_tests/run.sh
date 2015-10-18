# Only run the tests through this script, unless you clean up otherwise
rm -f */*.js */*.output
tsc cts_tests.ts && mocha --reporter spec ./cts_tests.js 2>/dev/null
rm -f */*.js */*.output
