import type { TopicNode } from "@/data/types";

export const tsFunctions: TopicNode = {
  id: "ts-functions",
  title: "Functions & Type Safety",
  iconName: "FunctionSquare",
  theory:
    "TypeScript brings full type safety to function parameters, return values, and higher-order functions — the backbone of any application.",
  theoryDetail: {
    keyConcepts: [
      "Annotate every parameter and return type for maximum tooling support",
      "Function overloads let you express multiple call signatures for one implementation",
      "Rest parameters type as an array; spread preserves tuple element types",
    ],
    whyItMatters:
      "Functions are the primary unit of code reuse. Typed functions make refactoring safe — changing a signature immediately surfaces every call site that needs updating.",
    commonPitfalls: [
      "Forgetting to type the return value, letting TypeScript infer 'void' when you meant 'Promise<void>'",
      "Writing overly wide parameter types (any[]) that erase the benefit of type checking",
      "Not using 'never' for exhaustive checks in switch statements over discriminated unions",
    ],
  },
  children: [
    {
      id: "ts-func-signatures",
      title: "Function Signatures & Return Types",
      iconName: "ArrowRight",
      link: "https://www.typescriptlang.org/docs/handbook/2/functions.html",
      theory:
        "Explicit parameter and return type annotations make function contracts clear and enable rich IDE autocomplete and error detection.",
      theoryDetail: {
        keyConcepts: [
          "Parameters: (name: string, age: number) — annotate each individually",
          "Return type after the closing parenthesis: function greet(): string",
          "Optional parameters with '?': (name?: string); default values infer the type",
        ],
        whyItMatters:
          "Typed signatures are the API contract of your function. They let callers know exactly what to pass and what to expect back without reading the implementation.",
        commonPitfalls: [
          "Omitting the return type and relying on inference — inference breaks if you add an early return with a different type",
          "Using null and undefined inconsistently in optional parameters",
          "Declaring a parameter as 'any' to skip type modeling — use 'unknown' + narrowing instead",
        ],
        examples: [
          {
            title: "Complete function signature patterns",
            description:
              "Optional params, defaults, rest args, callbacks, and void vs never return types.",
            code: `// ─── Basic annotation ───
function greet(name: string, greeting: string = "Hello"): string {
  return \`\${greeting}, \${name}!\`;
}

// ─── Optional parameter — may be undefined ───
function log(message: string, level?: "info" | "warn" | "error"): void {
  console[level ?? "info"](message);
}

// ─── Rest parameters — typed as array ───
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

// ─── Callback parameter with explicit type ───
function fetchAndProcess(
  url: string,
  onSuccess: (data: unknown) => void,
  onError: (err: Error) => void
): Promise<void> {
  return fetch(url)
    .then((r) => r.json())
    .then(onSuccess)
    .catch(onError);
}

// ─── never: function that never returns (throws always) ───
function fail(message: string): never {
  throw new Error(message);
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-func-overloads",
      title: "Function Overloads",
      iconName: "Layers",
      link: "https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads",
      theory:
        "Overloads declare multiple signatures for the same function so callers get precise return types based on the arguments they pass.",
      theoryDetail: {
        keyConcepts: [
          "Write two or more overload signatures above the implementation signature",
          "The implementation signature is not visible to callers — it must be compatible with all overloads",
          "Use overloads when the return type genuinely depends on input types; otherwise use a union return type",
        ],
        whyItMatters:
          "Overloads let a single function handle multiple argument shapes while still giving callers an exact, narrow return type — critical for libraries and SDK design.",
        commonPitfalls: [
          "Making the implementation signature too narrow — it must cover every overload's parameter types",
          "Using overloads when conditional types or generics would be cleaner",
          "Ordering overloads from most specific to least specific — TypeScript matches the first compatible one",
        ],
        examples: [
          {
            title: "Typed event emitter with overloads",
            description:
              "Each event name returns the exact event payload type without losing type information.",
            code: `type EventMap = {
  click: MouseEvent;
  keydown: KeyboardEvent;
  resize: UIEvent;
};

// ─── Overload signatures (visible to callers) ───
function on(event: "click", handler: (e: MouseEvent) => void): void;
function on(event: "keydown", handler: (e: KeyboardEvent) => void): void;
function on(event: "resize", handler: (e: UIEvent) => void): void;

// ─── Implementation signature (not visible to callers) ───
function on(
  event: keyof EventMap,
  handler: (e: EventMap[keyof EventMap]) => void
): void {
  window.addEventListener(event, handler as EventListener);
}

// ✅ handler is (e: MouseEvent) => void — no cast needed
on("click", (e) => console.log(e.clientX, e.clientY));`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-func-async",
      title: "Async Functions & Promise Types",
      iconName: "Clock",
      link: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html",
      theory:
        "async/await in TypeScript always returns a Promise. Typing async functions correctly ensures downstream consumers know what they will receive.",
      theoryDetail: {
        keyConcepts: [
          "An async function with return type T implicitly returns Promise<T>",
          "Awaiting a Promise<T> yields T — TypeScript infers this automatically",
          "Use Promise.allSettled for concurrent calls when you need all results even on failure",
        ],
        whyItMatters:
          "Untyped async code is where 'undefined is not a function' runtime errors hide. Typed Promises surface these errors at compile time before they reach production.",
        commonPitfalls: [
          "Forgetting to await a Promise — the value is then Promise<T> not T",
          "Not catching rejections in async functions — unhandled rejections crash Node.js processes",
          "Using Promise<any> as a shortcut — the caller loses all type information about the resolved value",
        ],
        examples: [
          {
            title: "Concurrent typed requests with error handling",
            description:
              "Promise.all preserves tuple types; Promise.allSettled handles partial failures safely.",
            code: `type User = { id: string; name: string };
type Post = { id: string; title: string; authorId: string };

async function fetchUser(id: string): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error(\`User \${id} not found\`);
  return res.json() as Promise<User>;
}

async function fetchPost(id: string): Promise<Post> {
  const res = await fetch(\`/api/posts/\${id}\`);
  if (!res.ok) throw new Error(\`Post \${id} not found\`);
  return res.json() as Promise<Post>;
}

// ─── Promise.all: all-or-nothing, typed tuple result ───
async function fetchUserAndPost(userId: string, postId: string) {
  const [user, post] = await Promise.all([
    fetchUser(userId),
    fetchPost(postId),
  ]); // [User, Post] — TypeScript infers the tuple
  return { user, post };
}

// ─── Promise.allSettled: partial success, each result is typed ───
async function fetchAll(ids: string[]) {
  const results = await Promise.allSettled(ids.map(fetchUser));
  return results.map((r) =>
    r.status === "fulfilled" ? r.value : null // r.value is User
  );
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-func-composition",
      title: "Higher-Order Functions & Composition",
      iconName: "Workflow",
      link: "https://www.typescriptlang.org/docs/handbook/2/functions.html",
      theory:
        "Higher-order functions take or return other functions. TypeScript preserves input and output types across function transformations using generics.",
      theoryDetail: {
        keyConcepts: [
          "A HOF that wraps a function must keep T generic to preserve the wrapped type",
          "Typed middleware pattern: (req, res, next) => void with explicit typed params",
          "Memoize preserves the exact function signature using Parameters<F> and ReturnType<F>",
        ],
        whyItMatters:
          "Typed HOFs let you add cross-cutting concerns (logging, memoization, retry) to any function without weakening its type contract.",
        commonPitfalls: [
          "Losing the original return type by annotating the wrapper as (...args: any[]) => any",
          "Not forwarding 'this' context when wrapping class methods",
          "Missing edge cases in memoization keys when arguments are objects",
        ],
        examples: [
          {
            title: "Type-safe memoization wrapper",
            description:
              "Wraps any function with result caching while preserving the exact signature.",
            code: `function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R
): (...args: Args) => R {
  const cache = new Map<string, R>();
  return (...args: Args): R => {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key)!;
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

function expensiveCalc(x: number, y: number): number {
  return x ** y;
}

const cachedCalc = memoize(expensiveCalc);
// cachedCalc has exact type (x: number, y: number) => number`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
