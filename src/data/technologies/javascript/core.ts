import type { TopicNode } from "@/data/types";

const typesAndCoercion: TopicNode = {
  id: "js-types-coercion",
  title: "Types & Type Coercion",
  iconName: "Tag",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
  theory:
    "JavaScript has 8 data types: 7 primitives (string, number, bigint, boolean, undefined, null, symbol) and 1 object type. Primitives are immutable and compared by value; objects are mutable and compared by reference. Type coercion — JavaScript silently converting types — is one of the most common sources of bugs.",
  theoryDetail: {
    keyConcepts: [
      "Primitives: string, number, bigint, boolean, undefined, null, symbol — passed by value",
      "Objects (arrays, functions, Date, Map, Set) — passed by reference",
      "typeof null === 'object' is a historical bug — null is a primitive",
      "Implicit coercion: == triggers ToNumber/ToString; + with a string concatenates instead of adds",
      "Falsy values: false, 0, -0, 0n, '', null, undefined, NaN — everything else is truthy",
      "NaN is the only value not equal to itself: NaN !== NaN — use Number.isNaN() to check",
    ],
    whyItMatters:
      "Type coercion bugs are notoriously hard to spot. The classic '1' + 2 === '12' and '1' - 2 === -1 inconsistency catches developers off guard constantly. Understanding coercion rules lets you use == vs === intentionally, debug unexpected values, and write clearer code.",
    commonPitfalls: [
      "Using == instead of === — 0 == false, '' == false, null == undefined are all true with ==",
      "typeof NaN === 'number' — NaN is a 'Not-a-Number' number, use Number.isNaN()",
      "[] + [] === '' and {} + [] === 0 — object-to-primitive coercion surprises",
      "null + 1 === 1 but undefined + 1 === NaN — null coerces to 0, undefined to NaN",
    ],
    examples: [
      {
        title: "Type coercion rules decoded",
        description: "Visual breakdown of implicit coercion in arithmetic and comparison operators.",
        code: `// ─── Primitives vs Objects ───
const a = "hello";        // primitive string
const b = new String("hello");  // String object
typeof a;                 // "string"
typeof b;                 // "object"
a === "hello";            // true
b === "hello";            // false (different type)

// ─── == triggers coercion, === does not ───
0   == false;    // true  (false → 0)
""  == false;    // true  (both → 0)
"1" == 1;        // true  ("1" → 1)
null == undefined; // true  (special rule)
null == 0;       // false (null only == null/undefined)

0   === false;   // false ← always use ===
"1" === 1;       // false

// ─── + operator: addition vs concatenation ───
1   + 2;         // 3       (number + number)
"1" + 2;         // "12"    (string present → concatenate)
1   + "2";       // "12"
1   + 2 + "3";   // "33"    (left-to-right: 3 then "33")
"1" + 2 + 3;     // "123"   (left-to-right: "12" then "123")

// ─── Arithmetic with non-numbers ───
"5" - 2;         // 3       (- always converts to number)
"5" * "2";       // 10      (* always converts to number)
null + 1;        // 1       (null → 0)
undefined + 1;   // NaN     (undefined → NaN)
[] + [];         // ""      ([] → "" then "" + "" = "")
[] + {};         // "[object Object]"
{} + [];         // 0       ({} treated as block, +[] → 0)

// ─── Falsy / Truthy ───
const falsy = [false, 0, -0, 0n, "", null, undefined, NaN];
falsy.every(v => !v);    // true — all falsy
!!"hello";               // true
!!0;                     // false
!![];                    // true  ← empty array is truthy!
!!{};                    // true  ← empty object is truthy!

// ─── NaN ───
typeof NaN;          // "number" — counterintuitive!
NaN === NaN;         // false — NaN is the only value ≠ itself
Number.isNaN(NaN);   // true ✅
Number.isNaN("foo"); // false ✅ (stricter than global isNaN)
isNaN("foo");        // true  ← "foo" is coerced to NaN first — misleading`,
        language: "javascript",
        output: `TYPE COERCION QUICK REFERENCE
═══════════════════════════════════════════════════
  Expression         Result      Reason
  ──────────────────────────────────────────────────────
  "5" - 2            3           - converts to number
  "5" + 2            "52"        + concatenates strings
  true + true        2           true → 1
  null + 1           1           null → 0
  undefined + 1      NaN         undefined → NaN
  [] + []            ""          [] → ""
  0 == false         true        false → 0
  "" == false        true        both → 0
  null == undefined  true        special rule
  null == 0          false       null only == null/undefined

FALSY VALUES (only 8)
═══════════════════════════════════════════════════
  false, 0, -0, 0n, "", null, undefined, NaN
  Everything else is truthy — including [], {}, "0", " "

TYPEOF TABLE
═══════════════════════════════════════════════════
  typeof 42          "number"
  typeof "hi"        "string"
  typeof true        "boolean"
  typeof undefined   "undefined"
  typeof null        "object"  ← historical bug
  typeof {}          "object"
  typeof []          "object"  ← use Array.isArray()
  typeof function(){} "function"
  typeof Symbol()    "symbol"
  typeof 9n          "bigint"`,
      },
    ],
  },
};

const scopeAndHoisting: TopicNode = {
  id: "js-scope-hoisting",
  title: "Scope, Hoisting & the Temporal Dead Zone",
  iconName: "GitBranch",
  link: "https://developer.mozilla.org/en-US/docs/Glossary/Hoisting",
  theory:
    "Scope determines where variables are accessible. Hoisting is JavaScript's behaviour of moving declarations to the top of their scope before execution. var is function-scoped and fully hoisted; let and const are block-scoped and are hoisted but not initialised — accessing them before their declaration throws a ReferenceError (the Temporal Dead Zone).",
  theoryDetail: {
    keyConcepts: [
      "Global scope: variables accessible everywhere. Function scope: var inside a function stays there. Block scope: let/const inside {} are confined to that block",
      "var hoisting: declarations are moved to the top of the function and initialised to undefined — reads before the line return undefined instead of throwing",
      "let/const hoisting: declarations are hoisted but NOT initialised — the Temporal Dead Zone (TDZ) causes ReferenceError if accessed before declaration",
      "Function declarations are fully hoisted (both name and body) — you can call them before they appear. Function expressions (const f = function(){}) are not",
      "Lexical scope: a function's scope is determined by where it is defined, not where it is called",
    ],
    whyItMatters:
      "Misunderstanding scope is the #1 source of var-related bugs and stale closure traps. Understanding the TDZ explains why 'let and const are safer than var'. Lexical scope is the foundation of closures — the mechanism that makes React hooks, event handlers, and callbacks work.",
    commonPitfalls: [
      "var inside a for loop leaks out of the block — use let for loop variables",
      "Relying on var hoisting produces undefined-reads instead of clear errors — switch to let/const",
      "Calling a function expression before its assignment: 'TypeError: fn is not a function'",
      "const only prevents reassignment — object/array contents can still be mutated",
    ],
    examples: [
      {
        title: "var vs let vs const — scope and hoisting side-by-side",
        description: "Concrete code that demonstrates each scoping rule and the Temporal Dead Zone.",
        code: `// ─── var: function-scoped, hoisted + initialised to undefined ───
function varDemo() {
  console.log(x);  // undefined (NOT ReferenceError — hoisted)
  var x = 10;
  console.log(x);  // 10

  if (true) {
    var y = 20;    // var leaks out of the block!
  }
  console.log(y);  // 20 — y is visible here
}

// ─── let: block-scoped, hoisted but NOT initialised (TDZ) ───
function letDemo() {
  // console.log(a);  // ReferenceError: Cannot access 'a' before initialization
  let a = 10;
  console.log(a);  // 10

  if (true) {
    let b = 20;    // b is confined to this block
  }
  // console.log(b); // ReferenceError: b is not defined
}

// ─── const: same as let but must be initialised, cannot be reassigned ───
const PI = 3.14159;
// PI = 3;          // TypeError: Assignment to constant variable

const obj = { count: 0 };
obj.count++;         // ✅ contents can be mutated
// obj = {};         // ❌ reassignment throws

// ─── Loop variable trap with var ───
const funcs = [];
for (var i = 0; i < 3; i++) {
  funcs.push(() => console.log(i));  // all capture the SAME i
}
funcs[0](); // 3 (not 0!) — i finished at 3
funcs[1](); // 3
funcs[2](); // 3

// ─── Fix with let — each iteration gets its own binding ───
const funcs2 = [];
for (let j = 0; j < 3; j++) {
  funcs2.push(() => console.log(j));  // each captures own j
}
funcs2[0](); // 0 ✅
funcs2[1](); // 1 ✅
funcs2[2](); // 2 ✅

// ─── Function declaration vs expression hoisting ───
sayHi();  // ✅ "Hi!" — function declaration fully hoisted

function sayHi() { console.log("Hi!"); }

// sayBye();  // ❌ TypeError: sayBye is not a function
const sayBye = function() { console.log("Bye!"); };

// ─── Lexical scope (scope is where defined, not where called) ───
const outer = "I'm outer";

function outerFn() {
  const inner = "I'm inner";
  function innerFn() {
    console.log(outer); // ✅ can access outer scope
    console.log(inner); // ✅ can access enclosing scope
  }
  innerFn();
}
// innerFn can't see variables defined after its lexical scope closes`,
        language: "javascript",
        output: `SCOPE COMPARISON
═══════════════════════════════════════════════════
  Keyword  Scope     Hoisted?  Initialised?  Re-assignable?
  ─────────────────────────────────────────────────────────
  var      function  Yes       Yes (undef)   Yes
  let      block     Yes       No  (TDZ)     Yes
  const    block     Yes       No  (TDZ)     No

TEMPORAL DEAD ZONE
═══════════════════════════════════════════════════
  {
    // ← TDZ for 'x' starts here
    console.log(x);  // ReferenceError ← inside TDZ
    let x = 5;       // ← TDZ ends here
    console.log(x);  // 5 ✅
  }

FOR LOOP var TRAP
═══════════════════════════════════════════════════
  // With var: all closures share the same i
  funcs[0]() → 3  (not 0)
  funcs[1]() → 3
  funcs[2]() → 3

  // With let: each iteration creates a new binding
  funcs2[0]() → 0 ✅
  funcs2[1]() → 1 ✅
  funcs2[2]() → 2 ✅`,
      },
    ],
  },
};

const closures: TopicNode = {
  id: "js-closures",
  title: "Closures",
  iconName: "Lock",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
  theory:
    "A closure is a function that remembers the variables from its lexical scope even when it is executed outside that scope. Every function in JavaScript forms a closure over its surrounding scope. This is how private state, factory functions, memoization, and event handlers work.",
  theoryDetail: {
    keyConcepts: [
      "A closure = function + its lexical environment (the scope where it was defined)",
      "Closed-over variables live as long as the closure itself — they don't get garbage-collected",
      "Each function call creates a new closure with its own variable bindings — factories use this",
      "Closures enable the module pattern and private variables in plain JavaScript",
      "React's useState, useEffect callbacks, and event handlers all rely on closures",
    ],
    whyItMatters:
      "Closures are what make JavaScript's functional programming capabilities work. Custom hooks, memoization, debounce/throttle, currying, partial application — all are closures. Understanding them is essential for avoiding stale closure bugs in React (the most common hook mistake).",
    commonPitfalls: [
      "Stale closures in React: useEffect captures the value of state at the time it was created — use functional setState or add to the dependency array",
      "Memory leaks: closures that hold large objects keep those objects alive — common with event listeners not removed on unmount",
      "Sharing state across closures unintentionally — use separate calls to the factory to get independent instances",
    ],
    examples: [
      {
        title: "Closures as private state, factories, and memoization",
        description: "Three real-world closure patterns every JavaScript developer must understand.",
        code: `// ─── 1. Private state (Module Pattern) ───
function createCounter(start = 0) {
  let count = start;  // private — not accessible from outside

  return {
    increment() { count++; },
    decrement() { count--; },
    reset()     { count = start; },
    get value() { return count; },
  };
}

const counter = createCounter(10);
counter.increment();
counter.increment();
console.log(counter.value); // 12
// console.log(count);      // ReferenceError — count is private

// Two independent instances — each has its own closure
const counterA = createCounter(0);
const counterB = createCounter(100);
counterA.increment();        // counterA = 1
console.log(counterB.value); // 100 — unaffected

// ─── 2. Factory / Partial Application ───
function multiplier(factor: number) {
  return (n: number) => n * factor;  // closes over 'factor'
}

const double = multiplier(2);
const triple = multiplier(3);
double(5);  // 10
triple(5);  // 15

// ─── 3. Memoization with closure ───
function memoize<T extends (...args: number[]) => number>(fn: T): T {
  const cache = new Map<string, number>();
  return function(...args: number[]) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      console.log("Cache hit:", key);
      return cache.get(key)!;
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  } as T;
}

const expensiveSquare = memoize((n: number) => {
  console.log("Computing...");
  return n * n;
});

expensiveSquare(4);  // "Computing..." → 16
expensiveSquare(4);  // "Cache hit: [4]" → 16 (instant)
expensiveSquare(9);  // "Computing..." → 81

// ─── 4. Closure-based debounce ───
function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;  // closes over timer

  return function(...args: unknown[]) {
    clearTimeout(timer);                     // cancel previous
    timer = setTimeout(() => fn(...args), delay); // schedule new
  } as T;
}

const onResize = debounce(() => console.log("resized!"), 300);
// window.addEventListener("resize", onResize);
// Only fires 300ms after the last resize event`,
        language: "typescript",
        output: `CLOSURE MEMORY MODEL
═══════════════════════════════════════════════════
  createCounter(10) call creates:
  ┌─────────────────────────────────────────────┐
  │ Closure Environment                          │
  │   count = 10   (private, lives in memory)   │
  │   start = 10   (private)                    │
  └────────────────┬────────────────────────────┘
                   │ captured by
  ┌────────────────▼────────────────────────────┐
  │ Returned object                              │
  │   increment() → count++                     │
  │   decrement() → count--                     │
  │   get value() → count                       │
  └─────────────────────────────────────────────┘

  counter.increment() → count becomes 11
  counter.increment() → count becomes 12
  counter.value       → 12

FACTORY PATTERN
═══════════════════════════════════════════════════
  multiplier(2) → closes over factor=2
  multiplier(3) → closes over factor=3
  double(5) → 5 * 2 = 10
  triple(5) → 5 * 3 = 15
  Each call to multiplier creates a NEW closure

MEMOIZATION RESULT
═══════════════════════════════════════════════════
  expensiveSquare(4) → Computing...   16  (cache miss)
  expensiveSquare(4) → Cache hit: [4] 16  (instant)
  expensiveSquare(9) → Computing...   81  (cache miss)`,
      },
    ],
  },
};

const prototypesAndThis: TopicNode = {
  id: "js-prototypes-this",
  title: "Prototypes, Classes & this",
  iconName: "Box",
  link: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes",
  theory:
    "JavaScript is prototype-based: every object has an internal [[Prototype]] link to another object, forming the prototype chain. Property lookup traverses this chain until found or null is reached. ES6 class syntax is syntactic sugar over prototypal inheritance — the prototype chain still powers it under the hood.",
  theoryDetail: {
    keyConcepts: [
      "Prototype chain: obj → obj.__proto__ → Object.prototype → null — property access traverses upward",
      "Object.create(proto): creates a new object with proto as its prototype — most explicit way to set up inheritance",
      "Constructor functions + new: new binds this to a fresh object, sets its prototype, and returns it",
      "class is syntax sugar: class methods are placed on Class.prototype, not on each instance",
      "this is determined at call time (not definition time) — except for arrow functions, which inherit this lexically",
      "Four ways to set this: implicit binding (obj.method()), explicit (call/apply/bind), new binding, default (undefined in strict mode)",
    ],
    whyItMatters:
      "Lost this is one of the most common JavaScript interview gotchas. Understanding the prototype chain is essential for debugging inherited properties, understanding how Array/Object methods work, and reading framework source code.",
    commonPitfalls: [
      "Passing a method as a callback loses its this: setTimeout(obj.method, 1000) — fix with arrow function or .bind(obj)",
      "Arrow functions have no own this — using them as object methods is wrong when you need this",
      "instanceof checks the prototype chain — can fail across iframes or module boundaries",
      "class fields (count = 0) create instance properties, not prototype properties — each instance gets its own copy",
    ],
    examples: [
      {
        title: "Prototype chain, class syntax, and the four this rules",
        description: "Side-by-side prototype vs class, plus every way this can be determined.",
        code: `// ─── Prototype chain manually ───
const animal = {
  breathe() { return \`\${this.name} breathes\`; },
};

const dog = Object.create(animal);  // dog.__proto__ === animal
dog.name = "Rex";
dog.bark = function() { return "Woof!"; };

dog.breathe();  // "Rex breathes" — found on animal via chain
dog.bark();     // "Woof!" — found on dog directly

// ─── class syntax (same prototype chain underneath) ───
class Animal {
  name: string;
  constructor(name: string) { this.name = name; }
  breathe() { return \`\${this.name} breathes\`; }
}

class Dog extends Animal {
  bark() { return "Woof!"; }
  describe() {
    return \`\${super.breathe()} and barks\`;  // super → Animal.prototype
  }
}

const rex = new Dog("Rex");
rex.breathe();   // "Rex breathes" — inherited from Animal.prototype
rex.bark();      // "Woof!" — on Dog.prototype
rex instanceof Dog;    // true
rex instanceof Animal; // true (chain includes Animal.prototype)

// ─── The four this rules ───

// 1. Implicit binding — this = the object before the dot
const obj = {
  name: "Alice",
  greet() { return \`Hello, \${this.name}\`; },
};
obj.greet();  // "Hello, Alice" — this = obj

// 2. Explicit binding — .call(), .apply(), .bind()
function greet(greeting: string) {
  return \`\${greeting}, \${this.name}\`;
}
greet.call({ name: "Bob" }, "Hi");   // "Hi, Bob"
greet.apply({ name: "Carol" }, ["Hey"]);  // "Hey, Carol"
const boundGreet = greet.bind({ name: "Dave" });
boundGreet("Hello");  // "Hello, Dave"

// 3. new binding — this = new empty object
function Person(name: string) {
  this.name = name;      // this is the new object
  // implicit: return this
}
const p = new Person("Eve");  // p.name === "Eve"

// 4. Default binding — this = undefined (strict) or global
function standalone() { console.log(this); }  // undefined in strict mode

// ─── Arrow functions: lexical this ───
class Timer {
  ticks = 0;

  // ❌ Regular function loses this
  startBad() {
    setInterval(function() {
      this.ticks++;  // this = undefined/global — bug!
    }, 1000);
  }

  // ✅ Arrow function inherits this from Timer instance
  start() {
    setInterval(() => {
      this.ticks++;  // this = Timer instance ✅
    }, 1000);
  }
}`,
        language: "typescript",
        output: `PROTOTYPE CHAIN VISUALISED
═══════════════════════════════════════════════════
  rex (Dog instance)
    └── .name = "Rex"
    └── [[Prototype]] → Dog.prototype
          └── .bark()
          └── [[Prototype]] → Animal.prototype
                └── .breathe()
                └── .constructor = Animal
                └── [[Prototype]] → Object.prototype
                      └── .toString(), .hasOwnProperty(), ...
                      └── [[Prototype]] → null

  rex.bark()    → found on Dog.prototype
  rex.breathe() → not on Dog.prototype, climb → Animal.prototype ✅
  rex.toString()→ not on Animal.prototype, climb → Object.prototype ✅

THE FOUR this RULES (priority order)
═══════════════════════════════════════════════════
  Priority  Rule          Example              this =
  ────────────────────────────────────────────────────────
  1st       new           new Foo()            new empty object
  2nd       Explicit      fn.bind/call/apply   explicitly passed
  3rd       Implicit      obj.fn()             obj
  4th       Default       fn()                 undefined (strict)

ARROW vs REGULAR FUNCTION this
═══════════════════════════════════════════════════
  Regular function: this determined at CALL time
  Arrow function:   this determined at DEFINITION time (lexical)

  class Foo {
    bar() {
      const arrowFn = () => this;   // this = Foo instance (lexical)
      const regFn = function() { return this; }; // this = depends on call
    }
  }`,
      },
    ],
  },
};

export const jsCore: TopicNode = {
  id: "js-core",
  title: "Core JavaScript",
  iconName: "Code",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
  theory:
    "The fundamental building blocks of JavaScript: its type system, how variables are scoped and hoisted, the closure mechanism that powers every callback, and the prototype chain that drives its object model.",
  theoryDetail: {
    keyConcepts: [
      "7 primitive types + objects. Primitives compared by value, objects by reference",
      "== coerces types, === does not — always use ===",
      "var is function-scoped and hoisted; let/const are block-scoped with a Temporal Dead Zone",
      "Closures: functions remember their defining scope — the foundation of private state and callbacks",
      "Prototype chain: property lookup climbs the chain until found or null — class is syntax sugar over this",
    ],
    whyItMatters:
      "These four concepts — types, scope, closures, prototypes — account for the majority of JavaScript interview questions and the vast majority of real bugs.",
    commonPitfalls: [
      "Using == instead of === causes silent type coercion bugs",
      "var leaking outside blocks (use let/const exclusively)",
      "Losing this when passing methods as callbacks",
    ],
  },
  children: [typesAndCoercion, scopeAndHoisting, closures, prototypesAndThis],
};
