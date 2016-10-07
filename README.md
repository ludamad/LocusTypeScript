# LocusTypeScript

LocusTypeScript is a fork of [TypeScript](https://github.com/Microsoft/TypeScript), introducing a new concept called ``locus types''.

LocusTypeScript aims to tackle exactly one problem in TypeScript, giving an appropriate type to objects that are under construction or extension:
```
var conn = new Connection();
conn.player = player;        // New field
conn.sendName = function() { // New field
    this.send(this.player.name);
};
```
This sort of dynamic object extension is very common in JavaScript.
However, in TypeScript, *conn* would be inferred to be of type *Connection*, which lacks our new fields.
We would have to create a new type with these fields, and cast the new Connection object unsafely, and keep the type in sync with any new assignments.
As an additional pain-point, TypeScript will allow the fields then to be used before they are actually assigned. 

Locus types allow programmers to solve these problems with an on-the-spot type creation keyword:

```
var conn: declare PlayerConnection = new Connection();
conn.player = player;
conn.sendName = function() {
    this.send(this.player.name);
};
```

Now, *PlayerConnection* is the type that *conn* has after construction, containing members determined by analysis of assignment operations.
The assignments may occur within loops and other control structures, in which case a type is computed from the union of all possible types. 
(Note: LocusTypeScript does not attempt to eliminate branches that cant actually occur, as this can get very complex without clear gain.)

As well, LocusTypeScript can improve on the case where we externally specify a PlayerConnection interface, correctly determining if fields are used before assignment:
```
var conn: becomes PlayerConnection = new Connection();
// If our type was simply 'PlayerConnection', we would require a cast and the following would be allowed:
var playerName = conn.player.name; 
// With the 'becomes' keyword, this is an error unless 'conn.player' is assigned with the appropriate type.
```


## Building

In order to build the TypeScript compiler, ensure that you have [Git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/) installed.

Clone a copy of the repo:

```
git clone https://github.com/ludamad/LocusTypeScript
```

Change to the LocusTypeScript directory:

```
cd LocusTypeScript
```

Install Jake tools and dev dependencies:

```
npm install -g jake
npm install
```

Use one of the following to build and test:

```
jake local            # Build the compiler into built/local 
jake clean            # Delete the built compiler 
jake LKG              # Replace the last known good with the built one.
                      # Bootstrapping step to be executed when the built compiler reaches a stable state.
jake tests            # Build the test infrastructure using the built compiler. 
jake runtests         # Run tests using the built compiler and test infrastructure. 
                      # You can override the host or specify a test for this command. 
                      # Use host=<hostName> or tests=<testPath>. 
jake runtests-browser # Runs the tests using the built run.js file. Syntax is jake runtests. Optional
                        parameters 'host=', 'tests=[regex], reporter=[list|spec|json|<more>]'.
jake baseline-accept  # This replaces the baseline test results with the results obtained from jake runtests.
jake lint             # Runs tslint on the TypeScript source.
jake -T               # List the above commands. 
```


## Usage

```shell
node built/local/tsc.js hello.ts
```


