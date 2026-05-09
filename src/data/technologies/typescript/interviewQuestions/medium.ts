import type { TopicNode } from "@/data/types";

export const tsIQMedium: TopicNode = {
  id: "ts-iq-medium",
  title: "Medium",
  iconName: "CircleDot",
  theory:
    "Mid-level TypeScript questions on union types, generics, utility types, and real-world patterns. Expected at junior-to-mid and mid-level engineer roles.",
  theoryDetail: {
    keyConcepts: [
      "Generics make functions and types reusable without sacrificing type safety",
      "Discriminated unions with a literal tag field enable exhaustive, safe narrowing",
      "Utility types derive new types from existing ones — keeping definitions DRY",
    ],
    whyItMatters:
      "Medium questions assess whether a candidate can model real business domains safely — not just use TypeScript's basic primitives.",
    commonPitfalls: [
      "Over-using generics when a union type or overload would be simpler and more readable",
      "Forgetting that Partial makes all fields optional — not just the ones you intend",
      "Confusing 'extends' in generics (constraint) vs 'extends' in conditional types (type check)",
    ],
  },
  children: [
    {
      id: "ts-iq-med-any-unknown",
      title: "any vs unknown",
      iconName: "ShieldAlert",
      theory: "Interviewers ask this to test whether you understand safe type narrowing at API and catch-block boundaries.",
      theoryDetail: {
        examples: [
          {
            title: "Q: What is the difference between any and unknown?",
            description:
              "unknown is safer because it requires narrowing before use. any disables all type checking entirely — it is an escape hatch, not a type.",
            code: `// ─── any: disables all type checks ───────────────────────────────
function processAny(input: any) {
  input.toUpperCase(); // no error — crashes at runtime if not a string
  input.nonExistent(); // no error — TypeScript trusts you blindly
}

// ─── unknown: safe catch-all — must narrow before use ─────────────
function processUnknown(input: unknown) {
  // input.toUpperCase(); // ✅ compile error — cannot call method on unknown
  if (typeof input === 'string') {
    input.toUpperCase(); // ✅ narrowed to string
  }
  if (typeof input === 'number') {
    input.toFixed(2);   // ✅ narrowed to number
  }
}

// ─── Rule: use unknown at API boundaries, never use any ───────────
async function fetchData(url: string): Promise<unknown> {
  return fetch(url).then(r => r.json()); // r.json() returns any — wrap in unknown
}

// ─── catch blocks: TypeScript 4.0+ makes e: unknown by default ────
try {
  JSON.parse('invalid');
} catch (e: unknown) {
  // e.message; // ✅ compile error — must narrow first
  if (e instanceof Error) {
    console.error(e.message); // ✅ safe — e is Error
  }
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-med-interface-type",
      title: "interface vs type",
      iconName: "Shapes",
      theory: "Both model object shapes but differ in extension patterns, declaration merging, and supported type constructs.",
      theoryDetail: {
        examples: [
          {
            title: "Q: When do you use interface vs type alias?",
            description:
              "Use interface for extensible object contracts and class shapes. Use type for unions, functions, mapped types, and non-object aliases.",
            code: `// ── interface: open, extensible, supports declaration merging ──────
interface User {
  id: string;
  name: string;
}
interface AdminUser extends User {
  permissions: string[];
}
// Declaration merging — only works with interface
interface User { avatarUrl?: string } // adds avatarUrl to User everywhere

// ── type: unions, functions, mapped types, intersections ────────────
type ID = string | number;
type Nullable<T> = T | null;

type ApiResponse<T> =
  | { status: 'ok';    data: T }
  | { status: 'error'; message: string };

type ClickHandler = (event: MouseEvent) => void;

// Intersection — cleaner syntax with type
type UserWithMeta = User & { createdAt: Date; updatedAt: Date };

// ── Rule of thumb ─────────────────────────────────────────────────────
// interface → public API shapes, class contracts, library types (extensible)
// type      → unions, computed shapes, utility compositions (precise)`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-med-generics",
      title: "Generics in APIs",
      iconName: "Box",
      theory: "Mid/senior question: design reusable typed utilities without losing type inference.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Build a typed fetch helper using generics",
            description:
              "Show generic return typing, constraints, and how TypeScript infers T from a type argument.",
            code: `async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(\`Request failed: \${res.status} \${res.statusText}\`);
  return res.json() as Promise<T>;
}

type User = { id: string; name: string; email: string };
type Post = { id: string; title: string; body: string };

const user = await getJson<User>('/api/user/1');   // user: User
const post = await getJson<Post>('/api/posts/42'); // post: Post

// ── Constrained generic: T must have an 'id' property ─────────────
type Entity = { id: string };

function findById<T extends Entity>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

const users: User[] = [{ id: '1', name: 'Alice', email: 'a@example.com' }];
const found = findById(users, '1'); // found: User | undefined

// ── Generic with default type parameter ───────────────────────────
function createState<T = string>(initial: T) {
  let value = initial;
  return {
    get: (): T => value,
    set: (next: T) => { value = next; },
  };
}

const counter = createState(0);    // T inferred as number
const label   = createState();     // T defaults to string`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-med-discriminated",
      title: "Discriminated Unions",
      iconName: "GitBranch",
      theory: "Using a shared literal tag field to safely narrow a union to a specific variant — no casting needed.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Model async state with a discriminated union",
            description:
              "A 'status' literal field lets TypeScript narrow the union in each switch branch. Outside a branch, accessing variant-specific fields is a compile error.",
            code: `type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error';   error: string };

type User = { id: string; name: string };

function renderUser(state: AsyncState<User>): string {
  switch (state.status) {
    case 'idle':    return 'Not started';
    case 'loading': return 'Loading…';
    case 'success': return \`Hello, \${state.data.name}\`; // state.data: User ✅
    case 'error':   return \`Error: \${state.error}\`;
    // No default — TypeScript knows the switch is exhaustive
  }
}

// ── React usage ────────────────────────────────────────────────────
function UserCard({ state }: { state: AsyncState<User> }) {
  if (state.status === 'success') {
    // state.data is User here — fully typed
    return <div>{state.data.name}</div>;
  }
  if (state.status === 'error') {
    return <div>Error: {state.error}</div>;
  }
  return <div>Loading…</div>;
}`,
            language: "tsx",
          },
        ],
      },
    },
    {
      id: "ts-iq-med-utility",
      title: "Utility Types in Practice",
      iconName: "Wrench",
      theory: "Partial, Pick, Omit, Readonly, and Record let you derive DTO types without duplicating interface definitions.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Derive create, update, and read DTO types from a User interface",
            description:
              "Combine Partial, Pick, Omit, and Readonly to model all CRUD payload shapes from a single source-of-truth type.",
            code: `interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  createdAt: Date;
  updatedAt: Date;
}

// POST /users — omit server-generated fields
type CreateUserDto = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
// { name: string; email: string; role: 'admin' | 'member' }

// PATCH /users/:id — id required, rest optional
type PatchUserDto = Pick<User, 'id'> &
  Partial<Pick<User, 'name' | 'email'>>;
// { id: string; name?: string; email?: string }

// GET /users — public read model (immutable)
type UserProfile = Readonly<Pick<User, 'id' | 'name' | 'email'>>;

// Record: role → permissions mapping
type RolePermissions = Record<User['role'], string[]>;
const permissions: RolePermissions = {
  admin:  ['read', 'write', 'delete'],
  member: ['read'],
};`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-iq-med-overloads",
      title: "Function Overloads",
      iconName: "Layers",
      theory: "Overloads let one function accept different argument shapes and return different precise types based on the inputs.",
      theoryDetail: {
        examples: [
          {
            title: "Q: When and how do function overloads work?",
            description:
              "Write two or more overload signatures above the implementation. Callers see only the overloads — not the implementation signature — so each gets a precise return type.",
            code: `// ── Overload signatures (visible to callers) ─────────────────────
function createElement(tag: 'input'):  HTMLInputElement;
function createElement(tag: 'button'): HTMLButtonElement;
function createElement(tag: 'div'):    HTMLDivElement;
// ── Implementation signature (hidden from callers) ─────────────────
function createElement(tag: string): HTMLElement {
  return document.createElement(tag);
}

const input  = createElement('input');   // HTMLInputElement ✅
const button = createElement('button');  // HTMLButtonElement ✅
const div    = createElement('div');     // HTMLDivElement ✅

// ── Typed event emitter with overloads ─────────────────────────────
interface AppEvents {
  click: { x: number; y: number };
  focus: { target: HTMLElement };
  resize: { width: number; height: number };
}

function on(event: 'click',  handler: (e: AppEvents['click'])  => void): void;
function on(event: 'focus',  handler: (e: AppEvents['focus'])  => void): void;
function on(event: 'resize', handler: (e: AppEvents['resize']) => void): void;
function on(event: string,   handler: (e: unknown) => void): void {
  document.addEventListener(event, handler as EventListener);
}

on('click',  (e) => console.log(e.x, e.y));     // e: { x: number; y: number }
on('focus',  (e) => console.log(e.target));      // e: { target: HTMLElement }
on('resize', (e) => console.log(e.width));       // e: { width: number; height: number }`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
