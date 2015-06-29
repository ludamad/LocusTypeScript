//// [tsxElementResolution9.tsx]
declare module JSX {
	interface Element { }
	interface IntrinsicElements { }
}

interface Obj1 {
	new(n: string): { x: number };
	new(n: number): { y: string };
}
var Obj1: Obj1;
<Obj1 />; // Error, return type is not an object type

interface Obj2 {
	(n: string): { x: number };
	(n: number): { y: string };
}
var Obj2: Obj2;
<Obj2 />; // Error, return type is not an object type

interface Obj3 {
	(n: string): { x: number };
	(n: number): { x: number; y: string };
}
var Obj3: Obj3;
<Obj3 x={42} />; // OK


//// [tsxElementResolution9.jsx]
var Obj1;
<Obj1 />; // Error, return type is not an object type
var Obj2;
<Obj2 />; // Error, return type is not an object type
var Obj3;
<Obj3 x={42}/>; // OK
