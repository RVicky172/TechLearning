import type { TopicNode } from "@/data/types";

export const typescriptReact: TopicNode = {
  id: "react-typescript",
  title: "TypeScript with React",
  iconName: "FileType",
  link: "https://react.dev/learn/typescript",
  theory:
    "TypeScript adds static type checking to React, catching bugs at compile time instead of runtime. Properly typing props, state, events, refs, and context makes components self-documenting and prevents an entire class of runtime errors. Modern React's type inference is excellent — you need far fewer explicit annotations than you might expect.",
  theoryDetail: {
    keyConcepts: [
      "Props are typed with interfaces or type aliases — React.FC is discouraged; type props inline or separately",
      "useState infers types from the initial value; use generics (useState<Type>) only when the initial value is null or ambiguous",
      "Event handlers use React's built-in event types: React.ChangeEvent<HTMLInputElement>, React.MouseEvent<HTMLButtonElement>",
      "useRef<HTMLElement>(null) types DOM refs; useRef<Type>(initialValue) types mutable refs",
      "Children are typed as React.ReactNode (anything renderable) or React.ReactElement (JSX only)",
      "Discriminated unions model component variants (button vs link, loading vs loaded vs error)",
    ],
    whyItMatters:
      "TypeScript eliminates the most common React bugs: wrong prop types, missing required props, typos in event handlers, and incorrect state shapes. It also provides incredible IDE autocomplete that makes development faster, not slower. Every production React codebase should use TypeScript.",
    commonPitfalls: [
      "Using `any` to silence errors — this defeats the purpose of TypeScript entirely",
      "Over-typing with React.FC — it adds children implicitly and has generics issues; use plain function declarations",
      "Not using discriminated unions for state — modeling loading/success/error as separate booleans leads to impossible states",
      "Typing event handlers with generic `Event` instead of React's specific event types",
      "Forgetting to type the generic parameter of createContext — leads to null assertion issues everywhere",
    ],
    examples: [
      {
        title: "Component Props Patterns",
        description:
          "Different ways to type React component props — from simple to advanced discriminated unions.",
        code: `// ── Basic Props ──
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';  // Union type
  disabled?: boolean;
  onClick: () => void;
}

function Button({ label, variant = 'primary', disabled, onClick }: ButtonProps) {
  return (
    <button className={\`btn btn--\${variant}\`} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}

// ── Children Props ──
interface CardProps {
  title: string;
  children: React.ReactNode;  // Accepts anything renderable
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

// ── Discriminated Union Props ──
// The component is EITHER a button OR a link — never both
type ActionProps =
  | { as: 'button'; onClick: () => void; href?: never }
  | { as: 'link'; href: string; onClick?: never };

function Action(props: ActionProps & { children: React.ReactNode }) {
  if (props.as === 'link') {
    return <a href={props.href}>{props.children}</a>;
  }
  return <button onClick={props.onClick}>{props.children}</button>;
}

// ✅ Valid: <Action as="button" onClick={handleClick}>Click</Action>
// ✅ Valid: <Action as="link" href="/about">About</Action>
// ❌ Error: <Action as="button" href="/about">  // href not allowed on button`,
        language: "tsx",
      },
      {
        title: "Typing Hooks",
        description:
          "useState, useRef, and useReducer with proper TypeScript generics.",
        code: `import { useState, useRef, useReducer, useEffect } from 'react';

// ── useState: inferred vs explicit ──
function UserProfile() {
  const [name, setName] = useState('');           // inferred: string
  const [age, setAge] = useState(0);              // inferred: number
  const [user, setUser] = useState<User | null>(null); // explicit: starts as null

  // ── useRef: DOM ref vs mutable ref ──
  const inputRef = useRef<HTMLInputElement>(null);      // DOM ref (readonly .current)
  const timerRef = useRef<ReturnType<typeof setInterval>>();  // Mutable ref

  useEffect(() => {
    inputRef.current?.focus();  // Safe: null-checked with ?.
    timerRef.current = setInterval(() => {}, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  return <input ref={inputRef} value={name} onChange={e => setName(e.target.value)} />;
}

// ── useReducer: discriminated union actions ──
type State = { count: number; step: number };
type Action =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'setStep'; payload: number }
  | { type: 'reset' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'increment':  return { ...state, count: state.count + state.step };
    case 'decrement':  return { ...state, count: state.count - state.step };
    case 'setStep':    return { ...state, step: action.payload };
    case 'reset':      return { count: 0, step: 1 };
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, { count: 0, step: 1 });

  return (
    <div>
      <p>{state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+{state.step}</button>
      <button onClick={() => dispatch({ type: 'setStep', payload: 5 })}>Step=5</button>
      {/* ❌ TS Error: { type: 'setStep' } — missing payload */}
    </div>
  );
}`,
        language: "tsx",
      },
      {
        title: "Typing Events & Forms",
        description:
          "React provides specific event types for every HTML element. Use them for precise autocomplete and type safety.",
        code: `import { useState, type FormEvent, type ChangeEvent } from 'react';

// Event handler types for common interactions
function EventExamples() {
  const [value, setValue] = useState('');

  // ── Typed change handler ──
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);  // ✅ e.target is HTMLInputElement
  };

  // ── Typed form submission ──
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log(formData.get('email'));
  };

  // ── Typed click handler ──
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.clientX, e.clientY);
  };

  // ── Typed keyboard handler ──
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Submit!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        type="email"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" onClick={handleClick}>Submit</button>
    </form>
  );
}

// ── Generic reusable handler ──
function useField<T extends HTMLInputElement | HTMLTextAreaElement>(initial: string) {
  const [value, setValue] = useState(initial);
  const onChange = (e: ChangeEvent<T>) => setValue(e.target.value);
  return { value, onChange } as const;
}`,
        language: "tsx",
      },
      {
        title: "Typing Context with Custom Hook",
        description:
          "Type-safe context pattern that eliminates null checks at every consumer.",
        code: `import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

// ── Define the context shape ──
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

// ✅ Start with null — the hook will enforce the Provider check
const AuthContext = createContext<AuthContextType | null>(null);

// ✅ Custom hook — throws if used outside Provider
// Consumers get AuthContextType (never null)
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;  // TypeScript narrows: AuthContextType (not null)
}

// ── Provider ──
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthContextType>(() => ({
    user,
    isAuthenticated: user !== null,
    login: async (creds) => {
      const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify(creds),
      });
      setUser(await res.json());
    },
    logout: () => setUser(null),
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Consumer — fully type-safe, no null checks ──
function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  //      ^? User | null — but isAuthenticated narrows it

  if (!isAuthenticated) return <LoginButton />;
  return <button onClick={logout}>Logout {user!.name}</button>;
}`,
        language: "tsx",
      },
    ],
  },
};
