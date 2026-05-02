import type { Technology } from "@/data/types";

const typescript: Technology = {
  id: "typescript",
  name: "TypeScript",
  description: "Strongly typed superset of JavaScript that catches bugs at compile time and improves IDE support.",
  color: "bg-blue-700",
  iconName: "FileCode2",
  deviconClass: "devicon-typescript-plain colored",
  tree: [
    {
      id: "ts-basics",
      title: "TypeScript Fundamentals",
      iconName: "BookOpen",
      theory: "TypeScript adds optional static types to JavaScript. Start here to understand how type annotations work and why they make your code more maintainable.",
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
          theory: "TypeScript supports primitives like string, number, boolean, arrays, tuples, and special types like any, unknown, and never.",
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
          },
        },
        {
          id: "ts-interfaces",
          title: "Interfaces & Type Aliases",
          iconName: "Shapes",
          link: "https://www.typescriptlang.org/docs/handbook/2/objects.html",
          theory: "Interfaces describe the shape of objects. Type aliases let you name any type. Both are key tools for modeling your domain.",
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
          },
        },
        {
          id: "ts-narrowing",
          title: "Type Narrowing",
          iconName: "Filter",
          link: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
          theory: "TypeScript narrows types based on control flow. Use typeof, instanceof, and 'in' guards to work safely with union types.",
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
          },
        },
      ],
    },
    {
      id: "ts-advanced",
      title: "Advanced Patterns",
      iconName: "Zap",
      theory: "Master TypeScript's most powerful features to write fully type-safe APIs, utilities, and libraries.",
      theoryDetail: {
        keyConcepts: [
          "Template literal types combine string unions: `${Method}/${Route}`",
          "The 'infer' keyword extracts types from conditional type expressions",
          "Recursive types model trees, JSON, or linked lists — add a depth guard for performance",
        ],
        whyItMatters:
          "Advanced TypeScript turns the type system into a compile-time constraint engine. You can encode business rules as types and let the compiler enforce them automatically.",
        commonPitfalls: [
          "Over-engineering types that are clever but unreadable — prefer clarity over cleverness",
          "Using @ts-ignore to bypass errors instead of modeling the data correctly",
          "Recursive types without a base case causing TypeScript to hit the instantiation depth limit",
        ],
      },
      children: [
        {
          id: "ts-generics",
          title: "Generics",
          iconName: "Box",
          link: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
          theory: "Generics let you write reusable functions and types that work with any type while preserving type safety.",
          theoryDetail: {
            keyConcepts: [
              "Generic parameters declared with <T> are inferred from arguments or supplied explicitly",
              "Constraints with 'extends' restrict what T can be: <T extends object>",
              "Default type parameters provide a fallback: <T = string>",
            ],
            whyItMatters:
              "Without generics, reusable utilities like Array.map or Promise would lose their input types through transformations, forcing unsafe casts back to the original type.",
            commonPitfalls: [
              "Too many unconstrained type parameters making function signatures unreadable",
              "Forgetting constraints causing 'Property X does not exist on type T' errors",
              "Using generics when a union type or overload is simpler and more readable",
            ],
          },
        },
        {
          id: "ts-utility",
          title: "Utility Types",
          iconName: "Wrench",
          link: "https://www.typescriptlang.org/docs/handbook/utility-types.html",
          theory: "Partial, Required, Pick, Omit, Record and more — TypeScript ships built-in generic utilities for transforming existing types.",
          theoryDetail: {
            keyConcepts: [
              "Partial<T> makes all fields optional; Required<T> makes all required",
              "Pick<T, 'a'|'b'> selects keys; Omit<T, 'a'> excludes them",
              "ReturnType<typeof fn> and Parameters<typeof fn> extract function type info",
            ],
            whyItMatters:
              "Utility types keep your type definitions DRY — derive DTOs, partial forms, and API responses from a single source-of-truth type without duplication.",
            commonPitfalls: [
              "Nesting 4+ utility types creating unreadable one-liners — alias intermediate steps",
              "Using Partial everywhere 'to be safe' instead of modeling the actual required/optional split",
              "Reaching for utilities before checking if TypeScript can infer the shape automatically",
            ],
          },
        },
        {
          id: "ts-conditional",
          title: "Conditional & Mapped Types",
          iconName: "GitBranch",
          link: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
          theory: "Conditional types choose between types based on a condition. Mapped types transform every property of an existing type.",
          theoryDetail: {
            keyConcepts: [
              "T extends U ? X : Y distributes over union types by default",
              "Mapped types iterate over keyof T to transform each property",
              "The 'as' clause in mapped types renames or filters keys",
            ],
            whyItMatters:
              "Conditional and mapped types underpin TypeScript's entire utility library. Understanding them unlocks building type-safe APIs, ORMs, and validation schemas.",
            commonPitfalls: [
              "Unexpected distribution over unions — wrap T in a tuple [T] to disable it",
              "Infinite recursion in recursive conditional types without a base case",
              "Creating complex types without intermediate aliases making error messages cryptic",
            ],
          },
        },
      ],
    },
    {
      id: "ts-interview-questions",
      title: "Interview Questions",
      iconName: "HelpCircle",
      theory:
        "This section covers common TypeScript interview questions with practical, production-oriented answers. Focus on type modeling, safety, and maintainability trade-offs.",
      theoryDetail: {
        keyConcepts: [
          "Prefer clear type modeling over clever type tricks",
          "Explain trade-offs: runtime validation vs compile-time typing",
          "Use examples that show narrowing, generics, and utility types in real code",
        ],
        whyItMatters:
          "TypeScript interviews test whether you can design robust contracts and reduce runtime bugs in large codebases.",
        commonPitfalls: [
          "Using any to silence type errors instead of modeling data shape correctly",
          "Confusing compile-time type safety with runtime data validation",
          "Overusing advanced conditional types where simple unions would be clearer",
        ],
      },
      children: [
        {
          id: "ts-iq-any-vs-unknown",
          title: "any vs unknown",
          iconName: "ShieldAlert",
          theory: "Interviewers often ask this to test whether you understand safe type narrowing.",
          theoryDetail: {
            examples: [
              {
                title: "Q: any vs unknown",
                description:
                  "unknown is safer because it requires narrowing before use, while any disables type checking.",
                code: `function parse(input: unknown) {
  if (typeof input === 'string') {
    return input.toUpperCase();
  }
  return null;
}

// any would allow unsafe operations with no compiler warnings.`,
                language: "ts",
              },
            ],
          },
        },
        {
          id: "ts-iq-interface-vs-type",
          title: "interface vs type",
          iconName: "Shapes",
          theory: "Both can model object shapes, but they differ in capabilities and extension patterns.",
          theoryDetail: {
            examples: [
              {
                title: "Q: When to use interface vs type?",
                description:
                  "Use interface for object contracts and extension, type for unions/aliases/complex compositions.",
                code: `interface User {
  id: string;
  name: string;
}

type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };`,
                language: "ts",
              },
            ],
          },
        },
        {
          id: "ts-iq-generics",
          title: "Generics in APIs",
          iconName: "Box",
          theory: "A frequent mid/senior question: designing reusable typed APIs without losing inference.",
          theoryDetail: {
            examples: [
              {
                title: "Q: Build a typed fetch helper",
                description:
                  "Show generic return typing and explicit error handling.",
                code: `async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Request failed');
  return res.json() as Promise<T>;
}

type User = { id: string; name: string };
const user = await getJson<User>('/api/user/1');`,
                language: "ts",
              },
            ],
          },
        },
      ],
    },
  ],
};

export default typescript;
