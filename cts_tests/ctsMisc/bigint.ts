function BigInteger(this: declare BigInteger;
    a: any = undefined, b: any = undefined, c: any = undefined
) {
    this.array = new Array();
    if(a != null)
        if("number" == typeof a) this.fromNumber(a,b,c);
    else if(b == null && "string" != typeof a) this.fromString(a,256);
    else this.fromString(a,b);
}
BigInteger.prototype.fromNumber = function(a,b,c) {
}
BigInteger.prototype.fromString = function(a, b) {
}
