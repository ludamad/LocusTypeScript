//// [assignmentCompatWithGenericCallSignaturesWithOptionalParameters.ts]
// call signatures in derived types must have the same or fewer optional parameters as the target for assignment

module ClassTypeParam {
    class Base<T> {
        a: () => T;
        a2: (x?: T) => T;
        a3: (x: T) => T;
        a4: (x: T, y?: T) => T;
        a5: (x?: T, y?: T) => T;

        init = () => {
            this.a = () => null; // ok, same T of required params
            this.a = (x?: T) => null; // ok, same T of required params
            this.a = (x: T) => null; // error, too many required params

            this.a2 = () => null; // ok, same T of required params
            this.a2 = (x?: T) => null; // ok, same T of required params
            this.a2 = (x: T) => null; // ok, same number of params

            this.a3 = () => null; // ok, fewer required params
            this.a3 = (x?: T) => null; // ok, fewer required params
            this.a3 = (x: T) => null; // ok, same T of required params
            this.a3 = (x: T, y: T) => null;  // error, too many required params

            this.a4 = () => null; // ok, fewer required params
            this.a4 = (x?: T, y?: T) => null; // ok, fewer required params
            this.a4 = (x: T) => null; // ok, same T of required params
            this.a4 = (x: T, y: T) => null;  // ok, same number of params


            this.a5 = () => null; // ok, fewer required params
            this.a5 = (x?: T, y?: T) => null; // ok, fewer required params
            this.a5 = (x: T) => null; // ok, all present params match
            this.a5 = (x: T, y: T) => null;  // ok, same number of params
        }
    }
}

module GenericSignaturesInvalid {

    class Base2 {
        a: <T>() => T;
        a2: <T>(x?: T) => T;
        a3: <T>(x: T) => T;
        a4: <T>(x: T, y?: T) => T;
        a5: <T>(x?: T, y?: T) => T;
    }

    class Target<T> {
        a: () => T;
        a2: (x?: T) => T;
        a3: (x: T) => T;
        a4: (x: T, y?: T) => T;
        a5: (x?: T, y?: T) => T;
    }


    function foo<T>() {
        var b: Base2;
        var t: Target<T>;

        // all errors
        b.a = t.a;
        b.a = t.a2;
        b.a = t.a3;
        b.a = t.a4;
        b.a = t.a5;

        b.a2 = t.a;
        b.a2 = t.a2;
        b.a2 = t.a3;
        b.a2 = t.a4;
        b.a2 = t.a5;

        b.a3 = t.a;
        b.a3 = t.a2;
        b.a3 = t.a3;
        b.a3 = t.a4;
        b.a3 = t.a5;

        b.a4 = t.a;
        b.a4 = t.a2;
        b.a4 = t.a3;
        b.a4 = t.a4;
        b.a4 = t.a5;

        b.a5 = t.a;
        b.a5 = t.a2;
        b.a5 = t.a3;
        b.a5 = t.a4;
        b.a5 = t.a5;
    }
}

module GenericSignaturesValid {

    class Base2 {
        a: <T>() => T;
        a2: <T>(x?: T) => T;
        a3: <T>(x: T) => T;
        a4: <T>(x: T, y?: T) => T;
        a5: <T>(x?: T, y?: T) => T;

        init = () => {
            this.a = <T>() => null; // ok, same T of required params
            this.a = <T>(x?: T) => null; // ok, same T of required params
            this.a = <T>(x: T) => null; // error, too many required params

            this.a2 = <T>() => null; // ok, same T of required params
            this.a2 = <T>(x?: T) => null; // ok, same T of required params
            this.a2 = <T>(x: T) => null; // ok, same number of params

            this.a3 = <T>() => null; // ok, fewer required params
            this.a3 = <T>(x?: T) => null; // ok, fewer required params
            this.a3 = <T>(x: T) => null; // ok, same T of required params
            this.a3 = <T>(x: T, y: T) => null;  // error, too many required params

            this.a4 = <T>() => null; // ok, fewer required params
            this.a4 = <T>(x?: T, y?: T) => null; // ok, fewer required params
            this.a4 = <T>(x: T) => null; // ok, same T of required params
            this.a4 = <T>(x: T, y: T) => null;  // ok, same number of params


            this.a5 = <T>() => null; // ok, fewer required params
            this.a5 = <T>(x?: T, y?: T) => null; // ok, fewer required params
            this.a5 = <T>(x: T) => null; // ok, all present params match
            this.a5 = <T>(x: T, y: T) => null;  // ok, same number of params
        }
    }
}

//// [assignmentCompatWithGenericCallSignaturesWithOptionalParameters.js]
// call signatures in derived types must have the same or fewer optional parameters as the target for assignment
var ClassTypeParam;
(function (ClassTypeParam) {
    var Base = (function () {
        function Base() {
            var _this = this;
            this.init = function () {
                _this.a = function () { return null; };
                _this.a = function (x) { return null; };
                _this.a = function (x) { return null; };
                _this.a2 = function () { return null; };
                _this.a2 = function (x) { return null; };
                _this.a2 = function (x) { return null; };
                _this.a3 = function () { return null; };
                _this.a3 = function (x) { return null; };
                _this.a3 = function (x) { return null; };
                _this.a3 = function (x, y) { return null; };
                _this.a4 = function () { return null; };
                _this.a4 = function (x, y) { return null; };
                _this.a4 = function (x) { return null; };
                _this.a4 = function (x, y) { return null; };
                _this.a5 = function () { return null; };
                _this.a5 = function (x, y) { return null; };
                _this.a5 = function (x) { return null; };
                _this.a5 = function (x, y) { return null; };
            };
        }
        return Base;
    })();
})(ClassTypeParam || (ClassTypeParam = {}));
var GenericSignaturesInvalid;
(function (GenericSignaturesInvalid) {
    var Base2 = (function () {
        function Base2() {
        }
        return Base2;
    })();
    var Target = (function () {
        function Target() {
        }
        return Target;
    })();
    function foo() {
        var b;
        var t;
        b.a = t.a;
        b.a = t.a2;
        b.a = t.a3;
        b.a = t.a4;
        b.a = t.a5;
        b.a2 = t.a;
        b.a2 = t.a2;
        b.a2 = t.a3;
        b.a2 = t.a4;
        b.a2 = t.a5;
        b.a3 = t.a;
        b.a3 = t.a2;
        b.a3 = t.a3;
        b.a3 = t.a4;
        b.a3 = t.a5;
        b.a4 = t.a;
        b.a4 = t.a2;
        b.a4 = t.a3;
        b.a4 = t.a4;
        b.a4 = t.a5;
        b.a5 = t.a;
        b.a5 = t.a2;
        b.a5 = t.a3;
        b.a5 = t.a4;
        b.a5 = t.a5;
    }
})(GenericSignaturesInvalid || (GenericSignaturesInvalid = {}));
var GenericSignaturesValid;
(function (GenericSignaturesValid) {
    var Base2 = (function () {
        function Base2() {
            var _this = this;
            this.init = function () {
                _this.a = function () { return null; };
                _this.a = function (x) { return null; };
                _this.a = function (x) { return null; };
                _this.a2 = function () { return null; };
                _this.a2 = function (x) { return null; };
                _this.a2 = function (x) { return null; };
                _this.a3 = function () { return null; };
                _this.a3 = function (x) { return null; };
                _this.a3 = function (x) { return null; };
                _this.a3 = function (x, y) { return null; };
                _this.a4 = function () { return null; };
                _this.a4 = function (x, y) { return null; };
                _this.a4 = function (x) { return null; };
                _this.a4 = function (x, y) { return null; };
                _this.a5 = function () { return null; };
                _this.a5 = function (x, y) { return null; };
                _this.a5 = function (x) { return null; };
                _this.a5 = function (x, y) { return null; };
            };
        }
        return Base2;
    })();
})(GenericSignaturesValid || (GenericSignaturesValid = {}));
