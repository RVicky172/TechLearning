import type { TopicNode } from "@/data/types";

export const stateManagement: TopicNode = {
  id: "react-state-management",
  title: "State Management (Zustand)",
  iconName: "Database",
  link: "https://zustand-demo.pmnd.rs/",
  theory:
    "Zustand is a minimal, un-opinionated state management library for React. It eliminates the boilerplate of Redux while providing a simple store-based API with automatic React integration. Stores are created outside components, accessed with hooks, and updated immutably. No providers, no reducers, no action creators — just a function that returns your state.",
  theoryDetail: {
    keyConcepts: [
      "create() defines a store — it returns a hook that components call to subscribe to state",
      "set() updates state immutably — Zustand handles re-renders automatically for subscribed components",
      "Selectors (store(state => state.count)) prevent unnecessary re-renders — components only re-render when their selected slice changes",
      "No Provider needed — stores exist outside the React tree, making them easy to access from anywhere",
      "Middleware: persist (localStorage), devtools (Redux DevTools), immer (mutable updates), subscribeWithSelector",
      "Zustand vs Redux: Zustand for small-to-medium apps, Redux for large enterprise apps with complex middleware needs",
    ],
    whyItMatters:
      "React's built-in useState and useContext work well for local and simple global state, but they create prop drilling and context re-render problems at scale. Zustand provides a near-zero-boilerplate solution that scales well, has excellent TypeScript support, and avoids the Provider-wrapping ceremony that Context and Redux require.",
    commonPitfalls: [
      "Subscribing to the entire store (useStore()) instead of selecting specific slices — causes unnecessary re-renders",
      "Putting everything in one store — split stores by domain (useAuthStore, useCartStore, useUIStore)",
      "Forgetting that set() does a shallow merge by default — nested objects need manual spreading",
      "Using Zustand for server state (API data) — that's TanStack Query's job; Zustand is for client state",
      "Not using the devtools middleware during development — it connects to Redux DevTools for free debugging",
    ],
    examples: [
      {
        title: "Basic Zustand Store",
        description:
          "Create a store, use selectors, and update state. No Provider needed.",
        code: `import { create } from 'zustand';

// ── Define the store ──
interface CounterStore {
  count: number;
  step: number;
  increment: () => void;
  decrement: () => void;
  setStep: (step: number) => void;
  reset: () => void;
}

const useCounterStore = create<CounterStore>((set) => ({
  count: 0,
  step: 1,
  increment: () => set((state) => ({ count: state.count + state.step })),
  decrement: () => set((state) => ({ count: state.count - state.step })),
  setStep: (step) => set({ step }),
  reset: () => set({ count: 0, step: 1 }),
}));

// ── Use in components with selectors ──
function Counter() {
  // ✅ Only re-renders when count changes
  const count = useCounterStore((s) => s.count);
  const increment = useCounterStore((s) => s.increment);

  return <button onClick={increment}>Count: {count}</button>;
}

function StepControls() {
  // ✅ Only re-renders when step changes
  const step = useCounterStore((s) => s.step);
  const setStep = useCounterStore((s) => s.setStep);

  return (
    <select value={step} onChange={(e) => setStep(Number(e.target.value))}>
      <option value={1}>Step: 1</option>
      <option value={5}>Step: 5</option>
      <option value={10}>Step: 10</option>
    </select>
  );
}

// ❌ Anti-pattern: subscribing to entire store
// const { count, step, increment } = useCounterStore();
// → Re-renders when ANY state changes`,
        language: "tsx",
      },
      {
        title: "Zustand with Middleware",
        description:
          "Add persistence (localStorage), devtools (Redux DevTools), and immer (mutable-style updates).",
        code: `import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface TodoStore {
  todos: Array<{ id: string; text: string; done: boolean }>;
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
}

const useTodoStore = create<TodoStore>()(
  devtools(              // ← Connects to Redux DevTools
    persist(             // ← Saves to localStorage
      immer((set) => ({  // ← Allows mutable-style updates
        todos: [],

        addTodo: (text) => set((state) => {
          // With immer, you can "mutate" — it creates a new immutable copy
          state.todos.push({
            id: crypto.randomUUID(),
            text,
            done: false,
          });
        }),

        toggleTodo: (id) => set((state) => {
          const todo = state.todos.find((t) => t.id === id);
          if (todo) todo.done = !todo.done;  // ✅ Safe with immer
        }),

        removeTodo: (id) => set((state) => {
          state.todos = state.todos.filter((t) => t.id !== id);
        }),
      })),
      { name: 'todo-storage' }  // localStorage key
    ),
    { name: 'TodoStore' }       // DevTools display name
  )
);

// ── Usage ──
function TodoList() {
  const todos = useTodoStore((s) => s.todos);
  const toggleTodo = useTodoStore((s) => s.toggleTodo);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <label>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}`,
        language: "tsx",
      },
      {
        title: "Zustand vs Context vs Redux",
        description:
          "When to use each state management approach — a decision framework.",
        code: `// ═══════════════════════════════════════════
// WHEN TO USE WHAT — Decision Framework
// ═══════════════════════════════════════════

// ── 1. useState/useReducer ──
// ✅ Local component state (form inputs, toggles, modals)
// ✅ State that only 1-2 components need
// ✅ Simple parent → child data flow
// Example: modal open/close, form input values

// ── 2. React Context ──
// ✅ Dependency injection (theme, locale, auth status)
// ✅ Values that rarely change
// ⚠️  Every consumer re-renders when context value changes
// Example: theme toggle, current user, feature flags

// ── 3. Zustand ──
// ✅ Shared client state across many components
// ✅ Frequent updates without re-render cascades
// ✅ State that needs persistence or middleware
// ✅ Small-to-medium apps, or per-domain stores in large apps
// Example: shopping cart, UI preferences, notification queue

// ── 4. Redux Toolkit ──
// ✅ Very large teams needing strict conventions
// ✅ Complex middleware pipelines (sagas, thunks)
// ✅ Time-travel debugging is critical
// ⚠️  More boilerplate than Zustand
// Example: enterprise dashboards, financial apps

// ── 5. TanStack Query (NOT state management) ──
// ✅ Server state: API responses, database data
// ✅ Automatic caching, background refetching, deduplication
// ✅ Use alongside Zustand/Redux for client state
// Example: user lists, product catalog, search results

// ═══════════════════════════════════════════
// RULE OF THUMB:
//   Server state → TanStack Query
//   Local state  → useState
//   Theme/Auth   → Context
//   Shared UI    → Zustand
//   Enterprise   → Redux Toolkit
// ═══════════════════════════════════════════`,
        language: "typescript",
      },
    ],
  },
};
