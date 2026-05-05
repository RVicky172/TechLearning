import type { TopicNode } from "@/data/types";

const destructuringAndSpread: TopicNode = {
  id: "js-destructuring-spread",
  title: "Destructuring, Spread & Rest",
  iconName: "Braces",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment",
  theory:
    "Destructuring extracts values from arrays or properties from objects into distinct variables. The spread operator (...) expands iterables/objects in-place. Rest (...) collects remaining elements into an array or object. These three related features massively reduce boilerplate in modern JavaScript.",
  theoryDetail: {
    keyConcepts: [
      "Array destructuring: const [a, b] = [1, 2] — matched by position",
      "Object destructuring: const { name, age } = user — matched by key name",
      "Rename during destructure: const { name: userName } = user — userName is the local variable",
      "Default values: const { role = 'viewer' } = user — used when the value is undefined",
      "Rest in destructuring: const { a, ...rest } = obj — rest is all remaining properties",
      "Spread in array: [...arr1, ...arr2] — shallow merge. In object: { ...obj1, ...obj2 } — right side wins on conflicts",
      "Nested destructuring: const { address: { city } } = user — reaches into nested objects",
    ],
    whyItMatters:
      "Destructuring is used in every modern React component: function Props({ name, onChange, children }), useState return, useContext. Spread/rest is used for immutable state updates, merging configs, and building variadic functions.",
    commonPitfalls: [
      "Destructuring undefined throws: const { name } = undefined — guard with optional chaining or default: const { name } = user ?? {}",
      "Spread is shallow: { ...obj } only copies one level — nested objects are still shared references",
      "Order matters in object spread: { defaults, ...overrides } — overrides wins; { ...overrides, defaults } — defaults wins",
    ],
    examples: [
      {
        title: "Destructuring and spread in real-world patterns",
        description: "All destructuring forms with React-relevant examples and common gotchas.",
        code: `// ─── Array Destructuring ───
const [first, second, ...remaining] = [10, 20, 30, 40, 50];
// first=10, second=20, remaining=[30,40,50]

// Skip elements with commas
const [,, third] = [1, 2, 3];  // third=3

// Swap without temp variable
let a = 1, b = 2;
[a, b] = [b, a];  // a=2, b=1

// Default values
const [x = 0, y = 0] = [5];  // x=5, y=0

// ─── Object Destructuring ───
const user = { id: 1, name: "Alice", role: "admin", age: 30 };

const { name, role } = user;      // name="Alice", role="admin"
const { name: userName } = user;  // rename: userName="Alice"
const { country = "US" } = user;  // default: country="US" (not in object)

// ─── Nested destructuring ───
const config = {
  server: { host: "localhost", port: 3000 },
  db: { name: "mydb", pool: 5 },
};
const { server: { host, port }, db: { name: dbName } } = config;
// host="localhost", port=3000, dbName="mydb"

// ─── Rest in object destructuring ───
const { id, ...userWithoutId } = user;
// id=1, userWithoutId={ name:"Alice", role:"admin", age:30 }

// ─── Function parameter destructuring (React pattern) ───
function UserCard({ name, role = "viewer", onClick }: {
  name: string;
  role?: string;
  onClick: () => void;
}) {
  return \`\${name} (\${role})\`;
}

// ─── Spread operator ───

// Array spread: shallow copy, merge
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const merged = [...arr1, ...arr2];       // [1,2,3,4,5,6]
const copy   = [...arr1];               // new array (shallow copy)
const withExtra = [0, ...arr1, 4];     // [0,1,2,3,4]

// Object spread: shallow copy, merge (right side wins)
const defaults = { theme: "dark", lang: "en", fontSize: 14 };
const overrides = { theme: "light", fontSize: 16 };
const settings = { ...defaults, ...overrides };
// { theme:"light", lang:"en", fontSize:16 }

// ─── Immutable state update pattern (React) ───
const state = { user: { name: "Alice" }, count: 0, items: [1, 2, 3] };

// Update a field immutably
const newState = { ...state, count: state.count + 1 };

// Update nested — must spread each level
const updatedUser = {
  ...state,
  user: { ...state.user, name: "Bob" },  // shallow spread doesn't reach nested
};

// Add to array immutably
const withNewItem = { ...state, items: [...state.items, 4] };

// Remove from array immutably
const withoutFirst = { ...state, items: state.items.filter(n => n !== 1) };`,
        language: "typescript",
        output: `DESTRUCTURING QUICK REFERENCE
═══════════════════════════════════════════════════
  const [a, b, ...rest] = [1, 2, 3, 4]
  → a=1, b=2, rest=[3,4]

  const { x, y = 0, z: renamed } = { x: 1, z: 99 }
  → x=1, y=0 (default), renamed=99

  const { a, ...remaining } = { a: 1, b: 2, c: 3 }
  → a=1, remaining={b:2, c:3}

SPREAD MERGE PRIORITY
═══════════════════════════════════════════════════
  const a = { x: 1, y: 2 };
  const b = { y: 99, z: 3 };

  { ...a, ...b }  → { x:1, y:99, z:3 }  (b wins — rightmost)
  { ...b, ...a }  → { x:1, y:2,  z:3 }  (a wins — rightmost)

SHALLOW COPY WARNING
═══════════════════════════════════════════════════
  const original = { a: { nested: 1 } };
  const copy = { ...original };

  copy.a === original.a  // true — same reference!
  copy.a.nested = 99;
  original.a.nested      // 99 ← mutated the original!

  Fix: spread each nested level, or use structuredClone()

REACT STATE UPDATE PATTERNS
═══════════════════════════════════════════════════
  // ✅ Immutable update
  setState(prev => ({ ...prev, count: prev.count + 1 }))

  // ✅ Immutable array add
  setState(prev => ({ ...prev, items: [...prev.items, newItem] }))

  // ✅ Immutable array remove
  setState(prev => ({ ...prev, items: prev.items.filter(i => i.id !== id) }))`,
      },
    ],
  },
};

const modernOperators: TopicNode = {
  id: "js-modern-operators",
  title: "Modern Operators & Patterns",
  iconName: "Wand2",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining",
  theory:
    "ES2020+ introduced a set of operators that dramatically reduce defensive programming boilerplate: optional chaining (?.) for safe property access, nullish coalescing (??) for null-safe defaults, and logical assignment (&&=, ||=, ??=) for conditional assignment. Together they replace most if/else null-checks.",
  theoryDetail: {
    keyConcepts: [
      "Optional chaining (?.): short-circuits to undefined if the left side is null or undefined — no more 'Cannot read property of undefined'",
      "Nullish coalescing (??): returns the right side only when the left is null or undefined — unlike ||, it doesn't trigger on 0, false, or ''",
      "Nullish assignment (??=): assigns only if the variable is null/undefined",
      "Logical OR assignment (||=): assigns only if the variable is falsy (0, '', false also trigger)",
      "Logical AND assignment (&&=): assigns only if the variable is truthy",
      "Object.hasOwn(obj, key): the modern replacement for obj.hasOwnProperty(key) — safe on null-prototype objects",
    ],
    whyItMatters:
      "Optional chaining eliminated dozens of lines of defensive null-checks in every codebase. Nullish coalescing fixed the long-standing || bug where 0 and '' were incorrectly treated as missing values. These operators appear in virtually every modern JavaScript codebase.",
    commonPitfalls: [
      "?? vs || : user.age ?? 18 — if age is 0, returns 0 (correct). user.age || 18 — if age is 0, returns 18 (wrong!)",
      "Optional chaining on function calls: fn?.() calls fn only if it's not null/undefined",
      "Chaining too deeply: a?.b?.c?.d?.e — may indicate a design problem; consider restructuring data",
    ],
    examples: [
      {
        title: "Optional chaining, nullish coalescing, and logical assignment",
        description: "The operators that eliminated defensive null-checking boilerplate.",
        code: `// ─── Before optional chaining (old, verbose) ───
function getCityOld(user: any): string {
  if (user && user.address && user.address.city) {
    return user.address.city;
  }
  return "Unknown";
}

// ─── After: optional chaining + nullish coalescing ───
function getCity(user: any): string {
  return user?.address?.city ?? "Unknown";
}

// Works correctly for all cases:
getCity(null);                             // "Unknown"
getCity({});                               // "Unknown"
getCity({ address: null });                // "Unknown"
getCity({ address: { city: "London" } }); // "London"

// ─── Optional chaining on arrays and methods ───
const users = [{ name: "Alice" }, null];
users[0]?.name;          // "Alice"
users[1]?.name;          // undefined (no throw)
users[1]?.name ?? "N/A"; // "N/A"

// Optional method calls
const maybeArr: number[] | null = null;
maybeArr?.map(n => n * 2);  // undefined (no "cannot read map of null")
maybeArr?.length ?? 0;      // 0

// Optional function call
type Handler = (() => void) | undefined;
const onClick: Handler = undefined;
onClick?.();  // no-op, no throw

// ─── ?? vs || (critical difference) ───
const score = 0;
score || 100;   // 100 ← WRONG: 0 is falsy, treated as "missing"
score ?? 100;   // 0   ← CORRECT: 0 is not null/undefined

const label = "";
label || "Default";  // "Default" ← WRONG if "" is a valid value
label ?? "Default";  // ""        ← CORRECT

// ─── Nullish assignment (?? =) ───
let config: Partial<{ timeout: number; retries: number }> = { timeout: 5000 };
config.timeout ??= 3000;  // already set → stays 5000
config.retries ??= 3;     // was undefined → becomes 3

// ─── Logical OR assignment (||=) ───
let name = "";
name ||= "Anonymous";  // "" is falsy → "Anonymous"

// ─── Logical AND assignment (&&=) ───
let isAdmin = true;
isAdmin &&= checkPermissions();  // only calls checkPermissions() if isAdmin is truthy

// ─── Object.hasOwn (modern hasOwnProperty) ───
const obj = { a: 1 };
Object.hasOwn(obj, "a");           // true
Object.hasOwn(obj, "toString");    // false (inherited, not own)
"a" in obj;                        // true (checks prototype chain too)

// ─── Structured clone (deep copy) ───
const original = { nested: { value: 42 }, arr: [1, 2, 3] };
const deepCopy = structuredClone(original);  // ES2022 — truly deep clone
deepCopy.nested.value = 99;
original.nested.value;  // still 42 ✅`,
        language: "typescript",
        output: `?? vs || COMPARISON
═══════════════════════════════════════════════════
  Value       || "default"    ?? "default"
  ─────────────────────────────────────────────────
  null        "default"       "default"
  undefined   "default"       "default"
  0           "default" ❌    0       ✅
  ""          "default" ❌    ""      ✅
  false       "default" ❌    false   ✅
  NaN         "default" ❌    NaN     ✅
  "text"      "text"          "text"

  Use ?? when 0, "", and false are valid values.
  Use || only when those falsy values should also use the default.

OPTIONAL CHAINING BEHAVIOUR
═══════════════════════════════════════════════════
  obj?.prop         → undefined if obj is null/undefined
  obj?.method()     → undefined if obj is null/undefined
  arr?.[0]          → undefined if arr is null/undefined
  fn?.()            → undefined if fn is null/undefined

  Short-circuits the entire expression:
  null?.a.b.c       → undefined (doesn't throw on .b.c)

LOGICAL ASSIGNMENT
═══════════════════════════════════════════════════
  a ??= b   → a = a ?? b   (assign if null/undefined)
  a ||= b   → a = a || b   (assign if falsy)
  a &&= b   → a = a && b   (assign if truthy)

  // ??= is equivalent to:
  if (a === null || a === undefined) a = b;`,
      },
    ],
  },
};

const modules: TopicNode = {
  id: "js-modules",
  title: "ES Modules",
  iconName: "Package",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
  theory:
    "ES Modules (ESM) are the official JavaScript module standard — using import/export syntax. They replaced CommonJS (require/module.exports) in browser environments and are increasingly used in Node.js. Modules are always in strict mode, have their own scope, and are evaluated once and cached.",
  theoryDetail: [
    "Named exports: export const fn = () => {} — import { fn } from './file'. Multiple per file",
    "Default export: export default class Foo {} — import Foo from './file'. One per file",
    "Re-exports: export { fn } from './other' — useful for barrel (index) files",
    "Dynamic import: const mod = await import('./module') — lazy loading, code splitting",
    "Tree shaking: bundlers (webpack, Vite) eliminate unused named exports — default exports are harder to tree-shake",
    "import.meta.url: absolute URL of the current module — useful in Node.js for __dirname equivalent",
  ].map(s => s) as unknown as TopicNode["theoryDetail"] & { keyConcepts: string[] } extends never ? undefined : NonNullable<TopicNode["theoryDetail"]>,
  children: [],
};

// Override to proper theoryDetail shape
const modulesNode: TopicNode = {
  id: "js-modules",
  title: "ES Modules",
  iconName: "Package",
  link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules",
  theory:
    "ES Modules are the official JavaScript module standard. They use static import/export syntax, enabling tree-shaking, circular dependency detection, and top-level await. Every file is its own scope — no global leakage.",
  theoryDetail: {
    keyConcepts: [
      "Named exports: export const fn = () => {} — import { fn } from './file'",
      "Default export: export default class — import Anything from './file' (one per file)",
      "Re-export (barrel): export { fn } from './module' — aggregate related exports in index.ts",
      "Dynamic import: const { fn } = await import('./module') — lazy load, code splitting",
      "Modules are singletons: evaluated once and cached — the same export object is shared",
      "ESM is always strict mode — no 'with', no undeclared variables",
    ],
    whyItMatters:
      "ES Modules are the foundation of every modern bundler (Vite, webpack, esbuild). Named exports enable tree-shaking — unused exports are eliminated from bundles. Barrel files (index.ts) organise and re-export modules for cleaner imports.",
    commonPitfalls: [
      "Circular imports: A imports B which imports A — modules resolve but may get undefined at import time",
      "Default export + tree-shaking: bundlers can't easily eliminate parts of a default export — prefer named exports for utilities",
      "import * as ns: imports the entire namespace — prevents tree-shaking for that dependency",
      "CJS interop: require() and import mix inconsistently — use .mjs/.cjs extensions or package.json 'type: module'",
    ],
    examples: [
      {
        title: "Named vs default exports, barrel files, and dynamic imports",
        description: "Modern module patterns used in every Next.js and Vite project.",
        code: `// ─── math.ts — Named exports ───
export const PI = 3.14159;
export function add(a: number, b: number) { return a + b; }
export function multiply(a: number, b: number) { return a * b; }

// ─── logger.ts — Default export ───
export default class Logger {
  log(msg: string) { console.log(\`[LOG] \${msg}\`); }
}

// ─── utils/index.ts — Barrel file (re-exports) ───
export { add, multiply, PI } from "./math";
export { default as Logger }  from "./logger";
export type { User }          from "./types";  // type-only re-export

// ─── main.ts — Importing ───
import { add, PI }  from "./utils";           // named import
import Logger       from "./logger";           // default import
import * as Math    from "./math";             // namespace import (avoid — hurts tree-shaking)
import { add as sum } from "./math";           // rename on import

console.log(add(1, 2));   // 3
console.log(PI);          // 3.14159
Math.multiply(3, 4);      // 12

// ─── Dynamic imports (lazy loading) ───
async function loadChart() {
  // Module is only downloaded when this function runs
  const { Chart } = await import("./Chart");
  return new Chart();
}

// ─── Type-only imports (TypeScript) ───
import type { User } from "./types";  // erased at compile time, no runtime cost

// ─── Conditional import pattern ───
const isBrowser = typeof window !== "undefined";
const storage = isBrowser
  ? (await import("./browserStorage")).default
  : (await import("./serverStorage")).default;

// ─── import.meta (ES module metadata) ───
console.log(import.meta.url);  // "file:///path/to/module.js"
// Node.js: use import.meta.url instead of __dirname
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);`,
        language: "typescript",
        output: `NAMED vs DEFAULT EXPORTS
═══════════════════════════════════════════════════
  Named:   export const fn = () => {}
           import { fn } from './file'      ← name must match
           import { fn as alias } from './file'

  Default: export default fn
           import ANYTHING from './file'    ← any name works
           import { default as fn } from './file'

  Per file: unlimited named exports, ONE default

TREE SHAKING IMPACT
═══════════════════════════════════════════════════
  // Named exports — bundler can eliminate unused ones
  export const a = () => {};  // used → included
  export const b = () => {};  // unused → ELIMINATED ✅

  // Default export object — bundler cannot eliminate parts
  export default { a: () => {}, b: () => {} };  // entire object included

  Recommendation: prefer named exports for utility files

BARREL FILE PATTERN
═══════════════════════════════════════════════════
  // Before (many imports)
  import { add }     from "../utils/math";
  import { format }  from "../utils/format";
  import { debounce } from "../utils/debounce";

  // After (barrel index.ts re-exports all)
  import { add, format, debounce } from "../utils";

  ⚠️ Large barrel files can slow down bundler analysis.
     Use path-specific imports in perf-sensitive apps.`,
      },
    ],
  },
};

export const jsModern: TopicNode = {
  id: "js-modern",
  title: "Modern JavaScript (ES6+)",
  iconName: "Sparkles",
  link: "https://tc39.es/ecma262/",
  theory:
    "ES6 (2015) and subsequent yearly releases transformed JavaScript. Destructuring, spread/rest, optional chaining, nullish coalescing, ES Modules, template literals, and logical assignment operators are now the baseline for all modern JavaScript development.",
  theoryDetail: {
    keyConcepts: [
      "Destructuring: extract array/object values into named variables, with defaults and renaming",
      "Spread (...): expand arrays/objects in-place. Rest (...): collect remaining into an array",
      "Optional chaining (?.) and nullish coalescing (??): eliminate defensive null-checking boilerplate",
      "ES Modules: static import/export — the foundation of tree-shaking and code splitting",
    ],
    whyItMatters:
      "These features are not optional in modern code — they are the current idiom. Reading or writing any React, Node.js, or Next.js codebase requires fluency with all of them.",
    commonPitfalls: [
      "?? vs ||: use ?? when 0, '', and false are valid values",
      "Spread is shallow — nested objects are still shared references",
    ],
  },
  children: [destructuringAndSpread, modernOperators, modulesNode],
};
