//
// Implement the following spec:
//  - 
if (typeof $$cts$$runtime === "undefined") {
    if (typeof require !== "undefined") require("./cts-runtime.js");
    else if (typeof document !== "undefined") { document.writeLine("<script src=\"cts-runtime.js\"></script>"); }
    else throw new Error("Could not load ConcreteTypeScript runtime!");
}var $$cts$$brandTypes = {};
$$cts$$brandTypes.Sprite = new $$cts$$runtime.Brand('Sprite');
$$cts$$brandTypes.Sprite.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Npc = new $$cts$$runtime.Brand('Npc');
$$cts$$brandTypes.Npc.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.Map = new $$cts$$runtime.Brand('Map');
$$cts$$brandTypes.Map.prototype = new $$cts$$runtime.Brand();
$$cts$$brandTypes.GameObject = new $$cts$$runtime.Brand('GameObject');
$$cts$$brandTypes.GameObject.prototype = new $$cts$$runtime.Brand();
console.log("Welcome to TYPEWARS");
// Future syntax:
// function Sprite(this: declare extends NPC) {
// }
function Sprite() {
    $$cts$$runtime.cast($$cts$$brandTypes.Sprite.prototype, Object.getPrototypeOf(this));
    $$cts$$runtime.brand($$cts$$brandTypes.Sprite, this);
}
$$cts$$runtime.cementGlobal("Sprite",Sprite);
$$cts$$runtime.brand($$cts$$brandTypes.Sprite.prototype, Sprite.prototype);
function Npc() {
    $$cts$$runtime.cast($$cts$$brandTypes.Npc.prototype, Object.getPrototypeOf(this));
    $$cts$$runtime.brand($$cts$$brandTypes.Npc, this);
}
$$cts$$runtime.cementGlobal("Npc",Npc);
$$cts$$runtime.brand($$cts$$brandTypes.Npc.prototype, Npc.prototype);
function Map() {
    $$cts$$runtime.cast($$cts$$brandTypes.Map.prototype, Object.getPrototypeOf(this));
    this.grid = [];$$cts$$runtime.brand($$cts$$brandTypes.Map, this);
    for (var y = 0; y < 8; x++) {
        var row = [];
        for (var x = 0; x < 8; x++) {
            row.push(null);
        }
        this.grid.push(row);
    }
}
$$cts$$runtime.cementGlobal("Map",Map);
Map.prototype.get = function (x, y) {
    $$cts$$runtime.cast(Number,x);
    $$cts$$runtime.cast(Number,y);
    return this.grid[y][x];
};
Map.prototype.set = function (x, y, object) {
    $$cts$$runtime.cast(Number,x);
    $$cts$$runtime.cast(Number,y);
    $$cts$$runtime.cast(GameObject,object);
    this.grid[y][x] = object;
};
$$cts$$runtime.brand($$cts$$brandTypes.Map.prototype, Map.prototype);
function GameObject(x, y) {
    $$cts$$runtime.cast($$cts$$brandTypes.GameObject.prototype, Object.getPrototypeOf(this));
    $$cts$$runtime.cast(Number,x);
    $$cts$$runtime.cast(Number,y);
    return $$cts$$value$GameObject.apply(this, arguments);
    }
    $$cts$$runtime.cementGlobal("GameObject",GameObject);
    $$cts$$runtime.brand($$cts$$brandTypes.GameObject.prototype, GameObject.prototype);
    function makeHero() {
    }
    $$cts$$runtime.cementGlobal("makeHero",makeHero);
