// @KnownDefect

// @RuntimeTest

import {Foo, makeFoo} from "./external_declare.inc";

var foo = makeFoo();
assertBranded(foo);
/* @assertType("!Foo"); */ foo;
/* @assertType("!number"); */ (foo.method());
assert(foo.method() === 1);
