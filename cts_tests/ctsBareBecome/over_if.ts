// @KnownDefect while becomes-analysis is off by default
function addSquareValue(notFooYet: {x: number, y: number} declare) {
    /* @assertType("number") */ (notFooYet.x);
    /* @assertType("number") */ (notFooYet.y);
    notFooYet.square = notFooYet.x*notFooYet.x + notFooYet.y*notFooYet.y;
    /* @assertType("number") */ (notFooYet.x);
    /* @assertType("number") */ (notFooYet.y);
    /* @assertType("!number") */ (notFooYet.square);
}

let notFooYet = {x: 1, y: 1};
if (1 == 1) {
    addSquareValue(notFooYet);
    /* @assertType('{ x: !number; y: !number; } & !<anonymous>') */ notFooYet;
    /* @assertType('!number') */ (notFooYet.x);
}
/* @assertType('{ x: !number; y: !number; }') */ notFooYet;
/* @assertType('!number') */ (notFooYet.x);
