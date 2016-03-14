function Foo(a: number) {
    a++;
    console.log(a);
}

Foo('');
Foo({});
Foo(eval('1'));
Foo(2);
