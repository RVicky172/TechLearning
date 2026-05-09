import type { TopicNode } from "@/data/types";

export const tsIQEasy: TopicNode = {
  id: "ts-iq-easy",
  title: "Easy",
  iconName: "CircleCheck",
  theory:
    "Foundational TypeScript questions covering basic syntax, core types, and essential concepts. Expected knowledge at all experience levels.",
  theoryDetail: {
    keyConcepts: [
      "TypeScript is a structural type system — compatibility is shape-based, not name-based",
      "Types are erased at runtime — TypeScript types have zero runtime cost",
      "Type inference reduces annotation noise while preserving full type safety",
    ],
    whyItMatters:
      "Easy questions reveal whether a candidate understands TypeScript's core value proposition and can use it without fighting the compiler.",
    commonPitfalls: [
      "Confusing TypeScript types with runtime values — types only exist at compile time",
      "Over-annotating types that TypeScript can already infer",
      "Defaulting to 'any' instead of learning to model the type correctly",
    ],
  },
  children: [
    {
      id: "ts-iq-easy-what-is-ts",
      title: "What is TypeScript?",
      iconName: "FileCode2",
      theory: "A common opener: explain what TypeScript adds to JavaScript and why a team would adopt it.",
      theoryDetail: {
        examples: [
          {
            title: "Q: What is TypeScript and why use it over plain JavaScript?",
            description:
              "TypeScript is a statically-typed superset of JavaScript that compiles to plain JS. It catches bugs at compile time rather than at runtime.",
            code: `// ── Without TypeScript ───────────────────────────────────────────
function greet(user) {
  return 'Hello ' + user.naem; // typo: 'naem' instead of 'name'
  // Discovered at runtime — only when this function is actually called
}

// ── With TypeScript ───────────────────────────────────────────────
interface User {
  id: string;
  name: string;
}

function greet(user: User): string {
  return 'Hello ' + user.naem;
  //                     ^^^^ Compile error: Property 'naem' does not exist on type 'User'
  //                          Caught immediately in your editor, before running anything
}

// ── Key facts ─────────────────────────────────────────────────────
// • TypeScript is a superset: all valid JS is valid TS
// • Types are erased at compile time — zero runtime overhead
// • tsc compiles TypeScript to JavaScript (targets ES5, ES2022, etc.)
// • Works everywhere JS runs: browsers, Node.js, Deno, Bun`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-easy-primitives",
      title: "Primitive Types & Arrays",
      iconName: "Tag",
      theory: "Know all primitive types, how arrays and tuples are typed, and the readonly modifier.",
      theoryDetail: {
        examples: [
          {
            title: "Q: What are TypeScript's primitive types and how do arrays and tuples work?",
            description:
              "Primitives mirror JavaScript: string, number, boolean, null, undefined, bigint, symbol. Arrays fix the element type; tuples fix length and per-element types.",
            code: `// ── Primitives ────────────────────────────────────────────────────
const name: string    = 'Alice';
const age: number     = 30;
const active: boolean = true;
const nothing: null   = null;
const missing: undefined = undefined;
const big: bigint     = 9007199254740993n;
const sym: symbol     = Symbol('id');

// ── Arrays ─────────────────────────────────────────────────────────
const scores: number[]    = [95, 87, 72];
const tags: Array<string> = ['ts', 'react'];   // equivalent syntax
const matrix: number[][]  = [[1, 2], [3, 4]]; // 2D array

// ── Tuples: fixed length + per-index types ──────────────────────────
const point: [number, number]       = [10, 20];
const entry: [string, number]       = ['Alice', 30];
const rgb: [number, number, number] = [255, 128, 0];

// Optional tuple element
const named: [string, number?] = ['Alice']; // second element optional

// ── readonly arrays ────────────────────────────────────────────────
const ids: readonly string[] = ['a', 'b', 'c'];
// ids.push('d'); // ✅ compile error — readonly array cannot be mutated`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-easy-inference",
      title: "Type Inference",
      iconName: "Wand2",
      theory:
        "TypeScript infers types from initializers, return values, and context. Over-annotating wastes effort and makes code verbose.",
      theoryDetail: {
        examples: [
          {
            title: "Q: What is type inference and when should you rely on it?",
            description:
              "TypeScript infers the type from the assigned value. Explicit annotations are needed at function boundaries and when inference would be too wide.",
            code: `// ── Inferred from assignment ──────────────────────────────────────
const name   = 'Alice';         // inferred: string
const count  = 42;              // inferred: number
const active = true;            // inferred: boolean
const tags   = ['ts', 'react']; // inferred: string[]

// ── Annotate function parameters — inference cannot cross call sites
function add(a: number, b: number) { // return type inferred as number
  return a + b;
}

// ── Annotate when widening would lose useful information ───────────
let direction = 'north';            // inferred: string (too wide for a direction)
const direction2 = 'north' as const; // inferred: "north" (literal type — preferred)

// ── Don't annotate what TypeScript can already infer ──────────────
const x: number = 5;          // ❌ redundant annotation

// ── Contextual typing: callback type inferred from the array ───────
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2); // n inferred as number — no annotation needed`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-easy-optional",
      title: "Optional & Default Parameters",
      iconName: "ToggleLeft",
      theory:
        "Optional parameters (?) and default values let functions work with partial input. Both affect the parameter type inside the function body.",
      theoryDetail: {
        examples: [
          {
            title: "Q: What are optional and default parameters in TypeScript?",
            description:
              "Optional parameters have type T | undefined. Default parameters are always T inside the function — never undefined — because the default is used when the argument is omitted.",
            code: `// ── Optional parameter (?:) ────────────────────────────────────────
function greet(name: string, title?: string): string {
  // title is string | undefined inside the function
  if (title) {
    return \`Hello, \${title} \${name}\`;
  }
  return \`Hello, \${name}\`;
}

greet('Alice');          // ✅ title = undefined
greet('Alice', 'Dr.');   // ✅ title = 'Dr.'

// ── Default parameter ────────────────────────────────────────────────
function createUser(name: string, role: string = 'member') {
  // role is always string here — never undefined
  return { name, role };
}

createUser('Alice');           // role = 'member'
createUser('Alice', 'admin');  // role = 'admin'

// ── Optional interface property ──────────────────────────────────────
interface Config {
  host: string;
  port?: number;    // can be omitted from the object literal
  timeout?: number;
}

const cfg: Config = { host: 'localhost' }; // ✅ port and timeout omitted`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-easy-void-never",
      title: "void vs undefined vs never",
      iconName: "MinusCircle",
      theory:
        "Three 'empty' types commonly confused in interviews. void is for functions with no useful return. never is for code paths that never complete.",
      theoryDetail: {
        examples: [
          {
            title: "Q: What is the difference between void, undefined, and never?",
            description:
              "void means no meaningful return value. undefined is the actual value JS returns from void functions. never means the code path cannot complete — it always throws or loops forever.",
            code: `// ── void: function has no meaningful return value ──────────────────
function logMessage(msg: string): void {
  console.log(msg);
  // Implicitly returns undefined, but callers should not use the return value
}

// ── undefined: an actual assignable value ────────────────────────────
function maybeFind(id: string): string | undefined {
  if (id === '1') return 'Alice';
  return undefined; // explicit undefined — callers must handle this
}

// ── never: code path that never completes normally ───────────────────
function fail(message: string): never {
  throw new Error(message); // never returns — always throws
}

function infiniteLoop(): never {
  while (true) { /* never exits */ }
}

// ── never in exhaustive switch statements ─────────────────────────────
type Direction = 'north' | 'south' | 'east' | 'west';

function describe(dir: Direction): string {
  switch (dir) {
    case 'north': return 'Moving north';
    case 'south': return 'Moving south';
    case 'east':  return 'Moving east';
    case 'west':  return 'Moving west';
    default: {
      // dir is narrowed to never here — TypeScript proves all cases are covered
      const _exhaustive: never = dir;
      throw new Error(\`Unknown direction: \${String(_exhaustive)}\`);
    }
  }
}`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
