function ctsc() {
    node ../../built/local/tsc.js $@
}
function tsc() {
    node ../../bin/tsc $@
}

for testname in crypto raytrace splay navier-strokes richards ; do
    run "$without_checks"
done
