set -e
#cd .. 
#./run.sh
#cd unit_tests
#if (($# < 1)) ; then 
#    echo "Need filename"
#    exit
#fi
tsc --sourceMap test.ts
mocha --grep "$1" --reporter spec test.js 2>&1
#" 2>&1 | node /home/adomurad/sources/node-stack-context/context.js
##rm tmp_harness.js
