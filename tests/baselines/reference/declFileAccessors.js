//// [tests/cases/compiler/declFileAccessors.ts] ////

//// [declFileAccessors_0.ts]

/** This is comment for c1*/
export class c1 {
    /** getter property*/
    public get p3() {
        return 10;
    }
    /** setter property*/
    public set p3(/** this is value*/value: number) {
    }
    /** private getter property*/
    private get pp3() {
        return 10;
    }
    /** private setter property*/
    private set pp3(/** this is value*/value: number) {
    }
    /** static getter property*/
    static get s3() {
        return 10;
    }
    /** setter property*/
    static set s3( /** this is value*/value: number) {
    }
    public get nc_p3() {
        return 10;
    }
    public set nc_p3(value: number) {
    }
    private get nc_pp3() {
        return 10;
    }
    private set nc_pp3(value: number) {
    }
    static get nc_s3() {
        return "";
    }
    static set nc_s3(value: string) {
    }

    // Only getter property
    public get onlyGetter() {
        return 10;
    }

    // Only setter property
    public set onlySetter(value: number) {
    }
}

//// [declFileAccessors_1.ts]
/** This is comment for c2 - the global class*/
class c2 {
    /** getter property*/
    public get p3() {
        return 10;
    }
    /** setter property*/
    public set p3(/** this is value*/value: number) {
    }
    /** private getter property*/
    private get pp3() {
        return 10;
    }
    /** private setter property*/
    private set pp3(/** this is value*/value: number) {
    }
    /** static getter property*/
    static get s3() {
        return 10;
    }
    /** setter property*/
    static set s3( /** this is value*/value: number) {
    }
    public get nc_p3() {
        return 10;
    }
    public set nc_p3(value: number) {
    }
    private get nc_pp3() {
        return 10;
    }
    private set nc_pp3(value: number) {
    }
    static get nc_s3() {
        return "";
    }
    static set nc_s3(value: string) {
    }

    // Only getter property
    public get onlyGetter() {
        return 10;
    }

    // Only setter property
    public set onlySetter(value: number) {
    }
}

//// [declFileAccessors_0.js]
var c1 = (function () {
    function c1() {
    }
    Object.defineProperty(c1.prototype, "p3", {
        get: function () {
            return 10;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c1.prototype, "pp3", {
        get: function () {
            return 10;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c1, "s3", {
        get: function () {
            return 10;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c1.prototype, "nc_p3", {
        get: function () {
            return 10;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c1.prototype, "nc_pp3", {
        get: function () {
            return 10;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c1, "nc_s3", {
        get: function () {
            return "";
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c1.prototype, "onlyGetter", {
        get: function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c1.prototype, "onlySetter", {
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    return c1;
})();
exports.c1 = c1;
//// [declFileAccessors_1.js]
var c2 = (function () {
    function c2() {
    }
    Object.defineProperty(c2.prototype, "p3", {
        get: function () {
            return 10;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c2.prototype, "pp3", {
        get: function () {
            return 10;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c2, "s3", {
        get: function () {
            return 10;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c2.prototype, "nc_p3", {
        get: function () {
            return 10;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c2.prototype, "nc_pp3", {
        get: function () {
            return 10;
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c2, "nc_s3", {
        get: function () {
            return "";
        },
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c2.prototype, "onlyGetter", {
        get: function () {
            return 10;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(c2.prototype, "onlySetter", {
        set: function (value) {
        },
        enumerable: true,
        configurable: true
    });
    return c2;
})();


//// [declFileAccessors_0.d.ts]
export declare class c1 {
    p3;
    private pp3;
    static s3;
    nc_p3;
    private nc_pp3;
    static nc_s3;
    onlyGetter;
    onlySetter;
}
//// [declFileAccessors_1.d.ts]
