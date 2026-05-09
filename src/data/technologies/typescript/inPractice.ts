import type { TopicNode } from "@/data/types";

export const tsInPractice: TopicNode = {
  id: "ts-in-practice",
  title: "TypeScript in Practice",
  iconName: "Rocket",
  theory:
    "TypeScript shines in real-world contexts: typed React components, safe error handling, and bridging the gap between compile-time types and runtime data.",
  theoryDetail: {
    keyConcepts: [
      "TypeScript types don't exist at runtime — JSON from an API is 'unknown' until validated",
      "Runtime validation libraries (Zod, Valibot) parse and validate while inferring TypeScript types",
      "React + TypeScript: ComponentProps, event types, and generic components are the key patterns",
    ],
    whyItMatters:
      "TypeScript's real value is felt in large codebases where you can't hold everything in your head. Typed React props, validated API responses, and narrowed error types catch bugs before users do.",
    commonPitfalls: [
      "Casting API responses to a type with 'as' — this is a lie to the compiler, not a real type guarantee",
      "Skipping runtime validation 'because the API is stable' — schemas change without warning",
      "Not using ErrorBoundary or structured error types, swallowing type information in catch blocks",
    ],
  },
  children: [
    {
      id: "ts-react",
      title: "TypeScript with React",
      iconName: "Layout",
      link: "https://react.dev/learn/typescript",
      theory:
        "React and TypeScript work together via JSX types, component prop interfaces, and typed hooks. Getting these right eliminates an entire class of React bugs.",
      theoryDetail: {
        keyConcepts: [
          "Props interface: define a Props type and pass it as the function parameter type",
          "React.FC<Props> is supported but rarely needed — annotate the function parameter type directly for clarity",
          "Event handlers: React.ChangeEvent<HTMLInputElement>, React.MouseEvent<HTMLButtonElement>",
        ],
        whyItMatters:
          "Typed React components prevent passing wrong props, mistyping event handler signatures, and forgetting required children — all caught at compile time instead of in the browser.",
        commonPitfalls: [
          "Avoid React.FC — since React 18, it no longer adds implicit children; use explicit Props types instead",
          "Typing refs as 'any' instead of the correct HTML element type (HTMLInputElement, etc.)",
          "Not typing generic components explicitly: Component<T> requires the syntax <T,> or <T extends object>",
        ],
        examples: [
          {
            title: "Typed props, events, refs, and generic components",
            description:
              "Production patterns for typing every common React + TypeScript interaction.",
            code: `import { useState, useRef, useCallback } from "react";

// ─── Typed props — no React.FC needed ───
type ButtonProps = {
  label: string;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

function Button({ label, variant = "primary", disabled, onClick }: ButtonProps) {
  return (
    <button className={\`btn-\${variant}\`} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}

// ─── Typed useState + onChange handler ───
function EmailInput() {
  const [email, setEmail] = useState<string>("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value),
    []
  );

  return <input type="email" value={email} onChange={handleChange} />;
}

// ─── Typed useRef ───
function FocusableInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focus() {
    inputRef.current?.focus(); // safe optional chaining
  }

  return <input ref={inputRef} />;
}

// ─── Generic component with explicit type parameter ───
type ListProps<T> = {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
};

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}`,
            language: "tsx",
          },
        ],
      },
    },
    {
      id: "ts-runtime-validation",
      title: "Runtime Validation with Zod",
      iconName: "ShieldCheck",
      link: "https://zod.dev",
      theory:
        "Zod schemas parse and validate data at runtime while inferring TypeScript types automatically — bridging the gap between compile-time and runtime safety.",
      theoryDetail: {
        keyConcepts: [
          "z.infer<typeof schema> extracts the TypeScript type from a Zod schema",
          "schema.parse() throws on invalid data; schema.safeParse() returns { success, data, error }",
          "Schemas compose: z.object({ user: UserSchema }) nests schemas safely",
        ],
        whyItMatters:
          "TypeScript can't validate data from network requests, localStorage, or user input at runtime. Zod validates the shape and populates correct TypeScript types from a single schema definition.",
        commonPitfalls: [
          "Defining the type and schema separately — use z.infer<> to derive the type from the schema",
          "Using schema.parse in production without a try/catch — ZodError is thrown on failure",
          "Overly strict schemas breaking on minor API additions — use z.object().passthrough() or .strip() intentionally",
        ],
        examples: [
          {
            title: "Validate unknown API response before use",
            description:
              "Convert unknown JSON into a trusted type using safeParse and explicit error handling.",
            code: `import { z } from "zod";

// ─── Define schema once — derive the type from it ───
const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(["admin", "member", "viewer"]),
  createdAt: z.string().datetime(),
});

type User = z.infer<typeof UserSchema>;
// { id: string; email: string; role: "admin"|"member"|"viewer"; createdAt: string }

// ─── Nested schema composition ───
const PaginatedUsersSchema = z.object({
  users: z.array(UserSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
});

// ─── Safe validation in an async function ───
async function fetchUsers(page: number) {
  const res = await fetch(\`/api/users?page=\${page}\`);
  const json: unknown = await res.json();

  const parsed = PaginatedUsersSchema.safeParse(json);
  if (!parsed.success) {
    console.error("API response validation failed:", parsed.error.flatten());
    throw new Error("Invalid API response");
  }

  return parsed.data; // typed as z.infer<typeof PaginatedUsersSchema>
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-error-handling",
      title: "Typed Error Handling",
      iconName: "AlertTriangle",
      link: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates",
      theory:
        "TypeScript 4.0+ infers 'unknown' for catch variables. Typed errors use discriminated unions or Result types to make failure states explicit.",
      theoryDetail: {
        keyConcepts: [
          "catch (e: unknown) — always narrow 'e' before accessing any property",
          "Result pattern: type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }",
          "Custom error classes with type guards: function isNetworkError(e: unknown): e is NetworkError",
        ],
        whyItMatters:
          "Untyped catch blocks hide the source of errors. Explicit error types force callers to handle both success and failure paths — making error-prone paths visible during code review.",
        commonPitfalls: [
          "Accessing error.message without narrowing — it may not be an Error instance",
          "Using Result<T> everywhere — it makes happy-path code verbose; use for known, recoverable errors only",
          "Throwing plain strings instead of Error objects — stack traces are lost",
        ],
        examples: [
          {
            title: "Result<T, E> pattern with typed error variants",
            description:
              "Model success and failure as a discriminated union so callers can't ignore error handling.",
            code: `// ─── Result type ───
type Result<T, E = Error> =
  | { ok: true;  value: T }
  | { ok: false; error: E };

// ─── Domain-specific error types ───
class NetworkError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

class ValidationError extends Error {
  constructor(public fields: string[], message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

type FetchError = NetworkError | ValidationError;

// ─── Function that returns Result instead of throwing ───
async function fetchUser(
  id: string
): Promise<Result<{ id: string; name: string }, FetchError>> {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) {
      return { ok: false, error: new NetworkError(res.status, res.statusText) };
    }
    const data = await res.json();
    return { ok: true, value: data };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { ok: false, error: new NetworkError(0, msg) };
  }
}

// ─── Caller is forced to handle both branches ───
const result = await fetchUser("123");
if (result.ok) {
  console.log(result.value.name); // typed: { id: string; name: string }
} else if (result.error instanceof NetworkError) {
  console.error("HTTP", result.error.statusCode);
}`,
            language: "ts",
          },
        ],
      },
    },
    {
      id: "ts-api-design",
      title: "Type-Safe API Design",
      iconName: "Globe",
      link: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
      theory:
        "Designing typed HTTP clients, REST route maps, and WebSocket event systems in TypeScript ensures every request and response is checked at compile time.",
      theoryDetail: {
        keyConcepts: [
          "Route maps: a const object maps route names to paths, typed with keyof + indexed access",
          "Typed fetch client: generic <TResponse, TBody> function for fully typed request/response pairs",
          "WebSocket events: a discriminated union of event types ensures every message is handled",
        ],
        whyItMatters:
          "Typed API clients prevent calling non-existent endpoints, sending wrong payloads, and reading missing response fields — catching integration bugs at compile time.",
        commonPitfalls: [
          "Casting res.json() to a type with 'as' instead of validating with Zod/Valibot",
          "Using string for URL paths when a const route map gives autocomplete and safety",
          "Not versioning API response types — breaking changes in the API surface become visible immediately",
        ],
        examples: [
          {
            title: "Fully typed REST client with route map",
            description:
              "A generic API client where every endpoint, payload, and response type is checked at compile time.",
            code: `import { z } from "zod";

// ─── Route registry ───
const API_ROUTES = {
  getUser:    (id: string)   => \`/api/users/\${id}\`,
  listUsers:  ()             => "/api/users",
  createUser: ()             => "/api/users",
  deleteUser: (id: string)   => \`/api/users/\${id}\`,
} as const;

// ─── Generic typed request helper ───
async function apiRequest<TRes>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  schema: z.ZodType<TRes>,
  body?: unknown
): Promise<TRes> {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body != null ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(\`\${method} \${url} → \${res.status}\`);
  return schema.parse(await res.json());
}

// ─── Typed response schemas ───
const UserSchema = z.object({ id: z.string(), name: z.string(), email: z.string() });
type User = z.infer<typeof UserSchema>;

// ─── Usage: fully type-safe ───
const user = await apiRequest("GET", API_ROUTES.getUser("1"), UserSchema);
// user.name — typed as string, validated at runtime`,
            language: "ts",
          },
        ],
      },
    },
  ],
};
