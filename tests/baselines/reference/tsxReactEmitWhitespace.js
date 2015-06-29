//// [tsxReactEmitWhitespace.tsx]
declare module JSX {
	interface Element { }
	interface IntrinsicElements {
		[s: string]: any;
	}
}

// THIS FILE HAS TEST-SIGNIFICANT LEADING/TRAILING
// WHITESPACE, DO NOT RUN 'FORMAT DOCUMENT' ON IT

var p = 0;
// Emit "   "
<div>   </div>;
// Emit "  ", p, "   "
<div>  {p}    </div>;
// Emit only p
<div>  
      {p}    
      </div>;

// Emit only p
<div>
  {p}
    </div>;

// Emit "  3"
<div>  3  
  </div>;

// Emit "  3  "
<div>  3  </div>;

// Emit "3"
<div>   
   3    
   </div>;

// Emit no args
<div>   
   </div>;

// Emit "foo" + ' ' + "bar"
<div>  

   foo

 bar   

  </div>;



//// [tsxReactEmitWhitespace.js]
// THIS FILE HAS TEST-SIGNIFICANT LEADING/TRAILING
// WHITESPACE, DO NOT RUN 'FORMAT DOCUMENT' ON IT
var p = 0;
// Emit "   "
React.createElement("div", null);
// Emit "  ", p, "   "
React.createElement("div", null, p);
// Emit only p
React.createElement("div", null, p);
// Emit only p
React.createElement("div", null, p);
// Emit "  3"
React.createElement("div", null, "3");
// Emit "  3  "
React.createElement("div", null, "3  ");
// Emit "3"
React.createElement("div", null, "3");
// Emit no args
React.createElement("div", null);
// Emit "foo" + ' ' + "bar"
React.createElement("div", null, "foo" + ' ' + "bar");
