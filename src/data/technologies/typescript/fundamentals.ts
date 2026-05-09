import type { TopicNode } from "@/data/types";

export const tsFundamentals: TopicNode = {
  id: "ts-basics",
  title: "TypeScript Fundamentals",
  iconName: "BookOpen",
  theory:
    "TypeScript adds optional static types to JavaScript. Start here to understand how type annotations work and why they make your code more maintainable.",
  theoryDetail: {
    keyConcepts: [
      "TypeScript is a superset of JavaScript — all valid JS is valid TS",
      "Types are erased at compile time; the runtime is pure JavaScript",
      "tsc compiles TypeScript; tsconfig.json controls strictness, module format, and output",
    ],
    whyItMatters:
      "TypeScript catches type errors, undefined property access, and wrong argument types before they reach production — acting as a fast, always-on first-pass test suite.",
    commonPitfalls: [
      "Defaulting to 'any' to silence errors — this disables type checking entirely",
      "Not enabling 'strict: true' in tsconfig, missing null checks and other safety rules",
      "Over-annotating types that TypeScript can already infer — trust the compiler",
    ],
  },
  children: [
    {
      id: "ts-types",
      title: "Basic Types",
      iconName: "Tag",
      link: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html",
      theory:
        "TypeScript supports primitives like string, number, boolean, arrays, tuples, and special types like any, unknown, and never.",
      theoryDetail: {
        keyConcepts: [
          "Primitives: string, number, boolean, bigint, symbol, null, undefined",
          "Arrays: string[] or Array<string>; Tuples fix length and types: [string, number]",
          "'unknown' requires narrowing before use; 'never' represents unreachable code paths",
        ],
        whyItMatters:
          "Getting basic types right eliminates the most common runtime errors — undefined.length, calling a number as a function, or mismatching string and number IDs.",
        commonPitfalls: [
          "Using 'any' when 'unknown' is more appropriate — unknown forces type checking before use",
          "Forgetting null and undefined are distinct types under strictNullChecks",
          "Using the broad 'object' type instead of a specific interface or Record type",
        ],
        examples: [
          {
            title: "Primitives, arrays, tuples, and special types",
            description:
              "A practical cheatsheet of every basic type with real usage patterns.",
            code: `// ─── Primitives ───
const name: string = "Alice";
const age: number = 30;
const active: boolean = true;
const id: bigint = 9007199254740991n;

// ─── Arrays ───
const tags: string[] = ["ts", "react"];
const scores: Array<number> = [95, 87, 100];

// ─── Tuples — fixed length + types ───
const coord: [number, number] = [40.71, -74.01];
const entry: [string, number] = ["Alice", 30];

// ─── unknown — safe catch-all; must narrow before use ───
function processInput(value: unknown): string {
  if (typeof value === "string") return value.toUpperCase();
  if (typeof value === "number") return value.toFixed(2);
  return String(value);
}

// ─── never — exhaustiveness guard ───
type Shape = "circle" | "square";
function assertNever(x: never): never {
  throw new Error("Unhandled shape: " + x);
}
function area(shape: Shape, size: number): number {
  switch (shape) {
    case "circle":  return Math.PI * size ** 2;
    case "square":  return size ** 2;
    default:        return assertNever(shape); // TS error if a case is missing
  }
}`,
            language: "ts",
          },
          {
            title: "Modeling API input with safe primitives",
            description:
              "Use unknown at boundaries, then narrow to a precise object shape before consuming fields.",
            code: `type CreateUserInput = {
  name: string;
  age: number;
  tags: string[];
};

function parseCreateUser(body: unknown): CreateUserInput {
  if (
    typeof body === "object" &&
    body !== null &&
    "name" in body &&
    "age" in body &&
    "tags" in body
  ) {
    const candidate = body as { name: unknown; age: unknown; tags: unknown };
    if (
      typeof candidate.name === "string" &&
      typeof candidate.age === "number" &&
      Array.isArray(candidate.tags) &&
      candidate.tags.every((t) => typeof t === "string")
    ) {
      return candidate as CreateUserInput;
    }
  }
  throw new Error("Invalid payload");
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-interfaces",
      title: "Interfaces & Type Aliases",
      iconName: "Shapes",
      link: "https://www.typescriptlang.org/docs/handbook/2/objects.html",
      theory:
        "Interfaces describe the shape of objects. Type aliases let you name any type. Both are key tools for modeling your domain.",
      theoryDetail: {
        keyConcepts: [
          "Interfaces define object shapes and can extend multiple other interfaces",
          "Type aliases work for any type: unions, functions, primitives, intersections",
          "Interfaces are open for declaration merging; type aliases are sealed",
        ],
        whyItMatters:
          "Well-named types serve as self-documenting contracts between functions and modules. IDEs use them for autocompletion, reducing lookup time dramatically.",
        commonPitfalls: [
          "Using interface for non-object types where a type alias is clearer",
          "Accidental declaration merging when two files define the same interface name",
          "Forgetting optional properties (?:) require undefined handling at usage sites",
        ],
        examples: [
          {
            title: "interface vs type — when to choose each",
            description:
              "Interfaces extend and merge; type aliases compose unions and complex shapes.",
            code: `// ─── interface: best for object contracts that may be extended ───
interface User {
  id: string;
  name: string;
  email: string;
}

// Extending an interface
interface AdminUser extends User {
  permissions: string[];
}

// Declaration merging (adds fields to an existing interface across files)
interface User {
  avatarUrl?: string; // merged in — now User has 4 fields
}

// ─── type alias: best for unions, functions, mapped types ───
type ID = string | number;

type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error";   message: string };

type ClickHandler = (event: MouseEvent) => void;

// ─── intersection type: combine two shapes ───
type WithTimestamps = { createdAt: Date; updatedAt: Date };
type UserRecord = User & WithTimestamps;`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-narrowing",
      title: "Type Narrowing",
      iconName: "Filter",
      link: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
      theory:
        "TypeScript narrows types based on control flow. Use typeof, instanceof, and 'in' guards to work safely with union types.",
      theoryDetail: {
        keyConcepts: [
          "typeof guards primitives; instanceof guards class instances",
          "'in' operator checks property existence and narrows discriminated unions",
          "User-defined type guards (x is Type) narrow in the caller's scope",
        ],
        whyItMatters:
          "Narrowing is how TypeScript makes union types usable. Without it, every operation on a union member would be a compile error.",
        commonPitfalls: [
          "Truthiness checks don't distinguish null from 0 or '' — use explicit comparisons",
          "Narrowing only applies within the branch — the type widens again outside it",
          "Writing redundant type guards for types TypeScript already narrows automatically",
        ],
        examples: [
          {
            title: "All narrowing techniques in one example",
            description:
              "typeof, instanceof, 'in', discriminated union, and custom type guard — each in its natural context.",
            code: `type Circle = { kind: "circle"; radius: number };
type Rect   = { kind: "rect";   width: number; height: number };
type Shape  = Circle | Rect;

// ─── typeof: primitive narrowing ───
function double(value: string | number): string | number {
  if (typeof value === "string") return value.repeat(2);
  return value * 2;
}

// ─── instanceof: class instance narrowing ───
function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

// ─── discriminated union (kind field) ───
function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.radius ** 2;
    case "rect":   return shape.width * shape.height;
  }
}

// ─── 'in' operator: optional property check ───
type Admin = { role: "admin"; permissions: string[] };
type Member = { role: "member" };
type AppUser = Admin | Member;

function canDelete(user: AppUser): boolean {
  return "permissions" in user && user.permissions.includes("delete");
}

// ─── user-defined type guard (predicate) ───
function isCircle(shape: Shape): shape is Circle {
  return shape.kind === "circle";
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-keyof-typeof-indexed",
      title: "keyof, typeof, Indexed Access",
      iconName: "KeyRound",
      link: "https://www.typescriptlang.org/docs/handbook/2/keyof-types.html",
      theory:
        "Use keyof, typeof, and indexed access types to derive types directly from real values and existing models.",
      theoryDetail: {
        keyConcepts: [
          "keyof T gives a union of property names from type T",
          "typeof value captures the static type of a runtime value",
          "T[K] reads a property type by key; T[keyof T] builds a union of all property value types",
        ],
        whyItMatters:
          "Deriving types from existing objects prevents drift between implementation and type declarations, especially in config-heavy codebases.",
        commonPitfalls: [
          "Using plain string for keys instead of keyof T loses autocomplete and safety",
          "Forgetting to mark config objects as const, which widens literal types",
          "Duplicating a value shape in a type alias instead of using typeof",
        ],
        examples: [
          {
            title: "Derive routes and handler signatures from one source",
            description:
              "A single route map can drive both runtime behavior and compile-time safety.",
            code: `const routes = {
  users: "/api/users",
  posts: "/api/posts",
} as const;

type RouteName = keyof typeof routes;        // "users" | "posts"
type RoutePath = (typeof routes)[RouteName]; // "/api/users" | "/api/posts"

function getUrl(name: RouteName): RoutePath {
  return routes[name];
}

// ─── Indexed access: read property type by key ───
type Config = { timeout: number; retries: number; baseUrl: string };
type TimeoutType = Config["timeout"]; // number
type StringFields = Config["baseUrl" | "timeout"]; // string | number`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-satisfies-const",
      title: "satisfies & const Assertions",
      iconName: "BadgeCheck",
      link: "https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html",
      theory:
        "The satisfies operator validates shape without losing inferred literal precision. const assertions keep values narrow and readonly.",
      theoryDetail: {
        keyConcepts: [
          "expr satisfies T checks compatibility while preserving expr's inferred type",
          "as const narrows literals and marks object/array members readonly",
          "satisfies is ideal for config objects that need strict keys and rich inference",
        ],
        whyItMatters:
          "This pattern catches invalid config at compile time while still giving exact literals for autocomplete, unions, and exhaustive checks.",
        commonPitfalls: [
          "Using 'as T' instead of satisfies, which can hide real type mismatches",
          "Applying as const to highly dynamic objects where mutability is required",
          "Forgetting that satisfies validates shape but does not transform runtime values",
        ],
        examples: [
          {
            title: "Strict config with inferred literals",
            description:
              "satisfies validates required keys while preserving literal unions for downstream usage.",
            code: `type EnvConfig = {
  apiBaseUrl: string;
  retry: 0 | 1 | 2 | 3;
};

const config = {
  apiBaseUrl: "https://api.example.com",
  retry: 2,
} as const satisfies EnvConfig;

type RetryLevel = typeof config.retry; // 2  (literal, not number)
type BaseUrl    = typeof config.apiBaseUrl; // "https://api.example.com"

// ─── as const on arrays: readonly tuple inference ───
const methods = ["GET", "POST", "PUT", "DELETE"] as const;
type HttpMethod = (typeof methods)[number]; // "GET" | "POST" | "PUT" | "DELETE"`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-assertions-safety",
      title: "Type Assertions & Non-Null Safety",
      iconName: "Shield",
      link: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions",
      theory:
        "Type assertions can be necessary at boundaries, but overusing them hides bugs. Prefer narrowing and explicit checks over non-null assertions.",
      theoryDetail: {
        keyConcepts: [
          "as Type tells the compiler to trust you; it does not validate data at runtime",
          "The non-null operator (!) removes null/undefined from a type without checks",
          "Assertion functions can encode runtime validation and inform the type system",
        ],
        whyItMatters:
          "Careful assertion use keeps TypeScript honest. Most production bugs around null values happen where assertions replaced proper checks.",
        commonPitfalls: [
          "Using value! in UI handlers where DOM references can actually be null",
          "Casting API results with as SomeType instead of validating shape",
          "Double assertions (as unknown as T) to bypass compiler errors",
        ],
        examples: [
          {
            title: "Assertion function over blind casting",
            description:
              "A small runtime guard eliminates unsafe casts and improves call-site types.",
            code: `type User = { id: string; email: string };

// ─── asserts value is T: runtime check + compile-time narrowing ───
function assertUser(value: unknown): asserts value is User {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    !("email" in value)
  ) {
    throw new Error("Invalid user payload");
  }
}

function handleUserPayload(payload: unknown) {
  assertUser(payload);
  return payload.email.toLowerCase(); // TS knows payload is User here
}

// ─── non-null assertion: use only when null is provably impossible ───
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!; // safe only when canvas type is confirmed`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
