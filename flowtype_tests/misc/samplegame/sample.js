/// <reference path="DefinitelyTyped/react/react.d.ts" />
if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes/* TODO UNUSED */ = {};
$$cts$$runtime.brandTypes.Grid = new $$cts$$runtime.Brand('Grid');
$$cts$$runtime.brandTypes.Grid.prototype = new $$cts$$runtime.Brand();
var React = require("react");
/*this-branded*/function Grid() {
    $$cts$$runtime.cast($$cts$$runtime.brandTypes.Grid.prototype, Object.getPrototypeOf(this));
    this.grid = {};$$cts$$runtime.brand($$cts$$runtime.brandTypes.Grid, this);
}
$$cts$$runtime.cementGlobal("Grid",Grid);
Grid.prototype.get = function (x, y) {
    $$cts$$runtime.cast(Number,x);
    $$cts$$runtime.cast(Number,y);
    return this.grid[x + "," + y];
};
$$cts$$runtime.brand($$cts$$runtime.brandTypes.Grid.prototype, Grid.prototype);
var CommentBox = React.createClass({
    render: function () {
        return React.createElement("div", {"className": "commentBox"}, "Hello, world! I am a CommentBox.");
    }
});
