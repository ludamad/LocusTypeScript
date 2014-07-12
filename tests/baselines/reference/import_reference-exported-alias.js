//// [tests/cases/compiler/import_reference-exported-alias.ts] ////

//// [file1.ts]
module App {
    export module Services {
        export class UserServices {
            public getUserName(): string {
                return "Bill Gates";
            }
        }
    }
}

import Mod = App;
export = Mod;

//// [file2.ts]
import appJs = require("file1");
import Services = appJs.Services;
import UserServices = Services.UserServices;
var x = new UserServices().getUserName();


//// [file1.js]
define(["require", "exports"], function (require, exports) {
    var App;
    (function (App) {
        (function (Services) {
            var UserServices = (function () {
                function UserServices() {
                }
                UserServices.prototype.getUserName = function () {
                    return "Bill Gates";
                };
                return UserServices;
            })();
            Services.UserServices = UserServices;
        })(App.Services || (App.Services = {}));
        var Services = App.Services;
    })(App || (App = {}));
    var Mod = App;
    return Mod;
});
//// [file2.js]
define(["require", "exports", "file1"], function (require, exports, appJs) {
    var Services = appJs.Services;
    var UserServices = Services.UserServices;
    var x = new UserServices().getUserName();
});
