function toRadix(b:!intNumber) {
    if(b == null) b = 10;
    var cs = this.chunkSize(b);
    var a = <!intNumber> Math.pow(b,cs);
    var r = "";
    r = (a+a).toString(b).substr(1) + r;
}


