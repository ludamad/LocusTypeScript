var funcExpr = function() {}; // Note, different result for checking this directly in post ECOOP ConcreteTypeScript
/*@assert(!isConcreteType(getType()), "Function types shouldn't be concrete!")*/ 
funcExpr;
