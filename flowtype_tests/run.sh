cd .. ; jake ; cd flowtype_tests
cd error_cases
#for i in *.ts ; do
#    node ../../TypeScript/built/local/tsc.js $@ "$i" > "../output/stdout_$i"
#done
cd ..

# Uses let statement:
node ../built/local/tsc.js -t es6 runtime_tests.ts 
#Fun use-strict hack:
echo -e '0a\n"use strict";\n.\nw' | ed runtime_tests.js
../bin/tsc error_tests.ts 

cp ../src/concretetypescript/*.js .

echo "RUNNING RUNTIME TESTS WITH BRANCH=0"
BRANCH=0 mocha --harmony runtime_tests.js
echo "RUNNING RUNTIME TESTS WITH BRANCH=1"
BRANCH=1 mocha --harmony runtime_tests.js
echo "RUNNING COMPILE ERROR TESTS"
BRANCH=1 mocha --harmony error_tests.js

