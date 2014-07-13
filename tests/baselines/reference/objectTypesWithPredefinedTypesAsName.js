//// [objectTypesWithPredefinedTypesAsName.ts]
// it is an error to use a predefined type as a type name

class any { }

class number { }

class boolean { }
class bool { } // not a predefined type anymore

class string { }




//// [objectTypesWithPredefinedTypesAsName.js]
var any = (function () {
    function any() {
    }
    return any;
})();
var number = (function () {
    function number() {
    }
    return number;
})();
var boolean = (function () {
    function boolean() {
    }
    return boolean;
})();
var bool = (function () {
    function bool() {
    }
    return bool;
})();
var string = (function () {
    function string() {
    }
    return string;
})();
