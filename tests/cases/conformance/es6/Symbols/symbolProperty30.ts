//@target: ES6
class C1 {
    [Symbol.toStringTag]() {
        return { x: "" };
    }
    [s: Symbol]: () => { x: number };
}