#!/bin/bash
echo "Running 'should compile' tests..."
rm -f */*.js 

TEST_FOLDERS="should_error shouldnt_error should_error_minor shouldnt_error_new_features"
cd results && rm -rf $TEST_FOLDERS && mkdir -p $TEST_FOLDERS && cd ..

tsc="node $HOME/repos/concretetypescript1.6/built/local/tsc.js"

# Applies a color to a piece of text.
function colorify() {
    local words;
    words=$(cat)
    echo -e "\e[$1m$words\e[0m"
}

function pick_color() {
   if echo $1 | grep 'shouldnt' > /dev/null ; then
        # Did it fail?
        if [ $2 = 1 ] ; then echo '1;31' ; else echo '0;32' ; fi
   else
        if [ $2 = 1 ] ; then echo '0;32' ; else echo '1;31' ; fi
   fi
}

for folder in $TEST_FOLDERS ; do
    for file in $folder/*.ts ; do
        if $tsc "$file" > "results/$file.result" ; then
            echo "'$file' compiled successfully." | colorify `pick_color $folder 0`
        else
            echo "'$file' has errors." | colorify `pick_color $folder 1`
        fi
    done
done
