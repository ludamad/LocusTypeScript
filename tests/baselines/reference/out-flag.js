//// [out-flag.ts]
//// @out: bin\

// my class comments
class MyClass
{
    // my function comments
    public Count(): number
    {
        return 42;
    }

    public SetCount(value: number)
    {
        //
    }
}

//// [out-flag.js]
var MyClass = (function () {
    function MyClass() {
    }
    MyClass.prototype.Count = function () {
        return 42;
    };
    MyClass.prototype.SetCount = function (value) {
    };
    return MyClass;
})();
//# sourceMappingURL=out-flag.js.map

//// [out-flag.d.ts]
declare class MyClass {
    Count();
    SetCount(value);
}
