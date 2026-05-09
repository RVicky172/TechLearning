import type { TopicNode } from "@/data/types";

export const tsEnumsAndLiterals: TopicNode = {
  id: "ts-enums-literals",
  title: "Enums & Literal Types",
  iconName: "List",
  theory:
    "Enums and literal types let you express a fixed set of allowed values. Template literal types combine string literals with string manipulation at the type level.",
  theoryDetail: {
    keyConcepts: [
      "Numeric enums auto-increment; string enums require explicit values for each member",
      "const enums are inlined by the compiler, producing no runtime object",
      "Literal types (type Dir = 'left' | 'right') are lighter-weight alternatives to enums",
    ],
    whyItMatters:
      "Enums and literal unions document the exact set of valid values and let the compiler reject any value outside that set — eliminating magic strings and numeric constants.",
    commonPitfalls: [
      "Using regular enums in ESM packages — they produce a runtime object that can cause bundling issues",
      "Numeric enums are reverse-mapped — Enum[0] === 'Member'; this surprises many developers",
      "Mixing string and numeric members in one enum makes the type hard to work with",
    ],
  },
  children: [
    {
      id: "ts-enums",
      title: "Enums",
      iconName: "Hash",
      link: "https://www.typescriptlang.org/docs/handbook/enums.html",
      theory:
        "Enums define a named set of constants. TypeScript supports numeric enums (auto-incremented), string enums (explicit values), and const enums (compiler-inlined).",
      theoryDetail: {
        keyConcepts: [
          "Numeric enum: enum Direction { Up, Down, Left, Right } starts at 0",
          "String enum: enum Status { Active = 'ACTIVE', Inactive = 'INACTIVE' }",
          "const enum: erased at compile time; members are replaced with their literal values",
        ],
        whyItMatters:
          "Enums replace scattered magic strings and numbers with a named, type-safe set. Renaming a member propagates everywhere via the IDE, unlike renaming a string literal.",
        commonPitfalls: [
          "Numeric enums allow any number to be assigned — use string enums for strict validation",
          "const enums break across module boundaries without 'isolatedModules' awareness",
          "Forgetting that numeric enums are reverse-mapped — iterating an enum gives both keys and values",
        ],
        examples: [
          {
            title: "String enums vs literal unions — choosing the right tool",
            description:
              "String enums provide a namespace; literal unions are lighter and composable.",
            code: `// ─── String enum: named namespace, good for large sets ───
enum HttpMethod {
  Get    = "GET",
  Post   = "POST",
  Put    = "PUT",
  Delete = "DELETE",
}

function request(method: HttpMethod, url: string) {
  return fetch(url, { method });
}
request(HttpMethod.Get, "/api/users"); // ✅

// ─── const enum: inlined at compile time, zero runtime cost ───
const enum Direction { Up, Down, Left, Right }
const move = Direction.Up; // compiled to: const move = 0;

// ─── Literal union: simpler, composable, no runtime object ───
type Method = "GET" | "POST" | "PUT" | "DELETE";

function apiFetch(method: Method, url: string) {
  return fetch(url, { method });
}
apiFetch("GET", "/api/users"); // ✅ — no enum import needed

// ─── When to prefer literal union over enum ───
// ✅ Use literal union when: set is small, no namespace needed, composing with other types
type ReadMethod  = "GET";
type WriteMethod = "POST" | "PUT" | "DELETE";
type AllMethods  = ReadMethod | WriteMethod; // clean union composition`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-literal-types",
      title: "Literal & Union Types",
      iconName: "Tag",
      link: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types",
      theory:
        "Literal types restrict a variable to an exact value. Combined into unions, they model state machines and discriminated data structures.",
      theoryDetail: {
        keyConcepts: [
          "String literal: type Dir = 'north' | 'south' | 'east' | 'west'",
          "Discriminated unions: a shared literal field narrows to a specific variant",
          "'as const' freezes an object/array so TypeScript infers the narrowest literal type",
        ],
        whyItMatters:
          "Discriminated unions with a literal tag field let TypeScript narrow a union to a specific variant inside a branch — eliminating runtime instanceof checks for plain objects.",
        commonPitfalls: [
          "Widening: 'let x = 'hello'' infers string, not 'hello' — use 'const' or 'as const'",
          "Forgetting to handle all variants in a switch — add a 'never' default to catch gaps",
          "Using string enums instead of literal unions when the set won't grow — unions are simpler",
        ],
        examples: [
          {
            title: "Discriminated union state machine",
            description:
              "A shared 'status' literal lets TypeScript narrow to exact variants in each branch.",
            code: `type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error";   message: string };

type UserState = AsyncState<{ id: string; name: string }>;

function renderUser(state: UserState): string {
  switch (state.status) {
    case "idle":    return "Not started";
    case "loading": return "Loading…";
    case "success": return \`Hello, \${state.data.name}\`; // state.data is typed
    case "error":   return \`Error: \${state.message}\`;   // state.message is typed
  }
}

// ─── Literal widening — use const or as const to prevent it ───
const direction = "north"; // type: "north" (literal)
let   direction2 = "north"; // type: string  (widened — mutable vars widen)

const config = { retries: 3, level: "warn" } as const;
type Level = typeof config.level; // "warn" (not string)`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-template-literal",
      title: "Template Literal Types",
      iconName: "Code",
      link: "https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html",
      theory:
        "Template literal types build new string literal types by combining existing string unions — enabling typed event names, CSS property names, and REST endpoints.",
      theoryDetail: {
        keyConcepts: [
          "type Greeting = `Hello, ${string}` matches any string starting with 'Hello, '",
          "Distributes over unions: `on${Capitalize<'click'|'focus'>}` → 'onClick' | 'onFocus'",
          "Intrinsic utility types: Uppercase<S>, Lowercase<S>, Capitalize<S>, Uncapitalize<S>",
        ],
        whyItMatters:
          "Template literal types bring compile-time string manipulation to TypeScript. They power fully typed event systems, CSS-in-TS utilities, and auto-generated API client types.",
        commonPitfalls: [
          "Template literal types on large unions produce an exponential product — keep union members small",
          "Using template literals to validate runtime strings — they are compile-time only",
          "Forgetting the Capitalize/Lowercase helpers when building camelCase keys from snake_case unions",
        ],
        examples: [
          {
            title: "Typed event system with template literal types",
            description:
              "Generate 'onClick', 'onFocus', 'onChange' handler types from a list of DOM events automatically.",
            code: `type DomEvent = "click" | "focus" | "change" | "blur";

// Produces: "onClick" | "onFocus" | "onChange" | "onBlur"
type HandlerName = \`on\${Capitalize<DomEvent>}\`;

// Map each handler name to a function type
type EventHandlers = {
  [K in HandlerName]: (event: Event) => void;
};

// ─── API path builder ───
type Resource = "users" | "posts" | "comments";
type CrudPath =
  | \`/api/\${Resource}\`
  | \`/api/\${Resource}/\${string}\`;

function fetchResource(path: CrudPath): Promise<unknown> {
  return fetch(path).then((r) => r.json());
}

fetchResource("/api/users");           // ✅
fetchResource("/api/posts/123");       // ✅
// fetchResource("/api/likes");        // ✅ compile error — "likes" not in Resource

// ─── snake_case to camelCase keys ───
type SnakeToCamel<S extends string> =
  S extends \`\${infer Head}_\${infer Tail}\`
    ? \`\${Head}\${Capitalize<SnakeToCamel<Tail>>}\`
    : S;

type Result = SnakeToCamel<"user_first_name">; // "userFirstName"`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
