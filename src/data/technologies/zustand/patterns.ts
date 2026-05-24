import type { TopicNode } from "@/data/types";

export const zustandPatterns: TopicNode = {
  id: "zustand-patterns",
  title: "Slices & Middleware",
  iconName: "Layers",
  link: "https://zustand.docs.pmnd.rs/guides/slices-pattern",
  theory:
    "For large applications, Zustand stores can be split into slices — smaller, composable state modules — and recombined into a single store. Middleware like immer (for structural sharing) and persist (for localStorage sync) extend stores without changing the component API.",
  theoryDetail: {
    keyConcepts: [
      "Slice pattern: define each domain (auth, cart, ui) as its own StateCreator function, then combine them in create() — keeps files focused and testable",
      "immer middleware: write mutating update logic (state.items.push(x)) that Zustand converts to immutable updates internally",
      "persist middleware: sync a slice of the store to localStorage or sessionStorage — survives page refreshes; serialise only what's needed",
      "subscribeWithSelector: lets you subscribe to a specific slice outside React with an equality function — useful in non-component utilities",
      "Typed slices: use StateCreator<StoreType, [], [], SliceType> for full TypeScript inference across combined slices",
    ],
    whyItMatters:
      "The slice pattern is what makes Zustand scale to large apps without turning the store file into an unmaintainable monolith. The persist middleware covers the 'remember user preference' requirement that appears in almost every production app.",
    commonPitfalls: [
      "Persisting sensitive data (tokens, PII) to localStorage — use a sessionStorage or cookie-based approach for security-sensitive state",
      "Persisting derived or async data — only persist the minimal source-of-truth state; derived values can be recomputed",
      "Forgetting to version persisted state — add version + migrate to the persist config to handle schema changes gracefully",
    ],
    examples: [
      {
        title: "Slice pattern + immer + persist",
        description:
          "Two slices composed into one store with immer for ergonomic updates and persist for localStorage sync.",
        code: `import { create, StateCreator } from "zustand";
import { immer }   from "zustand/middleware/immer";
import { persist }  from "zustand/middleware";

// ── Auth slice ────────────────────────────────────────────
interface AuthSlice {
  user: { id: string; name: string } | null;
  login:  (user: AuthSlice["user"]) => void;
  logout: () => void;
}
const createAuthSlice: StateCreator<Store, [["zustand/immer", never]], [], AuthSlice> =
  (set) => ({
    user: null,
    login:  (user) => set((s) => { s.user = user; }),
    logout: ()     => set((s) => { s.user = null; }),
  });

// ── UI slice ──────────────────────────────────────────────
interface UISlice {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  toggleSidebar: () => void;
  setTheme: (t: UISlice["theme"]) => void;
}
const createUISlice: StateCreator<Store, [["zustand/immer", never]], [], UISlice> =
  (set) => ({
    sidebarOpen: false,
    theme:       "light",
    toggleSidebar: () => set((s) => { s.sidebarOpen = !s.sidebarOpen; }),
    setTheme:      (t) => set((s) => { s.theme = t; }),
  });

// ── Combined store ────────────────────────────────────────
type Store = AuthSlice & UISlice;

export const useStore = create<Store>()(
  persist(
    immer((...args) => ({
      ...createAuthSlice(...args),
      ...createUISlice(...args),
    })),
    {
      name:    "app-store",
      version: 1,
      // Only persist auth + theme — not transient UI state
      partialize: (state) => ({ user: state.user, theme: state.theme }),
    },
  ),
);`,
        language: "typescript",
      },
    ],
  },
};
