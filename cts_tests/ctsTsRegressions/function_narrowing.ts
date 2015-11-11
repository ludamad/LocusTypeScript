// @KnownDefect

var x : (y : any) => void;
var y : any;

if (typeof y === 'function') {
    x = y;
}
