function addSquareValue(notFooYet: {x: number, y: number} declare HasSquareValue) {
    /* @assertType("number") */ (notFooYet.x);
    /* @assertType("number") */ (notFooYet.y);
    notFooYet.square = notFooYet.x*notFooYet.x + notFooYet.y*notFooYet.y;
    /* @assertType("number") */ (notFooYet.x);
    /* @assertType("number") */ (notFooYet.y);
    /* @assertType("!number") */ (notFooYet.square);
}

let notFooYet = {x: 1, y: 1};
addSquareValue(notFooYet);
/* @assertType('{ x: !number; y: !number; } & !HasSquareValue') */ notFooYet;
