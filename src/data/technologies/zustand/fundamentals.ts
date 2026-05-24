import type { TopicNode } from "@/data/types";

export const zustandFundamentals: TopicNode = {
  id: "zustand-fundamentals",
  title: "Zustand Fundamentals",
  iconName: "Box",
  link: "https://zustand.docs.pmnd.rs/getting-started/introduction",
  theory:
    "Zustand is a minimal, unopinionated global state management library for React. A store is created with a single create() call — no providers, no reducers, no actions — just a plain object with state and setter functions. Components subscribe to only the slices of state they need, re-rendering only when those slices change.",
  theoryDetail: {
    keyConcepts: [
      "create(): the only API you need — takes an initialiser function and returns a hook; no wrapping Provider required",
      "Selector pattern: components call useStore(state => state.count) — they only re-render when count changes, not on any state change",
      "State + actions together: Zustand stores hold both data and the functions that modify it — no separate action creators or reducers",
      "Immutable updates: use spread or produce (immer middleware) to return new state objects — never mutate directly",
      "Shallow equality: use shallow from zustand/shallow when selecting multiple values to avoid extra re-renders",
      "Outside React: call useStore.getState() and useStore.setState() from anywhere — useful in utils, services, or non-component code",
      "Devtools middleware: wrap create with devtools() to connect to Redux DevTools — see state diffs and time-travel debug",
    ],
    whyItMatters:
      "Zustand has become the leading Redux alternative for client state — it is orders of magnitude less boilerplate than Redux Toolkit while supporting the same patterns. It's used by Vercel, Linear, and many others. Understanding Zustand covers ~80% of what you need for non-trivial client state management.",
    commonPitfalls: [
      "Subscribing to the entire store — useStore() with no selector returns all state and re-renders on any change; always pass a selector",
      "Selecting multiple values without shallow — useStore(s => ({ a: s.a, b: s.b })) returns a new object every render; wrap with shallow",
      "Putting server state in Zustand — server data (fetched from an API) belongs in TanStack Query; Zustand is for UI state (modals, filters, user preferences)",
      "Mutating state directly — Zustand's set replaces state; mutating the current state object directly bypasses change detection",
    ],
    examples: [
      {
        title: "Creating and consuming a Zustand store",
        description:
          "A cart store with typed state, actions, and computed values — all in one create() call.",
        code: `import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { shallow } from "zustand/shallow";

interface CartItem { id: string; name: string; price: number; qty: number; }

interface CartStore {
  // ── State ──────────────────────────────────────────────
  items:   CartItem[];
  isOpen:  boolean;
  // ── Actions ────────────────────────────────────────────
  addItem:    (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string)   => void;
  updateQty:  (id: string, qty: number) => void;
  clearCart:  () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  devtools(
    (set) => ({
      items:  [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + 1 } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: 1 }] };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, qty) =>
        set((state) => ({
          items: qty < 1
            ? state.items.filter((i) => i.id !== id)
            : state.items.map((i) => (i.id === id ? { ...i, qty } : i)),
        })),

      clearCart:  () => set({ items: [] }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    { name: "CartStore" },
  ),
);

// ── Components — each subscribes to only what it needs ──
function CartCount() {
  // Only re-renders when item count changes
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.qty, 0));
  return <span>{count}</span>;
}

function CartActions() {
  // shallow prevents re-render if addItem reference doesn't change
  const { addItem, clearCart } = useCartStore(
    (s) => ({ addItem: s.addItem, clearCart: s.clearCart }),
    shallow,
  );
  // ...
}`,
        language: "typescript",
      },
    ],
  },
};
