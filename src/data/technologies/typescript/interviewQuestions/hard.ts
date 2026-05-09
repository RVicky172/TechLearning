import type { TopicNode } from "@/data/types";

export const tsIQHard: TopicNode = {
  id: "ts-iq-hard",
  title: "Hard / Advanced",
  iconName: "Flame",
  theory:
    "Senior-level TypeScript questions on the type system's advanced features. Expected at senior, staff, and principal engineer levels.",
  theoryDetail: {
    keyConcepts: [
      "Conditional types distribute over unions and extract inner types with 'infer'",
      "Mapped types iterate over keys of a type to transform each property",
      "Variance describes how generic types relate to their type arguments",
    ],
    whyItMatters:
      "Advanced type features let you encode business constraints as types — turning the TypeScript compiler into an automated code reviewer.",
    commonPitfalls: [
      "Creating overly complex conditional types where a simpler union is more readable",
      "Hitting TypeScript's instantiation depth limit with unguarded recursive types",
      "Misunderstanding variance leading to unsound function type assignments",
    ],
  },
  children: [
    {
      id: "ts-iq-hard-type-guard",
      title: "Custom Type Guards",
      iconName: "ShieldCheck",
      theory: "Write type predicate functions to narrow unknown values or union types reusably across the codebase.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Write a reusable type guard for unknown API data",
            description:
              "A function returning 'value is T' narrows the type in the caller's scope. This is safer than casting and reusable across multiple call sites.",
            code: `type Circle = { kind: 'circle'; radius: number };
type Rect   = { kind: 'rect';   width: number; height: number };
type Shape  = Circle | Rect;

// ── User-defined type guard ────────────────────────────────────────
function isCircle(shape: Shape): shape is Circle {
  return shape.kind === 'circle';
}

function area(shape: Shape): number {
  if (isCircle(shape)) {
    return Math.PI * shape.radius ** 2; // shape is Circle ✅
  }
  return shape.width * shape.height;   // shape is Rect ✅
}

// ── Generic type guard for unknown API responses ───────────────────
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasKey<K extends string>(
  obj: Record<string, unknown>,
  key: K,
): obj is Record<K, unknown> {
  return key in obj;
}

// Usage — parse unknown API response without unsafe casts
async function parseUser(raw: unknown): Promise<{ id: string; name: string }> {
  if (!isRecord(raw)) throw new Error('Expected an object');
  if (!hasKey(raw, 'id')   || typeof raw.id   !== 'string') throw new Error('Missing id');
  if (!hasKey(raw, 'name') || typeof raw.name !== 'string') throw new Error('Missing name');
  return { id: raw.id, name: raw.name };
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-hard-branding",
      title: "Type Branding",
      iconName: "Fingerprint",
      theory: "Prevent passing a PostId where a UserId is required — both are strings but semantically incompatible.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Implement nominal typing with branded types",
            description:
              "Branded types add a phantom property to distinguish structurally identical primitives. Caught at compile time with zero runtime overhead.",
            code: `// TypeScript is structural — plain 'string' is always compatible with 'string'
// Branding creates compile-time distinctions without any runtime cost.

type Brand<T, B extends string> = T & { readonly __brand: B };

type UserId = Brand<string, 'UserId'>;
type PostId = Brand<string, 'PostId'>;

// Factory functions are the single creation point for branded values
const UserId = (id: string): UserId => id as UserId;
const PostId = (id: string): PostId => id as PostId;

function likePost(userId: UserId, postId: PostId): void {
  console.log(\`User \${userId} liked post \${postId}\`);
}

const uid = UserId('u-1');
const pid = PostId('p-42');

likePost(uid, pid);  // ✅ correct order
likePost(pid, uid);  // ✅ compile error — Argument of type 'PostId' is not assignable to 'UserId'

// ── Branded numbers: prevent mixing units ─────────────────────────
type Meters = Brand<number, 'Meters'>;
type Miles  = Brand<number, 'Miles'>;

const Meters = (n: number): Meters => n as Meters;
const Miles  = (n: number): Miles  => n as Miles;

function calculateFuelLiters(distance: Meters): number {
  return distance * 0.08; // 8L per 100m (hypothetical)
}

calculateFuelLiters(Meters(500)); // ✅
// calculateFuelLiters(Miles(500)); // ✅ compile error — wrong unit brand`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-hard-exhaustive",
      title: "Exhaustive Checks with never",
      iconName: "CheckCheck",
      theory: "Use the never type to make TypeScript enforce that every union variant is handled — adding a new variant surfaces every unhandled location immediately.",
      theoryDetail: {
        examples: [
          {
            title: "Q: How do you enforce exhaustive handling of a discriminated union?",
            description:
              "assertNever assigns the uncovered case to never. If any variant is unhandled, TypeScript reports a compile error at that call site.",
            code: `function assertNever(x: never): never {
  throw new Error('Unhandled case: ' + JSON.stringify(x));
}

type Notification =
  | { type: 'email'; address: string }
  | { type: 'sms';   phone: string }
  | { type: 'push';  deviceToken: string };

function send(n: Notification): void {
  switch (n.type) {
    case 'email': console.log('Email →', n.address);      break;
    case 'sms':   console.log('SMS →',   n.phone);        break;
    case 'push':  console.log('Push →',  n.deviceToken);  break;
    default:
      // ✅ Compile error if a new Notification variant is added but not handled
      assertNever(n);
  }
}

// Adding | { type: 'slack'; channel: string } to Notification
// immediately causes: Argument of type '{ type: "slack"; channel: string }'
//                     is not assignable to parameter of type 'never'

// ── Alternative: inline never assignment ──────────────────────────
function handlePayment(method: 'card' | 'paypal' | 'crypto'): void {
  switch (method) {
    case 'card':   return;
    case 'paypal': return;
    case 'crypto': return;
    default: {
      const _check: never = method;
      void _check;
    }
  }
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-hard-conditional",
      title: "Conditional Types & infer",
      iconName: "GitBranch",
      theory: "Conditional types choose between types based on a condition. 'infer' extracts a type from inside another type within a conditional — the basis of ReturnType, Parameters, etc.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Explain conditional types and show how infer works",
            description:
              "T extends U ? X : Y distributes over unions. 'infer' captures a sub-type from a pattern — used to unwrap Promises, extract function return types, and more.",
            code: `// ── Basic conditional type ────────────────────────────────────────
type IsString<T> = T extends string ? 'yes' : 'no';

type A = IsString<string>;          // 'yes'
type B = IsString<number>;          // 'no'
type C = IsString<string | number>; // 'yes' | 'no' (distributes over union)

// ── infer: extract a type from a structural pattern ───────────────
type UnwrapPromise<T> = T extends Promise<infer Inner> ? Inner : T;

type P1 = UnwrapPromise<Promise<string>>; // string
type P2 = UnwrapPromise<number>;          // number (not a Promise — returns T itself)
type P3 = UnwrapPromise<Promise<Promise<boolean>>>; // Promise<boolean> (one layer)

// ── Built-in utility types are built on conditional + infer ───────
// ReturnType<T> = T extends (...args: any[]) => infer R ? R : never
// Parameters<T> = T extends (...args: infer P) => any ? P : never

type Fn = (a: string, b: number) => boolean;
type Ret    = ReturnType<Fn>;   // boolean
type Params = Parameters<Fn>;  // [string, number]

// ── Prevent union distribution — wrap in a tuple ──────────────────
type Distribute<T>   = T extends string ? 'yes' : 'no';
type NoDistribute<T> = [T] extends [string] ? 'yes' : 'no';

type D1 = Distribute<string | number>;   // 'yes' | 'no'  (distributed)
type D2 = NoDistribute<string | number>; // 'no'           (whole union checked)`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-hard-mapped",
      title: "Mapped Types & Key Remapping",
      iconName: "Map",
      theory: "Mapped types iterate over each key of an existing type to transform property types, add/remove modifiers, or remap key names with the 'as' clause.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Write a DeepReadonly type and demonstrate key remapping",
            description:
              "Mapped types use { [K in keyof T]: ... }. The 'as' clause renames or filters keys. Recursive mapped types can transform nested objects.",
            code: `// ── Basic mapped type ──────────────────────────────────────────────
type MyReadonly<T> = { readonly [K in keyof T]: T[K] };

// ── DeepReadonly: recursive mapped type ──────────────────────────────
type DeepReadonly<T> = {
  readonly [K in keyof T]: T[K] extends object
    ? DeepReadonly<T[K]>
    : T[K];
};

type Config = {
  server:   { host: string; port: number };
  database: { url: string; maxConnections: number };
};

type FrozenConfig = DeepReadonly<Config>;
// FrozenConfig.server.host is readonly — reassignment is a compile error

// ── Key remapping with 'as' ────────────────────────────────────────
// Add 'get' prefix to every key
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};

type User = { name: string; age: number };
type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }

// ── Filter keys with 'as never' ────────────────────────────────────
// Keep only string-valued properties
type StringProps<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

type Filtered = StringProps<{ id: string; count: number; label: string }>;
// { id: string; label: string }`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-hard-variance",
      title: "Variance & Type Compatibility",
      iconName: "ArrowLeftRight",
      theory: "Variance describes whether a generic type is covariant (safe to widen), contravariant (safe to narrow), or invariant. TypeScript checks this structurally.",
      theoryDetail: {
        examples: [
          {
            title: "Q: What is variance? Explain covariance and contravariance.",
            description:
              "Covariant positions (return types) accept subtypes safely. Contravariant positions (parameter types) require supertypes. Mutable containers are invariant.",
            code: `class Animal { name = ''; }
class Dog extends Animal { breed = ''; }

// ── Covariance: return types accept subtypes ────────────────────────
// A function returning Dog is assignable to one returning Animal
type GetAnimal = () => Animal;
type GetDog    = () => Dog;

const getDog: GetDog = () => new Dog();
const getAnimal: GetAnimal = getDog; // ✅ Dog is a subtype of Animal

// ── Contravariance: parameter types require supertypes ──────────────
// A function accepting Animal is assignable to one accepting Dog
// (because it works for ANY Animal, which includes Dogs)
type HandleAnimal = (a: Animal) => void;
type HandleDog    = (d: Dog)    => void;

const handleAnimal: HandleAnimal = (a) => console.log(a.name);
const handleDog: HandleDog = handleAnimal; // ✅ safe — it accepts any Animal

// ── Why this matters: incorrect assignment caught by strictFunctionTypes
type Unsafe = (d: Dog) => void;
const unsafe: Unsafe = (d: Dog) => console.log(d.breed);

// With strict: true, TypeScript enforces contravariance for function params
// Prevents: passing a handler expecting Dog.breed to code that passes Animal

// ── Invariance: mutable containers ─────────────────────────────────
// Array<Dog> is logically NOT assignable to Array<Animal>
// because: (animals as Dog[]).push(new Animal()) would corrupt the array
// TypeScript is lenient here but soundness tools flag it`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
