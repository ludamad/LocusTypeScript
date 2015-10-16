node ../../built/local/tsc.js runtime_tests.ts 
#Fun use-strict hack until fix in compiler:
echo -e '0a\n"use strict";\n.\nw' | ed runtime_tests.js
cp ../../src/concretetypescript/*.js .

echo "RUNNING RUNTIME TESTS WITH BRANCH=0"
BRANCH=0 mocha --harmony runtime_tests.js
#echo "RUNNING RUNTIME TESTS WITH BRANCH=1"
#BRANCH=1 mocha --harmony runtime_tests.js

