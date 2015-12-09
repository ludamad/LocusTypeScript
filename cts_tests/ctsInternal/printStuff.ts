
function makeSprite(sprite: {} declare Sprite, image: !string) {
    sprite.image = image;
}

function makeNpc(npc: Sprite declare Npc, name: !string) {
    npc.name = name;
}

/*var a : declare Foo = {};
a.x = 1;
a.y = "hi";
a.z = 1 ? 1 : 'hi';
a.q = [2];
if (1) a.b = 1; else a.b = 'hi';

if (1) a.b = [[1]];*/


var a : declare Becomer = {};
makeSprite(a, "Hey");
//makeNpc(a);

/*
@afterCheck[isExpression]{
    flowPrint(scanAssignedMemberTypes(node))
}
*/ a;
