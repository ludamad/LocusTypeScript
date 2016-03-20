#n -sf ../../src/concretetypescript/cts-runtime.js .
ln -sf ../../src/concretetypescript-v8/cts-runtime.js .
function ctsc() {
    node ../../built/local/tsc.js $@
}
function tsc() {
    node ../../bin/tsc $@
}

for testname in crypto raytrace splay navier-strokes richards ; do
#    echo "Compiling "$testname".ts"
    ctsc "$testname".ts > /dev/null
    echo "----------------------------------------"
    echo "$testname checked `node --allow_natives_syntax "$testname".js`"
    tsc "$testname"-stripped.ts > /dev/null
    echo "$testname unchecked `node "$testname"-stripped.js`"
done
