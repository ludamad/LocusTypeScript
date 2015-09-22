//
// Implement the following spec:
//  - 

console.log("Welcome to TYPEWARS")

// Future syntax:
// function Sprite(this: declare extends NPC) {
// }
function Sprite() {
    var this: declare Sprite;
}
function Npc() {
    var this: declare Npc;
}


function Map() {
    var this: declare Map;
    this.grid = [];
    for (var y= 0; y < 8; x++) {
        var row = [];
        for (var x= 0; x < 8; x++) {
            row.push(null); 
        }
        this.grid.push(row);
    }
}

Map.prototype.get = function(x:!number, y:!number) {
    return this.grid[y][x];
}
Map.prototype.set = function(x:!number, y:!number, object:!GameObject) {
    this.grid[y][x] = object;
}

function GameObject(x:!number, y:!number) {
    var this: declare GameObject;
    this.x = x, this.y = y;
    this.character = '?';
}

function makeHero() {
}


