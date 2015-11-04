# Only run the tests through this script, unless you clean up otherwise
rm -f */*.js */*.output
tsc cts_tests.ts && CTS_TEST=1 mocha --reporter spec $@ ./cts_tests.js
rm -f */*.js */*.output
