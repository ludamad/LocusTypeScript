/* @KnownDefect */

// Should not be a normal emission:
/* @assertNotEmitted[isSourceFile](/Test\.makePoint.*=.*makePoint/)*/
// Search for safe version:
/* @assertEmitted[isSourceFile](/cement.*makePoint.*makePoint/)*/
// Search for direct version:
/* @assertEmitted[isSourceFile](/cement.*cts.*makePoint.*cts.*makePoint/)*/
module Test {
    export function makePoint(x:!number, y:!number) {
        // ...
    }
}
