//// [isolatedModulesPlainFile-System.ts]

declare function run(a: number): void;
run(1);


//// [isolatedModulesPlainFile-System.js]
System.register([], function(exports_1) {
    return {
        setters:[],
        execute: function() {
            run(1);
        }
    }
});
