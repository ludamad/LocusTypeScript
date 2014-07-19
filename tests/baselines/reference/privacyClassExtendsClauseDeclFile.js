//// [tests/cases/compiler/privacyClassExtendsClauseDeclFile.ts] ////

//// [privacyClassExtendsClauseDeclFile_externalModule.ts]

export module publicModule {
    export class publicClassInPublicModule {
        private f1() {
        }
    }

    class privateClassInPublicModule {
    }

    class privateClassExtendingPublicClassInModule extends publicClassInPublicModule {
    }
    class privateClassExtendingPrivateClassInModule extends privateClassInPublicModule {
    }
    export class publicClassExtendingPublicClassInModule extends publicClassInPublicModule {
    }
    export class publicClassExtendingPrivateClassInModule extends privateClassInPublicModule { // Should error
    }

    class privateClassExtendingFromPrivateModuleClass extends privateModule.publicClassInPrivateModule {
    }
    export class publicClassExtendingFromPrivateModuleClass extends privateModule.publicClassInPrivateModule { // Should error
    }
}

module privateModule {
    export class publicClassInPrivateModule {
        private f1() {
        }
    }

    class privateClassInPrivateModule {
    }

    class privateClassExtendingPublicClassInModule extends publicClassInPrivateModule {
    }
    class privateClassExtendingPrivateClassInModule extends privateClassInPrivateModule {
    }
    export class publicClassExtendingPublicClassInModule extends publicClassInPrivateModule {
    }
    export class publicClassExtendingPrivateClassInModule extends privateClassInPrivateModule { 
    }

    class privateClassExtendingFromPrivateModuleClass extends privateModule.publicClassInPrivateModule {
    }
    export class publicClassExtendingFromPrivateModuleClass extends privateModule.publicClassInPrivateModule {
    }
}

export class publicClass {
    private f1() {
    }
}

class privateClass {
}

class privateClassExtendingPublicClass extends publicClass {
}
class privateClassExtendingPrivateClassInModule extends privateClass {
}
export class publicClassExtendingPublicClass extends publicClass {
}
export class publicClassExtendingPrivateClass extends privateClass { // Should error
}

class privateClassExtendingFromPrivateModuleClass extends privateModule.publicClassInPrivateModule {
}
export class publicClassExtendingFromPrivateModuleClass extends privateModule.publicClassInPrivateModule { // Should error
}

//// [privacyClassExtendsClauseDeclFile_GlobalFile.ts]
module publicModuleInGlobal {
    export class publicClassInPublicModule {
        private f1() {
        }
    }

    class privateClassInPublicModule {
    }

    class privateClassExtendingPublicClassInModule extends publicClassInPublicModule {
    }
    class privateClassExtendingPrivateClassInModule extends privateClassInPublicModule {
    }
    export class publicClassExtendingPublicClassInModule extends publicClassInPublicModule {
    }
    export class publicClassExtendingPrivateClassInModule extends privateClassInPublicModule { // Should error
    }
}
class publicClassInGlobal {
}
class publicClassExtendingPublicClassInGlobal extends publicClassInGlobal {
}


//// [privacyClassExtendsClauseDeclFile_externalModule.js]
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
(function (publicModule) {
    var publicClassInPublicModule = (function () {
        function publicClassInPublicModule() {
        }
        publicClassInPublicModule.prototype.f1 = function () {
        };
        return publicClassInPublicModule;
    })();
    publicModule.publicClassInPublicModule = publicClassInPublicModule;
    var privateClassInPublicModule = (function () {
        function privateClassInPublicModule() {
        }
        return privateClassInPublicModule;
    })();
    var privateClassExtendingPublicClassInModule = (function (_super) {
        __extends(privateClassExtendingPublicClassInModule, _super);
        function privateClassExtendingPublicClassInModule() {
            _super.apply(this, arguments);
        }
        return privateClassExtendingPublicClassInModule;
    })(publicClassInPublicModule);
    var privateClassExtendingPrivateClassInModule = (function (_super) {
        __extends(privateClassExtendingPrivateClassInModule, _super);
        function privateClassExtendingPrivateClassInModule() {
            _super.apply(this, arguments);
        }
        return privateClassExtendingPrivateClassInModule;
    })(privateClassInPublicModule);
    var publicClassExtendingPublicClassInModule = (function (_super) {
        __extends(publicClassExtendingPublicClassInModule, _super);
        function publicClassExtendingPublicClassInModule() {
            _super.apply(this, arguments);
        }
        return publicClassExtendingPublicClassInModule;
    })(publicClassInPublicModule);
    publicModule.publicClassExtendingPublicClassInModule = publicClassExtendingPublicClassInModule;
    var publicClassExtendingPrivateClassInModule = (function (_super) {
        __extends(publicClassExtendingPrivateClassInModule, _super);
        function publicClassExtendingPrivateClassInModule() {
            _super.apply(this, arguments);
        }
        return publicClassExtendingPrivateClassInModule;
    })(privateClassInPublicModule);
    publicModule.publicClassExtendingPrivateClassInModule = publicClassExtendingPrivateClassInModule;
    var privateClassExtendingFromPrivateModuleClass = (function (_super) {
        __extends(privateClassExtendingFromPrivateModuleClass, _super);
        function privateClassExtendingFromPrivateModuleClass() {
            _super.apply(this, arguments);
        }
        return privateClassExtendingFromPrivateModuleClass;
    })(privateModule.publicClassInPrivateModule);
    var publicClassExtendingFromPrivateModuleClass = (function (_super) {
        __extends(publicClassExtendingFromPrivateModuleClass, _super);
        function publicClassExtendingFromPrivateModuleClass() {
            _super.apply(this, arguments);
        }
        return publicClassExtendingFromPrivateModuleClass;
    })(privateModule.publicClassInPrivateModule);
    publicModule.publicClassExtendingFromPrivateModuleClass = publicClassExtendingFromPrivateModuleClass;
})(exports.publicModule || (exports.publicModule = {}));
var publicModule = exports.publicModule;
var privateModule;
(function (privateModule) {
    var publicClassInPrivateModule = (function () {
        function publicClassInPrivateModule() {
        }
        publicClassInPrivateModule.prototype.f1 = function () {
        };
        return publicClassInPrivateModule;
    })();
    privateModule.publicClassInPrivateModule = publicClassInPrivateModule;
    var privateClassInPrivateModule = (function () {
        function privateClassInPrivateModule() {
        }
        return privateClassInPrivateModule;
    })();
    var privateClassExtendingPublicClassInModule = (function (_super) {
        __extends(privateClassExtendingPublicClassInModule, _super);
        function privateClassExtendingPublicClassInModule() {
            _super.apply(this, arguments);
        }
        return privateClassExtendingPublicClassInModule;
    })(publicClassInPrivateModule);
    var privateClassExtendingPrivateClassInModule = (function (_super) {
        __extends(privateClassExtendingPrivateClassInModule, _super);
        function privateClassExtendingPrivateClassInModule() {
            _super.apply(this, arguments);
        }
        return privateClassExtendingPrivateClassInModule;
    })(privateClassInPrivateModule);
    var publicClassExtendingPublicClassInModule = (function (_super) {
        __extends(publicClassExtendingPublicClassInModule, _super);
        function publicClassExtendingPublicClassInModule() {
            _super.apply(this, arguments);
        }
        return publicClassExtendingPublicClassInModule;
    })(publicClassInPrivateModule);
    privateModule.publicClassExtendingPublicClassInModule = publicClassExtendingPublicClassInModule;
    var publicClassExtendingPrivateClassInModule = (function (_super) {
        __extends(publicClassExtendingPrivateClassInModule, _super);
        function publicClassExtendingPrivateClassInModule() {
            _super.apply(this, arguments);
        }
        return publicClassExtendingPrivateClassInModule;
    })(privateClassInPrivateModule);
    privateModule.publicClassExtendingPrivateClassInModule = publicClassExtendingPrivateClassInModule;
    var privateClassExtendingFromPrivateModuleClass = (function (_super) {
        __extends(privateClassExtendingFromPrivateModuleClass, _super);
        function privateClassExtendingFromPrivateModuleClass() {
            _super.apply(this, arguments);
        }
        return privateClassExtendingFromPrivateModuleClass;
    })(privateModule.publicClassInPrivateModule);
    var publicClassExtendingFromPrivateModuleClass = (function (_super) {
        __extends(publicClassExtendingFromPrivateModuleClass, _super);
        function publicClassExtendingFromPrivateModuleClass() {
            _super.apply(this, arguments);
        }
        return publicClassExtendingFromPrivateModuleClass;
    })(privateModule.publicClassInPrivateModule);
    privateModule.publicClassExtendingFromPrivateModuleClass = publicClassExtendingFromPrivateModuleClass;
})(privateModule || (privateModule = {}));
var publicClass = (function () {
    function publicClass() {
    }
    publicClass.prototype.f1 = function () {
    };
    return publicClass;
})();
exports.publicClass = publicClass;
var privateClass = (function () {
    function privateClass() {
    }
    return privateClass;
})();
var privateClassExtendingPublicClass = (function (_super) {
    __extends(privateClassExtendingPublicClass, _super);
    function privateClassExtendingPublicClass() {
        _super.apply(this, arguments);
    }
    return privateClassExtendingPublicClass;
})(publicClass);
var privateClassExtendingPrivateClassInModule = (function (_super) {
    __extends(privateClassExtendingPrivateClassInModule, _super);
    function privateClassExtendingPrivateClassInModule() {
        _super.apply(this, arguments);
    }
    return privateClassExtendingPrivateClassInModule;
})(privateClass);
var publicClassExtendingPublicClass = (function (_super) {
    __extends(publicClassExtendingPublicClass, _super);
    function publicClassExtendingPublicClass() {
        _super.apply(this, arguments);
    }
    return publicClassExtendingPublicClass;
})(publicClass);
exports.publicClassExtendingPublicClass = publicClassExtendingPublicClass;
var publicClassExtendingPrivateClass = (function (_super) {
    __extends(publicClassExtendingPrivateClass, _super);
    function publicClassExtendingPrivateClass() {
        _super.apply(this, arguments);
    }
    return publicClassExtendingPrivateClass;
})(privateClass);
exports.publicClassExtendingPrivateClass = publicClassExtendingPrivateClass;
var privateClassExtendingFromPrivateModuleClass = (function (_super) {
    __extends(privateClassExtendingFromPrivateModuleClass, _super);
    function privateClassExtendingFromPrivateModuleClass() {
        _super.apply(this, arguments);
    }
    return privateClassExtendingFromPrivateModuleClass;
})(privateModule.publicClassInPrivateModule);
var publicClassExtendingFromPrivateModuleClass = (function (_super) {
    __extends(publicClassExtendingFromPrivateModuleClass, _super);
    function publicClassExtendingFromPrivateModuleClass() {
        _super.apply(this, arguments);
    }
    return publicClassExtendingFromPrivateModuleClass;
})(privateModule.publicClassInPrivateModule);
exports.publicClassExtendingFromPrivateModuleClass = publicClassExtendingFromPrivateModuleClass;
//// [privacyClassExtendsClauseDeclFile_GlobalFile.js]
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var publicModuleInGlobal;
(function (publicModuleInGlobal) {
    var publicClassInPublicModule = (function () {
        function publicClassInPublicModule() {
        }
        publicClassInPublicModule.prototype.f1 = function () {
        };
        return publicClassInPublicModule;
    })();
    publicModuleInGlobal.publicClassInPublicModule = publicClassInPublicModule;
    var privateClassInPublicModule = (function () {
        function privateClassInPublicModule() {
        }
        return privateClassInPublicModule;
    })();
    var privateClassExtendingPublicClassInModule = (function (_super) {
        __extends(privateClassExtendingPublicClassInModule, _super);
        function privateClassExtendingPublicClassInModule() {
            _super.apply(this, arguments);
        }
        return privateClassExtendingPublicClassInModule;
    })(publicClassInPublicModule);
    var privateClassExtendingPrivateClassInModule = (function (_super) {
        __extends(privateClassExtendingPrivateClassInModule, _super);
        function privateClassExtendingPrivateClassInModule() {
            _super.apply(this, arguments);
        }
        return privateClassExtendingPrivateClassInModule;
    })(privateClassInPublicModule);
    var publicClassExtendingPublicClassInModule = (function (_super) {
        __extends(publicClassExtendingPublicClassInModule, _super);
        function publicClassExtendingPublicClassInModule() {
            _super.apply(this, arguments);
        }
        return publicClassExtendingPublicClassInModule;
    })(publicClassInPublicModule);
    publicModuleInGlobal.publicClassExtendingPublicClassInModule = publicClassExtendingPublicClassInModule;
    var publicClassExtendingPrivateClassInModule = (function (_super) {
        __extends(publicClassExtendingPrivateClassInModule, _super);
        function publicClassExtendingPrivateClassInModule() {
            _super.apply(this, arguments);
        }
        return publicClassExtendingPrivateClassInModule;
    })(privateClassInPublicModule);
    publicModuleInGlobal.publicClassExtendingPrivateClassInModule = publicClassExtendingPrivateClassInModule;
})(publicModuleInGlobal || (publicModuleInGlobal = {}));
var publicClassInGlobal = (function () {
    function publicClassInGlobal() {
    }
    return publicClassInGlobal;
})();
var publicClassExtendingPublicClassInGlobal = (function (_super) {
    __extends(publicClassExtendingPublicClassInGlobal, _super);
    function publicClassExtendingPublicClassInGlobal() {
        _super.apply(this, arguments);
    }
    return publicClassExtendingPublicClassInGlobal;
})(publicClassInGlobal);
