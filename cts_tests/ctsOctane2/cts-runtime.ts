var getter = new Function(`return this.${pname};`);
var setter = new Function('val', `this.${pname} = val;`);

