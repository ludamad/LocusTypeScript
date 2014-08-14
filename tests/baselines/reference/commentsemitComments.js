//// [commentsemitComments.ts]

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


//// [commentsemitComments.js]
/** Variable comments*/
var myVariable = 10;
/** function comments*/
function foo(p) {
}
/** variable with function type comment*/
var fooVar;
foo(50);
fooVar();
/**class comment*/
var c = (function () {
    /** constructor comment*/
    function c() {
        /** property comment */
        this.b = 10;
    }
    /** function comment */
    c.prototype.myFoo = function () {
        return this.b;
    };
    Object.defineProperty(c.prototype, "prop1", {
        /** getter comment*/
        get: function () {
            return this.b;
        },
        /** setter comment*/
        set: function (val) {
            this.b = val;
        },
        enumerable: true,
        configurable: true
    });
    /** overload implementation signature*/
    c.prototype.foo1 = function (aOrb) {
        return aOrb.toString();
    };
    return c;
})();
/**instance comment*/
var i = new c();
/**interface instance comments*/
var i1_i;
/** this is module comment*/
var m1;
(function (m1) {
    /** class b */
    var b = (function () {
        function b(x) {
            this.x = x;
        }
        return b;
    })();
    m1.b = b;
})(m1 || (m1 = {}));


//// [commentsemitComments.d.ts]
/** Variable comments*/
declare var myVariable: number;
declare function foo(p: number): void;
/** variable with function type comment*/
declare var fooVar: () => void;
/**class comment*/
declare class c {
    constructor();
    /** property comment */
    b: number;
    myFoo(): number;
    /** getter comment*/
    /** setter comment*/
    prop1: number;
    foo1(a: number): string;
    foo1(b: string): string;
}
/**instance comment*/
declare var i: c;
/** interface comments*/
interface i1 {
    (a: number): number;
    new (b: string): any;
    [a: number]: string;
    myFoo(a: number): string;
    /** prop*/
    prop: string;
}
/**interface instance comments*/
declare var i1_i: i1;
/** this is module comment*/
declare module m1 {
    /** class b */
    class b {
        x: number;
        constructor(x: number);
    }
    module m2 {
    }
}
declare var x: any;
