// @target:es5
// @experimentaldecorators: true

// from #2971
function func(s: string): void {
}

class A {
    @(x => {
        var a = 3;
        func(a);
        return x; 
    })
    m() {

    }
}