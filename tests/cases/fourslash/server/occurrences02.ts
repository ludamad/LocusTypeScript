/// <reference path="../fourslash.ts"/>

////function [|f|](x: typeof [|f|]) {
////    [|f|]([|f|]);
////}

let ranges = test.ranges();

for (let r of ranges) {
    goTo.position(r.start);
    verify.occurrencesAtPositionCount(ranges.length);

    for (let range of ranges) {
        verify.occurrencesAtPositionContains(range, false);
    }
}