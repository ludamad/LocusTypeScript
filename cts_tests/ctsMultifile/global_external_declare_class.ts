// @KnownDefect

// @RuntimeTest

import {Foo} from "./external_declare_class.inc";

var foo = new Foo();
assertBranded(foo);
/* @assertType("!Foo"); */ foo;
/* @assertType("!number"); */ (foo.method());
assert(foo.method() === 1);
