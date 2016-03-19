ln -sf ../../src/concretetypescript/cts-runtime.js .
function ctsc() {
    node ../../built/local/tsc.js $@
}
function tsc() {
    node ../../bin/tsc $@
}

for testname in crypto raytrace splay navier-strokes richards ; do
    echo "Compiling "$testname".ts"
    ctsc "$testname".ts 
    echo "Running "$testname".js"
    node "$testname".js
    echo "Compiling "$testname"-stripped.ts"
    tsc "$testname"-stripped.ts
    echo "Running "$testname".js"
    node "$testname"-stripped.js
done
