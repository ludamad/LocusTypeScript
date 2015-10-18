/* @KnownDefect */
/* @assertEmitted[isSourceFile](/cement.*Point.*Point/)*/
module Test {
    export class Point {
        constructor(public x:!number, public y:!number) {
        }
    }
}
