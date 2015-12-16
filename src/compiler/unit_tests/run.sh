set -e
if (($# < 1)) ; then 
    echo "Need filename"
    exit
fi
tsc *.ts
head -n -3 harness.js > tmp_harness.js
echo -e "global.ts = ts;\nglobal.Harness = Harness;\n" >> tmp_harness.js
#node --stack-trace-limit=1000 -e "
node -e "
    require('source-map-support/register'); 
    require('./tmp_harness.js'); 
    require('./$1');
" 2>&1
#" 2>&1 | node /home/adomurad/sources/node-stack-context/context.js
##rm tmp_harness.js
