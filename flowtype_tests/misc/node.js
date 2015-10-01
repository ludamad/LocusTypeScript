var child_process = require('child_process');
child_process.spawn("echo", ["what"], function() {
    console.log("What");
});
