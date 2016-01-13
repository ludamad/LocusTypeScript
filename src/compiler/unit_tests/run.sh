mkdir -p built/local
#cp -r ../../../built/local/tsserver.js \
#    ../../../built/local/typescript.js \
#    ../../../built/local/typescriptServices.js \
cp -r    ../../../built/local/lib* \
    built/local
rm -f built/tsc.js
set -e
#cd .. 
#./run.sh
#cd unit_tests
#if (($# < 1)) ; then 
#    echo "Need filename"
#    exit
#fi

if [ test.ts -nt test.js ] ; then
    echo "Old test.js, rebuilding..."
    ../../../bin/tsc --sourceMap test.ts
fi
mocha --grep "$1" --reporter spec test.js 2>&1
#" 2>&1 | node /home/adomurad/sources/node-stack-context/context.js
##rm tmp_harness.js
