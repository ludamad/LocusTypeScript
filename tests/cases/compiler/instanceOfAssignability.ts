interface Base {
	foo: string|number;
	optional?: number;
}

// Derived1 is assignable to, but not a subtype of, Base
class Derived1 implements Base {
	foo: string;
}
// Derived2 is a subtype of Base that is not assignable to Derived1
class Derived2 implements Base {
	foo: number;
	optional: number;
}

function fn1(x: Array<number>|Array<string>|boolean) {
	if(x instanceof Array) {
		// 1.5: y: Array<number>|Array<string>
		// Want: y: Array<number>|Array<string>
		let y = x;
	}
}

function fn2(x: Base) {
	if(x instanceof Derived1) {
		// 1.5: y: Base
		// Want: y: Derived1
		let y = x;
	}
}

function fn3(x: Base|Derived1) {
	if(x instanceof Derived2) {
		// 1.5: y: Derived2
		// Want: Derived2
		let y = x;
	}
}

function fn4(x: Base|Derived2) {
	if(x instanceof Derived1) {
		// 1.5: y: {}
		// Want: Derived1
		let y = x;
	}
}

function fn5(x: Derived1) {
	if(x instanceof Derived2) {
		// 1.5: y: Derived1
		// Want: ???
		let y = x;
	}
}
