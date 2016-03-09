/* @KnownDefect */
/* @RequiresExpensiveFlowAnalysis */
// ^ Just an explanation of the above (not enforced):

function Foo(this: declare FooType) {
    this.init();
}

Foo.prototype.init = function() {
}
