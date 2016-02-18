function addSquareValue(notFooYet: {x: number, y: number} declare HasSquareValue) {
    notFooYet.square = notFooYet.x*notFooYet.x + notFooYet.y*notFooYet.y;
}

let notFooYet = {x: 1, y: 1};
addSquareValue(notFooYet);
/* @assertType("!HasSquareValue") */ notFooYet;
