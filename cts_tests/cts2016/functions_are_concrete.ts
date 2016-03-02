function foo() {
}
/* @assertType("!() => void") */ foo;

/* @assertType("!() => void") */ (function() {
});

/* @assertType("!() => void") */ (() => {
});

// Object methods should not be concrete:
/* @assertType("{ method(): void; }") */ ({
    method(){}
});
