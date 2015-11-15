for (var i = 0; i < 1; i++) {
    // @afterCheck[isStatement]{ STORAGE.firstStatement = node }
    var b;
    // @afterCheck[isStatement]{ assert(node.parent.lastChild == node, "lastChild == node") }
    // @afterCheck[isStatement]{ printNodeDeep(node) }
    // @afterCheck[isStatement]{ assert(STORAGE.firstStatement == node.prevInParent, "firstStatement == node.prevInParent");}
    var c;
}
