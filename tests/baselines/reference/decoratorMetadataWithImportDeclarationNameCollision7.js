//// [tests/cases/compiler/decoratorMetadataWithImportDeclarationNameCollision7.ts] ////

//// [db.ts]
export default class db {
    public doSomething() {
    }
}

//// [service.ts]
import db from './db';
function someDecorator(target) {
    return target;
}
@someDecorator
class MyClass {
    db: db.db; //error

    constructor(db: db.db) { // error
        this.db = db;
        this.db.doSomething();
    }
}
export {MyClass};


//// [db.js]
var db = (function () {
    function db() {
    }
    db.prototype.doSomething = function () {
    };
    return db;
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = db;
//// [service.js]
var db_1 = require('./db');
function someDecorator(target) {
    return target;
}
var MyClass = (function () {
    function MyClass(db) {
        this.db = db;
        this.db.doSomething();
    }
    MyClass = __decorate([
        someDecorator, 
        __metadata('design:paramtypes', [Object])
    ], MyClass);
    return MyClass;
})();
exports.MyClass = MyClass;
