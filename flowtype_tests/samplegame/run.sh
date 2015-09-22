#jake
tsc context.ts
node --stack-trace-limit=1000 ~/sources/typescript-1.6-cts/built/local/tsc.js $1 2>&1 | node context.js
