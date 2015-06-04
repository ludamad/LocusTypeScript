//// [asyncArrowFunctionCapturesArguments_es6.ts]
class C {
   method() {
      function other() {}
      var fn = async () => await other.apply(this, arguments);      
   }
}


//// [asyncArrowFunctionCapturesArguments_es6.js]
class C {
    method() {
        function other() { }
        var fn = () => __awaiter(function* (arguments) { return yield other.apply(this, arguments); }, this, arguments);
    }
}
