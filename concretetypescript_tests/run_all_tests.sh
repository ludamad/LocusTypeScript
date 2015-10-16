#!/bin/bash
echo "Running compilation tests..."
rm -f should*/*.js 

TEST_FOLDERS="should_error shouldnt_error should_error_minor shouldnt_error_new_features"
cd results && rm -rf $TEST_FOLDERS && mkdir -p $TEST_FOLDERS && cd ..

tsc="node `pwd`/../built/local/tsc.js"

# Applies a color to a piece of text.
function colorify() {
    local words;
    words=$(cat)
    echo -e "\e[$1m$words\e[0m"
}

function pick_color() {
   if echo $1 | grep 'shouldnt_' > /dev/null ; then
        # Did it fail?
        if [ $2 = 1 ] ; then echo '1;31' ; else echo '0;32' ; fi
   else
        if [ $2 = 1 ] ; then echo '0;32' ; else echo '1;31' ; fi
   fi
}

tests=0
expectedSuccessTests=0
expectedFailureTests=0
unexpectedCompileFailures=0
unexpectedCompileSuccesses=0
failedInlineAssertions=0
for folder in $TEST_FOLDERS ; do
    for file in $folder/*.ts ; do
        rm -f $file.*.output
        ((tests++))
        if echo $folder | grep 'shouldnt_error' > /dev/null ; then
            ((expectedSuccessTests++))
        else
            ((expectedFailureTests++))
        fi
        if $tsc "$file" > "results/$file.result" ; then
            if echo $folder | grep 'should_error' > /dev/null ; then
                echo "'$file' should not have compiled." | colorify '0;31'
                ((unexpectedCompileSuccesses++))
            fi
        else
            if echo $folder | grep 'shouldnt_error' > /dev/null ; then
                echo "'$file' should have compiled." | colorify '0;31'
                ((unexpectedCompileFailures++))
            fi
        fi
        has_problems=no
        for output in "$file".*.output ; do
            if [ -r "$output" ] ; then
                cat "$output"
                if cat "$output" | grep "FAILURE" > /dev/null ; then
                    has_problems=yes
                fi
            fi
        done
        if [ "$has_problems" == yes ] ; then
            echo "'$file' has failed inline assertions (eg /*@afterCheck{...}*/)." | colorify '1;30'
            ((failedInlineAssertions++))
        fi
    done
done

echo "'should compile' failures: $unexpectedCompileFailures / $expectedSuccessTests"
echo "'shouldnt compile' failures: $unexpectedCompileSuccesses / $expectedFailureTests"
echo "Files with failed inline assertions: $failedInlineAssertions / $tests"

echo "--- Running runtime tests ---"
cd unit_tests
./run.sh &> ../results/unit_test_output.result
cat ../results/unit_test_output.result | egrep -i '(passing|failing)'
