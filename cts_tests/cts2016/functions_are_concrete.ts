function foo() {
}
/* @assertType("!() => void") */ foo;

/* @assertType("!() => void") */ (function() {
});

/* @assertType("!() => void") */ (() => {
});

var a = {
    method(){}
};

// Object methods should not be concrete:
/* @assertType('() => void') */ (a.method);
