//// [commentsdoNotEmitComments.ts]

/** Variable comments*/
var myVariable = 10;

/** function comments*/
function foo(/** parameter comment*/p: number) {
}

/** variable with function type comment*/
var fooVar: () => void;
foo(50);
fooVar();

/**class comment*/
class c {
    /** constructor comment*/
    constructor() {
    }

    /** property comment */
    public b = 10;

    /** function comment */
    public myFoo() {
        return this.b;
    }

    /** getter comment*/
    public get prop1() {
        return this.b;
    }

    /** setter comment*/
    public set prop1(val: number) {
        this.b = val;
    }

    /** overload signature1*/
    public foo1(a: number): string;
    /** Overload signature 2*/
    public foo1(b: string): string;
    /** overload implementation signature*/
    public foo1(aOrb) {
        return aOrb.toString();
    }
}

/**instance comment*/
var i = new c();

/** interface comments*/
interface i1 {
    /** caller comments*/
    (a: number): number;

    /** new comments*/
    new (b: string);

    /**indexer property*/
    [a: number]: string;

    /** function property;*/
    myFoo(/*param prop*/a: number): string;

    /** prop*/
    prop: string;
}

/**interface instance comments*/
var i1_i: i1;

/** this is module comment*/
module m1 {
    /** class b */
    export class b {
        constructor(public x: number) {
           
        }
    }

    /// module m2
    export module m2 {
    }
}

/// this is x
declare var x;


//// [commentsdoNotEmitComments.js]
var myVariable = 10;
function foo(p) {
}
var fooVar;
foo(50);
fooVar();
var c = (function () {
    function c() {
        this.b = 10;
    }
    c.prototype.myFoo = function () {
        return this.b;
    };
    Object.defineProperty(c.prototype, "prop1", {
        get: function () {
            return this.b;
        },
        set: function (val) {
            this.b = val;
        },
        enumerable: true,
        configurable: true
    });
    c.prototype.foo1 = function (aOrb) {
        return aOrb.toString();
    };
    return c;
})();
var i = new c();
var i1_i;
var m1;
(function (m1) {
    var b = (function () {
        function b(x) {
            this.x = x;
        }
        return b;
    })();
    m1.b = b;
})(m1 || (m1 = {}));


//// [commentsdoNotEmitComments.d.ts]
declare var myVariable;
declare function foo(p);
declare var fooVar;
declare class c {
    constructor ();
    b;
    myFoo();
    prop1;
    foo1(a);
    foo1(b);
    foo1(aOrb);
}
declare var i;
interface i1 {
    (a);
    new (b);
    [a];
    myFoo(a);
    prop;
}
declare var i1_i;
declare module m1 {
    class b {
        x;
        constructor (x);
    }
    module m2 {
    }
}
declare var x;
