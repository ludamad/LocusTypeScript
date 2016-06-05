// @KnownDefect until flow analysis is done on arbitrary variables

function addSquareValueNotConcrete(notFooYet: {x: number, y: number} declare HasSquareValue1) {
    notFooYet.square = notFooYet.x*notFooYet.x + notFooYet.y*notFooYet.y;
}

let notFooYet1 = {x: 1, y: 1};
addSquareValueNotConcrete(notFooYet1);
/* @assertType('{ x: !number; y: !number; } & !HasSquareValue1') */ notFooYet1;

function addSquareValueConcrete(notFooYet: {x: !number, y: !number} declare HasSquareValue2) {
    notFooYet.square = notFooYet.x*notFooYet.x + notFooYet.y*notFooYet.y;
}

let notFooYet2 = {x: 1, y: 1};
addSquareValueConcrete(notFooYet2);
/* @assertType('!HasSquareValue2') */ notFooYet2;


