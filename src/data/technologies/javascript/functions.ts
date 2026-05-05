import type { TopicNode } from "@/data/types";

const functionDeclarations: TopicNode = {
  id: "js-fn-declarations",
  title: "Function Declarations, Expressions & Arrow Functions",
  iconName: "FunctionSquare",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
  theory:
    "JavaScript has three main ways to create functions: declarations (hoisted fully), expressions (assigned to a variable), and arrow functions (concise, lexical this). Each has different scoping, hoisting, and this behaviour that makes each appropriate in different situations.",
  theoryDetail: {
    keyConcepts: [
      "Function declaration: function foo() {} — hoisted with body, can be called before the line it appears",
      "Function expression: const foo = function() {} — not hoisted, must appear before call site",
      "Arrow function: const foo = () => {} — concise, inherits this lexically, no arguments object, cannot be used as constructor",
      "Implicit return: single-expression arrow functions omit return and braces: const double = n => n * 2",
      "Default parameters: function greet(name = 'World') — evaluated each call when argument is undefined",
      "Rest parameters: function sum(...nums) — collects remaining arguments into an array (must be last param)",
    ],
    whyItMatters:
      "Choosing between function declarations and expressions affects testability and hoisting. Arrow functions are the standard for callbacks and React components — but using them as object methods or constructors is a common mistake. Understanding each form helps you read and debug any JavaScript codebase.",
    commonPitfalls: [
      "Arrow functions as object methods: const obj = { count: 0, inc: () => this.count++ } — this is not obj",
      "Arrow functions cannot be constructors: new (() => {}) throws TypeError",
      "Arguments object doesn't exist in arrow functions — use rest parameters ...args instead",
      "Default parameter expressions are evaluated lazily (per call), not once at definition",
    ],
    examples: [
      {
        title: "All function forms with practical comparisons",
        description: "Declaration vs expression vs arrow — hoisting, this, arguments, and implicit return.",
        code: `// ─── Function Declaration (fully hoisted) ───
hoisted();  // ✅ "hoisted!" — works before the declaration
function hoisted() { console.log("hoisted!"); }

// ─── Function Expression (not hoisted) ───
// notHoisted();  // ❌ TypeError: notHoisted is not a function
const notHoisted = function namedExpr() {
  // namedExpr is visible inside itself (useful for recursion)
  console.log("not hoisted");
};
notHoisted(); // ✅

// ─── Arrow Function ───
const add = (a: number, b: number): number => a + b;  // implicit return
const greet = (name: string) => \`Hello, \${name}\`;

// Single param — parens optional (TypeScript requires them for typed params)
const double = (n: number) => n * 2;

// Multi-line body — explicit return needed
const process = (items: number[]) => {
  const filtered = items.filter(n => n > 0);
  return filtered.map(n => n * 2);
};

// ─── Default Parameters ───
function createUser(name: string, role = "viewer", active = true) {
  return { name, role, active };
}
createUser("Alice");              // { name: "Alice", role: "viewer", active: true }
createUser("Bob", "admin");      // { name: "Bob", role: "admin", active: true }
createUser("Carol", undefined, false); // undefined → uses default for role

// Default can be an expression (evaluated each call)
function getId(id = Math.random()) { return id; }
getId();  // different value each call (lazy evaluation)

// ─── Rest Parameters ───
function sum(first: number, ...rest: number[]): number {
  return rest.reduce((acc, n) => acc + n, first);
}
sum(1, 2, 3, 4, 5);  // 15

// ─── Arguments object (only regular functions) ───
function regularArgs() {
  console.log(arguments[0]);  // works — arguments is array-like
}
const arrowArgs = (...args: number[]) => {
  // arguments does not exist here — use rest params
  console.log(args[0]);
};

// ─── IIFE (Immediately Invoked Function Expression) ───
// Creates a private scope that doesn't pollute global
const result = (function () {
  const private_var = "I'm private";
  return { value: private_var };
})();
console.log(result.value); // "I'm private"`,
        language: "typescript",
        output: `HOISTING COMPARISON
═══════════════════════════════════════════════════
  hoisted()         → ✅ works (declaration hoisted with body)
  notHoisted()      → ❌ TypeError (expression not hoisted)
  arrowFn()         → ❌ TypeError (same as expression)

IMPLICIT vs EXPLICIT RETURN
═══════════════════════════════════════════════════
  // Implicit return (one expression)
  const add = (a, b) => a + b;

  // Implicit return of an object MUST wrap in parens
  const toObj = (x) => ({ value: x });   // ✅
  const broken = (x) => { value: x };    // undefined — {} is a block!

  // Explicit return (multi-line)
  const process = (arr) => {
    const filtered = arr.filter(n => n > 0);
    return filtered;  // explicit return required
  };

FUNCTION FORM FEATURE MATRIX
═══════════════════════════════════════════════════
  Feature            Declaration  Expression  Arrow
  ─────────────────────────────────────────────────
  Hoisted?           Yes          No          No
  Own this?          Yes          Yes         No (lexical)
  arguments object?  Yes          Yes         No
  Can be constructor?Yes          Yes         No
  Implicit return?   No           No          Yes (single expr)
  Named for stack?   Yes          Sometimes   No`,
      },
    ],
  },
};

const higherOrder: TopicNode = {
  id: "js-higher-order",
  title: "Higher-Order Functions & Functional Patterns",
  iconName: "Layers",
  link: "https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function",
  theory:
    "JavaScript treats functions as first-class citizens — they can be passed as arguments, returned from other functions, and stored in variables. A higher-order function is any function that takes a function as an argument or returns one. This unlocks the entire functional programming paradigm.",
  theoryDetail: {
    keyConcepts: [
      "map: transforms each element, returns a new array of the same length",
      "filter: keeps elements matching a predicate, returns a new (possibly shorter) array",
      "reduce: folds all elements into a single accumulated value — the most powerful array method",
      "find / findIndex: returns first matching element or -1",
      "some / every: returns boolean if any/all elements match a predicate",
      "Composition: combining functions so the output of one feeds the input of another",
      "Currying: transforming f(a, b) into f(a)(b) — enables partial application",
    ],
    whyItMatters:
      "map/filter/reduce replaced imperative for-loop code in React rendering, data transformation, and API response handling. Currying and composition are behind many utility libraries. Fluent array chaining is the dominant pattern in modern JavaScript.",
    commonPitfalls: [
      "reduce with no initialValue on an empty array throws TypeError — always provide an initial value",
      "map returns the same length — using it when you need to filter+transform, use flatMap instead",
      "Mutating state inside map/filter — these should be pure (no side effects)",
      "forEach returns undefined — cannot be chained; prefer map/filter for transformations",
    ],
    examples: [
      {
        title: "map, filter, reduce, and composition patterns",
        description: "Data transformation pipeline with practical examples and edge-case notes.",
        code: `const products = [
  { id: 1, name: "Laptop",  price: 999, category: "electronics", inStock: true  },
  { id: 2, name: "Shirt",   price: 29,  category: "clothing",     inStock: false },
  { id: 3, name: "Phone",   price: 699, category: "electronics", inStock: true  },
  { id: 4, name: "Jeans",   price: 59,  category: "clothing",     inStock: true  },
  { id: 5, name: "Tablet",  price: 449, category: "electronics", inStock: true  },
];

// ─── map: transform each element ───
const names = products.map(p => p.name);
// ["Laptop", "Shirt", "Phone", "Jeans", "Tablet"]

const withTax = products.map(p => ({
  ...p,
  priceWithTax: +(p.price * 1.2).toFixed(2),
}));

// ─── filter: keep matching elements ───
const inStock    = products.filter(p => p.inStock);
const electronics = products.filter(p => p.category === "electronics");
const affordable  = products.filter(p => p.price < 500);

// ─── Chaining ───
const affordableElectronics = products
  .filter(p => p.category === "electronics" && p.inStock)
  .filter(p => p.price < 500)
  .map(p => ({ name: p.name, price: p.price }));
// [{ name: "Tablet", price: 449 }]

// ─── reduce: the most flexible ───

// Sum of all prices
const total = products.reduce((sum, p) => sum + p.price, 0);  // 2235

// Group by category
const byCategory = products.reduce((acc, p) => {
  const key = p.category;
  acc[key] = acc[key] ?? [];
  acc[key].push(p);
  return acc;
}, {} as Record<string, typeof products>);

// Flat array of names in stock (flatMap = map + flat)
const stockedNames = products
  .filter(p => p.inStock)
  .map(p => p.name);  // or: .flatMap(p => p.inStock ? [p.name] : [])

// ─── Currying & Partial Application ───
const multiply = (factor: number) => (n: number) => n * factor;
const double   = multiply(2);
const triple   = multiply(3);
[1, 2, 3, 4].map(double);  // [2, 4, 6, 8]
[1, 2, 3, 4].map(triple);  // [3, 6, 9, 12]

// ─── Function Composition ───
const pipe = <T>(...fns: Array<(arg: T) => T>) =>
  (value: T): T => fns.reduce((v, fn) => fn(v), value);

const processPrice = pipe(
  (n: number) => n * 1.2,         // add 20% tax
  (n: number) => Math.round(n),   // round to integer
  (n: number) => Math.max(n, 1),  // minimum price of 1
);
processPrice(29.99);  // 36`,
        language: "typescript",
        output: `DATA TRANSFORMATION PIPELINE
═══════════════════════════════════════════════════
  products (5 items)
    ↓ .filter(electronics && inStock)   → 3 items (Laptop, Phone, Tablet)
    ↓ .filter(price < 500)              → 1 item  (Tablet)
    ↓ .map(name, price)                 → [{name:"Tablet", price:449}]

REDUCE EXAMPLES
═══════════════════════════════════════════════════
  // Sum
  reduce((sum, p) => sum + p.price, 0)
  Step 1: 0   + 999 = 999
  Step 2: 999 + 29  = 1028
  Step 3: 1028 + 699 = 1727
  Step 4: 1727 + 59  = 1786
  Step 5: 1786 + 449 = 2235  ← total

  // Group by category
  {
    electronics: [Laptop, Phone, Tablet],
    clothing:    [Shirt, Jeans]
  }

WHEN TO USE EACH
═══════════════════════════════════════════════════
  map       → transform every element, same length output
  filter    → subset of elements matching a condition
  reduce    → single value from all elements (sum, group, flatten)
  find      → first matching element (or undefined)
  some      → does any element match? (short-circuits)
  every     → do all elements match? (short-circuits)
  flatMap   → map then flatten one level (removes undefined/empty)
  forEach   → side effects only (logging, DOM updates) — not chainable`,
      },
    ],
  },
};

export const jsFunctions: TopicNode = {
  id: "js-functions",
  title: "Functions & Functional Patterns",
  iconName: "FunctionSquare",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions",
  theory:
    "Functions are first-class citizens in JavaScript — they can be stored, passed, and returned like any value. This enables higher-order programming, closures, composition, and the entire functional programming paradigm that modern JavaScript and React rely on.",
  theoryDetail: {
    keyConcepts: [
      "Three forms: declaration (hoisted), expression (not hoisted), arrow (lexical this, no arguments)",
      "Higher-order functions: map, filter, reduce — the backbone of data transformation",
      "Currying and partial application: pre-fill arguments to create specialised functions",
      "Pure functions: same input → same output, no side effects — essential for predictability and testing",
    ],
    whyItMatters:
      "Functional patterns are the primary programming style in modern JavaScript and React. map/filter/reduce eliminate most imperative loops. Arrow functions eliminated most .bind() calls. Currying powers utility libraries.",
    commonPitfalls: [
      "Arrow functions as object methods — no own this, use regular function instead",
      "Forgetting the initial value in reduce — throws on empty arrays",
    ],
  },
  children: [functionDeclarations, higherOrder],
};
