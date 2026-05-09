import type { TopicNode } from "@/data/types";

export const tsAdvanced: TopicNode = {
  id: "ts-advanced",
  title: "Advanced Patterns",
  iconName: "Zap",
  theory:
    "Master TypeScript's most powerful features to write fully type-safe APIs, utilities, and libraries.",
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
      theory:
        "Generics let you write reusable functions and types that work with any type while preserving type safety.",
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
        examples: [
          {
            title: "Generic repository helper",
            description:
              "A constrained generic keeps return types precise while sharing one implementation.",
            code: `type Entity = { id: string };

function upsert<T extends Entity>(items: T[], incoming: T): T[] {
  const index = items.findIndex((item) => item.id === incoming.id);
  if (index === -1) return [...items, incoming];
  const next = [...items];
  next[index] = incoming;
  return next;
}

type User = Entity & { name: string };
const users = upsert<User>(
  [{ id: "1", name: "Asha" }],
  { id: "1", name: "Nina" }
); // User[]`,
            language: "ts",
          },
          {
            title: "Generic typed fetch helper",
            description:
              "A single implementation serves every resource type without unsafe casts.",
            code: `async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);
  return res.json() as Promise<T>;
}

type Post = { id: number; title: string; body: string };
const post = await getJson<Post>("/api/posts/1");
// post.title is string — fully typed`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-utility",
      title: "Utility Types",
      iconName: "Wrench",
      link: "https://www.typescriptlang.org/docs/handbook/utility-types.html",
      theory:
        "Partial, Required, Pick, Omit, Record and more — TypeScript ships built-in generic utilities for transforming existing types.",
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
        examples: [
          {
            title: "Derive DTOs from a domain entity",
            description:
              "Use Omit + Partial + Pick to model create/update payloads without duplicating type declarations.",
            code: `type User = {
  id: string;
  email: string;
  displayName: string;
  createdAt: Date;
  updatedAt: Date;
};

// Create: omit server-generated fields
type CreateUserDto = Omit<User, "id" | "createdAt" | "updatedAt">;

// Update: id required, rest optional
type UpdateUserDto = Pick<User, "id"> &
  Partial<Pick<User, "email" | "displayName">>;

// Extract function shape utilities
function updateUser(input: UpdateUserDto) {
  // input.id is required; email and displayName are optional
}

type UpdateParams = Parameters<typeof updateUser>[0]; // same as UpdateUserDto
type UpdateReturn = ReturnType<typeof updateUser>;    // void`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-conditional",
      title: "Conditional & Mapped Types",
      iconName: "GitBranch",
      link: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
      theory:
        "Conditional types choose between types based on a condition. Mapped types transform every property of an existing type.",
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
        examples: [
          {
            title: "Map nullable fields to required non-null values",
            description:
              "Mapped + conditional types can normalize API models into stricter internal models.",
            code: `type ApiUser = {
  id: string;
  email: string | null;
  phone: string | null;
};

// Remove null from every value type
type NonNullableFields<T> = {
  [K in keyof T]: Exclude<T[K], null | undefined>;
};

type StrictUser = NonNullableFields<ApiUser>;
// { id: string; email: string; phone: string }

// ─── infer: extract a return type from a generic wrapper ───
type UnwrapPromise<T> = T extends Promise<infer R> ? R : T;

type Resolved = UnwrapPromise<Promise<User>>; // User
type Plain    = UnwrapPromise<string>;         // string`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-type-branding",
      title: "Type Branding & Nominal Types",
      iconName: "Fingerprint",
      link: "https://www.typescriptlang.org/play#example/nominal-typing",
      theory:
        "TypeScript is structurally typed — two types with the same shape are interchangeable. Branding creates distinct types from the same primitive to prevent accidental misuse.",
      theoryDetail: {
        keyConcepts: [
          "Brand pattern: type UserId = string & { readonly __brand: 'UserId' }",
          "Branded types are assignability-incompatible at compile time but identical at runtime",
          "Factory functions act as the single point of brand creation and optional validation",
        ],
        whyItMatters:
          "Without branding, passing a PostId where a UserId is expected compiles silently. Branded types make ID mismatches, unit mismatches (meters vs feet), and domain errors a compile error.",
        commonPitfalls: [
          "Casting branded types with 'as' at call sites — defeats the entire purpose of branding",
          "Creating brands for every type — only brand values that are genuinely interchangeable but semantically distinct",
          "Not providing a typed factory function — raw cast is error-prone without a creation helper",
        ],
        examples: [
          {
            title: "User and Post IDs as distinct types",
            description:
              "Prevent passing a PostId where a UserId is expected without any runtime overhead.",
            code: `// ─── Brand helper ───
type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId = Brand<string, "UserId">;
type PostId = Brand<string, "PostId">;

// Factory functions are the only valid creation points
const UserId = (id: string): UserId => id as UserId;
const PostId = (id: string): PostId => id as PostId;

function getPost(userId: UserId, postId: PostId) {
  return \`/users/\${userId}/posts/\${postId}\`;
}

const uid = UserId("user-123");
const pid = PostId("post-456");

getPost(uid, pid);  // ✅ correct
getPost(pid, uid);  // ✅ compile error — argument types are swapped`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-advanced-generics",
      title: "Advanced Generic Patterns",
      iconName: "Network",
      link: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
      theory:
        "Deep generic patterns — recursive types, higher-kinded simulation, and infer-based extraction — unlock powerful type-level transformations.",
      theoryDetail: {
        keyConcepts: [
          "Recursive types model trees, deep readonly, and JSON using depth-guarded recursion",
          "'infer' inside conditional types extracts generic type parameters",
          "Variadic tuple types enable typed pipe/compose with full inference",
        ],
        whyItMatters:
          "Advanced generics let you build type-safe SDKs and utilities that scale with the type system rather than fighting it.",
        commonPitfalls: [
          "Recursive types without a base case hit TypeScript's instantiation depth limit",
          "Overusing advanced patterns where a simpler union or overload is clearer",
          "Losing inference by over-constraining T — let TypeScript infer when it can",
        ],
        examples: [
          {
            title: "DeepReadonly — recursive type transformation",
            description:
              "Recursively mark every nested object as readonly, protecting complex state objects from mutation.",
            code: `type DeepReadonly<T> = T extends (infer U)[]
  ? ReadonlyArray<DeepReadonly<U>>
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

type Config = {
  server: { host: string; port: number };
  features: string[];
};

type FrozenConfig = DeepReadonly<Config>;
// {
//   readonly server: { readonly host: string; readonly port: number };
//   readonly features: ReadonlyArray<string>;
// }

declare const cfg: FrozenConfig;
cfg.server.host = "new";  // ✅ compile error — deeply readonly`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-exhaustive-checks",
      title: "Exhaustive Checks with never",
      iconName: "CheckCheck",
      link: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#exhaustiveness-checking",
      theory:
        "The never type lets you encode exhaustiveness: if a switch/if-else misses a union variant, TypeScript reports a compile error rather than silently producing wrong output.",
      theoryDetail: {
        keyConcepts: [
          "A switch over a discriminated union with a 'default: assertNever(x)' catches missing cases",
          "assertNever receives the narrowed 'never' type — if any case is missing, x is not never and the call is a type error",
          "This pattern scales to Redux reducers, state machines, and API response handlers",
        ],
        whyItMatters:
          "Adding a new variant to a discriminated union causes every exhaustive switch to fail at compile time, guiding you to every handler that needs updating.",
        commonPitfalls: [
          "Using a plain default: throw without assertNever — you lose the compile-time safety",
          "Forgetting to add the new case before the assertNever call after extending a union",
          "Using exhaustive checks in library code — your consumers' unions may extend beyond yours",
        ],
        examples: [
          {
            title: "Exhaustive action reducer",
            description:
              "Adding a new action type forces you to handle it everywhere — the compiler guides refactoring.",
            code: `type Action =
  | { type: "INCREMENT"; by: number }
  | { type: "DECREMENT"; by: number }
  | { type: "RESET" };

function assertNever(x: never): never {
  throw new Error("Unhandled action: " + JSON.stringify(x));
}

function reducer(state: number, action: Action): number {
  switch (action.type) {
    case "INCREMENT": return state + action.by;
    case "DECREMENT": return state - action.by;
    case "RESET":     return 0;
    default:          return assertNever(action);
    // ↑ Adding a new Action variant without a case makes this a compile error
  }
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-variance",
      title: "Variance & Type Compatibility",
      iconName: "ArrowLeftRight",
      link: "https://www.typescriptlang.org/docs/handbook/2/generics.html#variance-annotations",
      theory:
        "Variance describes how generic type parameters relate to assignability. Covariant types flow 'out', contravariant types flow 'in'. Getting this wrong produces unexpected type errors or unsafe holes.",
      theoryDetail: {
        keyConcepts: [
          "Covariant (out): if Dog extends Animal, Producer<Dog> extends Producer<Animal>",
          "Contravariant (in): if Dog extends Animal, Consumer<Animal> extends Consumer<Dog>",
          "Functions are contravariant in parameters, covariant in return types",
        ],
        whyItMatters:
          "Understanding variance explains why you can't pass string[] where readonly (string | number)[] is expected, and why callback parameter types must be widened, not narrowed.",
        commonPitfalls: [
          "Mutable arrays are invariant — Array<Dog> is NOT assignable to Array<Animal>",
          "Callback parameter bivariance: TypeScript is intentionally unsound here for practical reasons",
          "Using 'in' and 'out' variance annotations (TS 4.7+) to get explicit errors instead of silent unsoundness",
        ],
        examples: [
          {
            title: "Covariance vs contravariance with callbacks",
            description:
              "Return types are covariant (widen OK); parameter types are contravariant (narrow OK).",
            code: `class Animal { breathe() {} }
class Dog extends Animal { bark() {} }

// ─── Return type: covariant — Dog is assignable where Animal is expected ───
type AnimalFactory = () => Animal;
type DogFactory    = () => Dog;
const factory: AnimalFactory = (() => new Dog()) satisfies DogFactory; // ✅

// ─── Parameter type: contravariant — handler for Animal works where Dog expected ───
type DogHandler    = (d: Dog) => void;
type AnimalHandler = (a: Animal) => void;

// An Animal handler also handles Dogs (Dog has everything Animal has)
const handle: DogHandler = ((a: Animal) => a.breathe()) satisfies AnimalHandler; // ✅

// ─── Mutable arrays: invariant ───
const dogs: Dog[] = [new Dog()];
// const animals: Animal[] = dogs; // ✅ compile error — mutable arrays are invariant
const roAnimals: readonly Animal[] = dogs; // ✅ readonly arrays are covariant`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
