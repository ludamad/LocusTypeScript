/// <reference path="DefinitelyTyped/react/react.d.ts" />

import * as React from "react";

function Grid() {
    var this: declare Grid;
    this.grid = {};
}

Grid.prototype.get = function(x:!number, y:!number) {
    return this.grid[x + "," + y]
};

var CommentBox = React.createClass({
  render: function() {
      return <div className="commentBox">
        Hello, world! I am a CommentBox.
      </div>;
  }
});
