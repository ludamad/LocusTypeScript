//// [super1.ts]
// Case 1
class Base1 {
    public foo() {
        return "base";
    }
}

class Sub1 extends Base1 {
    public bar() {
        return "base";
    }
}

class SubSub1 extends Sub1 {
    public bar() {
        return super.super.foo;
    }
}

// Case 2
class Base2 {
    public foo() {
        return "base";
    }
}

class SubE2 extends Base2 {
    public bar() {
        return super.prototype.foo = null;
    }
}

// Case 3
class Base3 {
    public foo() {
        return "base";
    }
}

class SubE3 extends Base3 {
    public bar() {
        return super.bar();
    }
}

// Case 4
module Base4 {
    class Sub4 {
        public x(){
            return "hello";
        }
    }
    
    export class SubSub4 extends Sub4{
        public x(){
            return super.x();
        }
    }
    
    export class Sub4E {
        public x() {
            return super.x();
        }
    }
}


//// [super1.js]
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Base1 = (function () {
    function Base1() {
    }
    Base1.prototype.foo = function () {
        return "base";
    };
    return Base1;
})();
var Sub1 = (function (_super) {
    __extends(Sub1, _super);
    function Sub1() {
        _super.apply(this, arguments);
    }
    Sub1.prototype.bar = function () {
        return "base";
    };
    return Sub1;
})(Base1);
var SubSub1 = (function (_super) {
    __extends(SubSub1, _super);
    function SubSub1() {
        _super.apply(this, arguments);
    }
    SubSub1.prototype.bar = function () {
        return _super.prototype.super.foo;
    };
    return SubSub1;
})(Sub1);
var Base2 = (function () {
    function Base2() {
    }
    Base2.prototype.foo = function () {
        return "base";
    };
    return Base2;
})();
var SubE2 = (function (_super) {
    __extends(SubE2, _super);
    function SubE2() {
        _super.apply(this, arguments);
    }
    SubE2.prototype.bar = function () {
        return _super.prototype.prototype.foo = null;
    };
    return SubE2;
})(Base2);
var Base3 = (function () {
    function Base3() {
    }
    Base3.prototype.foo = function () {
        return "base";
    };
    return Base3;
})();
var SubE3 = (function (_super) {
    __extends(SubE3, _super);
    function SubE3() {
        _super.apply(this, arguments);
    }
    SubE3.prototype.bar = function () {
        return _super.prototype.bar.call(this);
    };
    return SubE3;
})(Base3);
var Base4;
(function (Base4) {
    var Sub4 = (function () {
        function Sub4() {
        }
        Sub4.prototype.x = function () {
            return "hello";
        };
        return Sub4;
    })();
    var SubSub4 = (function (_super) {
        __extends(SubSub4, _super);
        function SubSub4() {
            _super.apply(this, arguments);
        }
        SubSub4.prototype.x = function () {
            return _super.prototype.x.call(this);
        };
        return SubSub4;
    })(Sub4);
    Base4.SubSub4 = SubSub4;
    var Sub4E = (function () {
        function Sub4E() {
        }
        Sub4E.prototype.x = function () {
            return super.x.call(this);
        };
        return Sub4E;
    })();
    Base4.Sub4E = Sub4E;
})(Base4 || (Base4 = {}));
