import type { TopicNode } from "@/data/types";

export const reactPerformanceOptimization: TopicNode = {
  id: "react-performance-optimization",
  title: "React Performance & Optimization",
  iconName: "Gauge",
  theory:
    "Performance work in React starts with measurement, not guesswork. Profile slow interactions, identify expensive renders, and then apply targeted optimizations — the React Compiler, derived state, debounce/throttle, component splitting, context optimisation, list virtualization, and concurrency APIs.",
  theoryDetail: {
    keyConcepts: [
      "Profile first with React DevTools Profiler to find real bottlenecks before optimizing",
      "React Compiler (React 19+) auto-memoises components and hooks — eliminates most manual useMemo/useCallback/React.memo",
      "Derived state — compute values from existing state instead of storing and syncing redundant state",
      "Debounce & throttle — rate-limit expensive callbacks (search, resize, scroll) to reduce render frequency",
      "Split large components into smaller focused ones so expensive subtrees are isolated from unrelated state",
      "Context optimisation — split contexts by update frequency and use selectors to prevent broad re-renders",
      "Virtualize large lists so the DOM only contains the visible rows",
      "Use useTransition/useDeferredValue to keep urgent updates responsive while expensive work runs in the background",
    ],
    whyItMatters:
      "Most React performance issues come from unnecessary rendering. A systematic workflow — measure, isolate, fix one thing, verify — keeps apps fast at scale without premature complexity.",
    commonPitfalls: [
      "Adding manual useMemo/useCallback everywhere when the React Compiler handles it automatically",
      "Syncing derived values with useEffect/useState instead of computing them inline",
      "Storing too much state high in the tree, causing broad re-renders across unrelated subtrees",
      "Putting all app data into a single Context, making every consumer re-render on any change",
      "Forgetting to debounce expensive event handlers (search inputs, window resize listeners)",
      "Rendering huge lists without virtualization",
    ],
  },
  children: [
    {
      id: "react-performance-playbook",
      title: "Optimization Playbook",
      iconName: "ListChecks",
      link: "https://react.dev/reference/react/Profiler",
      theory:
        "A practical sequence for real projects: establish a performance baseline, identify the real bottleneck with the React DevTools Profiler, apply one focused change, then verify the improvement before moving on.",
      theoryDetail: {
        keyConcepts: [
          "Always measure before optimising — perceived slowness is rarely where you assume it is",
          "React DevTools Profiler records which components rendered, why they rendered, and how long each took",
          "A 'commit' in the Profiler = one synchronous batch of DOM updates — look for commits that exceed 16 ms (60 fps budget)",
          "Self time = time spent in the component's own render function; Total time includes all its children",
          "The <Profiler> API lets you collect render timings programmatically in production builds",
          "Track Core Web Vitals (INP, LCP, CLS) with Lighthouse or the `web-vitals` library to measure real-user impact",
          "CI performance budgets catch regressions automatically before they reach production",
        ],
        whyItMatters:
          "Optimising without profiling wastes time and adds complexity where none is needed. One slow component found by the profiler — not guessed — can explain an entire janky interaction and be fixed in minutes.",
        commonPitfalls: [
          "Optimising components that are not in the hot path — no user-visible benefit, just added complexity",
          "Profiling in development mode — React runs extra safety checks that inflate render times; always profile a production build",
          "Fixing render count without checking render duration — 10 fast renders beat 1 slow one",
          "Ignoring the network as a bottleneck — a slow API response often feels like a slow render",
        ],
        examples: [
          {
            title: "Reading the React DevTools Profiler",
            description:
              "Step-by-step workflow for finding the real bottleneck in a slow interaction.",
            code: `// 1. Open React DevTools → Profiler tab
// 2. Click the record button and trigger the slow interaction
// 3. Click Stop — you'll see a flame chart of every commit

// What to look for:
// - Commits taller than 16 ms (exceeds the 60fps budget)
// - Components highlighted in yellow/red (highest self time)
// - A component rendering far more often than expected

// Once found, check the "Why did this render?" sidebar panel:
// "Props changed"   → stabilise the prop reference (useMemo / useCallback)
// "State changed"   → check if the state update is actually necessary
// "Context changed" → consider splitting the context by update frequency`,
            language: "javascript",
          },
          {
            title: "<Profiler> API for production monitoring",
            description:
              "Wrap any subtree to collect real-user render timings and send them to your analytics pipeline.",
            code: `import { Profiler, type ProfilerOnRenderCallback } from "react";

const onRender: ProfilerOnRenderCallback = (
  id,             // the id prop of the <Profiler>
  phase,          // "mount" | "update" | "nested-update"
  actualDuration  // ms spent rendering this commit
) => {
  if (actualDuration > 16) {
    analytics.track("slow_render", { component: id, phase, actualDuration });
  }
};

export function App() {
  return (
    <Profiler id="ProductList" onRender={onRender}>
      <ProductList />
    </Profiler>
  );
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "react-performance-rendering",
      title: "Rendering and Memoization",
      iconName: "Layers",
      link: "https://react.dev/reference/react/memo",
      theory:
        "A component re-renders when its state changes, its parent re-renders, or a context it reads changes. Memoization lets you skip re-renders when inputs haven't changed — but only apply it after profiling confirms the render is actually expensive.",
      theoryDetail: {
        keyConcepts: [
          "React re-renders a component when: its own state changes, its parent re-renders (even with identical props), or a context it consumes changes",
          "`React.memo(Component)` — wraps a component and skips re-render if all props pass a shallow equality check",
          "`useMemo(fn, deps)` — caches a computed value; only recomputes when a dependency changes",
          "`useCallback(fn, deps)` — caches a function reference; equivalent to `useMemo(() => fn, deps)`",
          "Referential equality: `{} !== {}` — a new object or array literal created in render breaks React.memo every time",
          "The React Compiler (React 19+) inserts memoisation automatically — check whether it is enabled before adding it manually",
          "`key` prop forces a full remount and clears all local state — useful for intentionally resetting a subtree",
        ],
        whyItMatters:
          "Understanding what triggers a render — and what doesn't — is the foundation of all React performance work. Misapplied memoisation adds memory overhead and dependency-array bugs without any visible benefit; correctly applied it eliminates expensive renders in critical paths.",
        commonPitfalls: [
          "Wrapping a component in React.memo but passing an unstable prop (new object or function each render) — memo never skips",
          "Adding useCallback to functions passed to non-memoised children — no benefit at all",
          "Using an empty `[]` deps array when the computation depends on props — stale closure bug",
          "Memoising cheap string or boolean derivations — useMemo's own overhead can exceed the savings",
        ],
        comparisons: [
          {
            title: "React.memo vs useMemo vs useCallback",
            points: [
              "React.memo — component-level; skips an entire subtree re-render when props are shallowly equal",
              "useMemo — value-level; caches a computed result inside a component between renders",
              "useCallback — function-level; caches a function reference so memoised children aren't invalidated",
              "With the React Compiler enabled all three are handled automatically — manual wrappers become redundant",
            ],
          },
        ],
        examples: [
          {
            title: "React.memo with a stable callback via useCallback",
            description:
              "Without useCallback the memo wrapper is useless — the function reference changes on every parent render.",
            code: `import { memo, useCallback, useState } from "react";

// Memoised child — only re-renders when 'label' or 'onRemove' changes by reference
const Tag = memo(function Tag({ label, onRemove }: { label: string; onRemove: () => void }) {
  console.log("Tag rendered:", label);
  return <button onClick={onRemove}>{label}</button>;
});

export function TagList() {
  const [tags, setTags] = useState(["react", "typescript", "nextjs"]);

  // ✅ Stable reference — Tag's memo check passes on subsequent renders
  const handleRemove = useCallback(
    (tag: string) => setTags((prev) => prev.filter((t) => t !== tag)),
    [] // no deps — setTags identity is stable
  );

  return (
    <ul>
      {tags.map((tag) => (
        // Inline arrow is fine here because Tag receives onRemove as a stable ref
        <Tag key={tag} label={tag} onRemove={() => handleRemove(tag)} />
      ))}
    </ul>
  );
}`,
            language: "typescript",
          },
          {
            title: "useMemo for an expensive derived list",
            description:
              "Sorting 10,000 employees on every render is wasteful — useMemo limits it to when the source data actually changes.",
            code: `import { useMemo } from "react";

interface Employee { id: string; name: string; department: string; salary: number; }

function EmployeeTable({
  employees,
  departmentFilter,
}: {
  employees: Employee[];
  departmentFilter: string;
}) {
  // Recomputes only when employees or departmentFilter changes
  const sorted = useMemo(
    () =>
      employees
        .filter((e) => e.department === departmentFilter)
        .sort((a, b) => b.salary - a.salary),
    [employees, departmentFilter]
  );

  return (
    <table>
      <tbody>
        {sorted.map((e) => (
          <tr key={e.id}>
            <td>{e.name}</td>
            <td>{e.salary.toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "react-compiler-perf",
      title: "React Compiler",
      iconName: "Cpu",
      link: "https://react.dev/learn/react-compiler",
      theory:
        "The React Compiler (stable in React 19) automatically memoises every component and hook, removing the need for manual React.memo, useMemo, and useCallback in the vast majority of cases.",
      theoryDetail: {
        keyConcepts: [
          "Analyses your code at build time and inserts memoisation automatically",
          "Understands React's rules (pure renders, stable hooks) to know exactly what is safe to cache",
          "Enabled in Next.js 16+ via `reactCompiler: true` in next.config.ts plus `babel-plugin-react-compiler`",
          "Works alongside existing manual memoisation — you can migrate incrementally",
          "`'use no memo'` directive opts a single file out if the compiler's output needs to be overridden",
          "React DevTools shows a '✦ Memo' badge on compiler-optimised components",
        ],
        whyItMatters:
          "Manual memoisation is error-prone and easy to get wrong (stale closures, over-memoising, incorrect deps). The compiler eliminates the entire category of mistakes and reduces boilerplate significantly.",
        commonPitfalls: [
          "Still writing manual useMemo/useCallback after enabling the compiler — the compiler handles it, the manual calls become redundant",
          "Violating the Rules of React (mutating props, impure renders) causes the compiler to bail out silently on that component",
          "Expecting the compiler to optimise server components — it only targets client-side rendering",
        ],
        comparisons: [
          {
            title: "Before and after the React Compiler",
            points: [
              "Before: manually wrap every stable callback with useCallback to avoid invalidating child memo",
              "After: write plain functions — the compiler inserts the equivalent memoisation at build time",
              "Before: wrap expensive derivations with useMemo and maintain dependency arrays",
              "After: compute values inline — the compiler tracks stability and caches automatically",
            ],
          },
        ],
        examples: [
          {
            title: "Enabling the React Compiler in Next.js 16",
            description:
              "Install the Babel plugin and set the top-level config key. No other code changes needed.",
            code: `// 1. Install the plugin
// npm install -D babel-plugin-react-compiler

// 2. next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true, // top-level key in Next.js 16+
};

export default nextConfig;`,
            language: "typescript",
          },
          {
            title: "Code you no longer need to write manually",
            description:
              "The compiler produces equivalent output for both patterns without any directives.",
            code: `// ❌ Before — manual memoisation boilerplate
import { useCallback, useMemo, memo } from "react";

const ProductCard = memo(function ProductCard({ product, onAdd }) {
  const label = useMemo(
    () => \`\${product.name} — \$\{product.price.toFixed(2)}\`,
    [product.name, product.price]
  );
  const handleClick = useCallback(() => onAdd(product.id), [onAdd, product.id]);

  return <button onClick={handleClick}>{label}</button>;
});

// ✅ After — plain code, compiler handles memoisation
function ProductCard({ product, onAdd }) {
  const label = \`\${product.name} — \$\{product.price.toFixed(2)}\`;
  return <button onClick={() => onAdd(product.id)}>{label}</button>;
}`,
            language: "typescript",
          },
          {
            title: "Opting a file out with 'use no memo'",
            description:
              "Escape hatch for the rare case where you need to control memoisation yourself.",
            code: `"use no memo"; // place at the top of the file

// The compiler skips this entire module.
// Use sparingly — only when the compiler's output conflicts
// with intentional side-effect-heavy code.
export function LegacyWidget() {
  // ... complex imperative code
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "react-derived-state",
      title: "Derived State",
      iconName: "GitMerge",
      theory:
        "Derived state is any value that can be computed from existing state or props. Computing it inline during render is always preferable to storing it as separate state and syncing it with useEffect.",
      theoryDetail: {
        keyConcepts: [
          "If a value can be calculated from props or state, it is derived — do not put it in useState",
          "Derived values computed inline are always in sync with their source — no lag, no bugs",
          "useEffect + useState to sync derived data is an anti-pattern that adds an extra render cycle",
          "useMemo caches an expensive derivation so it only recomputes when its inputs change",
          "For cheap derivations, a plain variable is sufficient — useMemo only for measurably expensive ones",
        ],
        whyItMatters:
          "Redundant state is one of the most common sources of subtle bugs in React — stale values, missed syncs, and unnecessary renders. Deriving values inline eliminates all three at once.",
        commonPitfalls: [
          "Using useEffect to copy a prop into state — creates a stale local copy that can drift",
          "Wrapping cheap string/boolean derivations in useMemo — adds overhead with no benefit",
          "Deriving the same value in multiple components instead of lifting or memoising it once",
        ],
        comparisons: [
          {
            title: "Redundant state vs derived value",
            points: [
              "Redundant: `const [fullName, setFullName] = useState('')` synced via useEffect from first/last",
              "Derived: `const fullName = \`\${first} \${last}\`` — always correct, zero extra renders",
              "Redundant: storing `isLoggedIn` state separately from `user` state",
              "Derived: `const isLoggedIn = user !== null` — single source of truth",
            ],
          },
        ],
        examples: [
          {
            title: "Replace useEffect sync with inline derivation",
            description: "Common anti-pattern and its correct replacement.",
            code: `// ❌ Anti-pattern — useEffect syncing redundant state
function UserGreeting({ firstName, lastName }) {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(\`\${firstName} \${lastName}\`);
  }, [firstName, lastName]);

  return <h1>Hello, {fullName}</h1>; // one render behind on mount
}

// ✅ Derived inline — always in sync, no extra state
function UserGreeting({ firstName, lastName }) {
  const fullName = \`\${firstName} \${lastName}\`; // derived directly
  return <h1>Hello, {fullName}</h1>;
}`,
            language: "typescript",
          },
          {
            title: "useMemo for expensive derivations only",
            description:
              "Profile before reaching for useMemo — use it only when the computation is measurably slow.",
            code: `import { useMemo } from "react";

interface Product { id: string; price: number; inStock: boolean; }

function ProductList({ products, minPrice }: { products: Product[]; minPrice: number }) {
  // Plain derivation — fast, no memo needed
  const count = products.length;

  // useMemo — worth it only if products is large and filtering is measurably expensive
  const filtered = useMemo(
    () => products.filter((p) => p.inStock && p.price >= minPrice),
    [products, minPrice]
  );

  return (
    <p>{count} total, {filtered.length} available above \${minPrice}</p>
  );
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "react-debounce-throttle-perf",
      title: "Debounce & Throttle",
      iconName: "Timer",
      theory:
        "Debouncing delays a function call until the user stops triggering it. Throttling limits it to once per interval. Both patterns reduce the frequency of expensive operations like API calls, state updates, or DOM measurements.",
      theoryDetail: {
        keyConcepts: [
          "Debounce — fires once after the user pauses (ideal for search inputs, form validation)",
          "Throttle — fires at most once per time window (ideal for scroll, resize, mousemove)",
          "Wrap the debounced/throttled function in useRef or useCallback so the timer identity is stable across renders",
          "Clean up timers in useEffect return to prevent memory leaks and stale callbacks",
          "Libraries: `lodash.debounce`, `lodash.throttle`, or the lightweight `use-debounce` React hook",
        ],
        commonPitfalls: [
          "Creating a new debounced function inside render — resets the timer on every re-render, defeating the purpose",
          "Not cleaning up the timer on unmount — causes setState calls on an unmounted component",
          "Debouncing the state setter itself instead of the handler — causes confusing stale closure bugs",
          "Using debounce when throttle is more appropriate (e.g. scroll position needs regular updates, not just the last one)",
        ],
        examples: [
          {
            title: "Debounced search input",
            description:
              "Delay the API call until the user stops typing for 400 ms.",
            code: `import { useState, useEffect, useRef } from "react";

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setQuery(value); // update input immediately

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onSearch(value); // API call fires 400 ms after the last keystroke
    }, 400);
  }

  // Clean up on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return <input value={query} onChange={handleChange} placeholder="Search…" />;
}`,
            language: "typescript",
          },
          {
            title: "Throttled scroll handler",
            description:
              "Fire the scroll callback at most once every 200 ms to avoid layout thrashing.",
            code: `import { useEffect, useRef } from "react";

function useThrottledScroll(callback: (y: number) => void, interval = 200) {
  const lastRun = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function handleScroll() {
      const now = Date.now();
      if (now - lastRun.current >= interval) {
        lastRun.current = now;
        callback(window.scrollY);
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback, interval]);
}

// Usage
export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useThrottledScroll((y) => setScrolled(y > 60));
  return <nav data-scrolled={scrolled}>…</nav>;
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "react-component-splitting",
      title: "Splitting Components",
      iconName: "Scissors",
      theory:
        "Breaking a large component into smaller focused ones isolates state changes so that only the subtree that cares about a piece of data re-renders. It also makes memoisation and lazy loading practical.",
      theoryDetail: {
        keyConcepts: [
          "Each component re-renders when its own state or props change — smaller components = smaller re-render surface",
          "Extract expensive, stable subtrees into separate components so React.memo or the compiler can skip them",
          "Colocate state in the smallest component that needs it (state colocation)",
          "The 'children as props' pattern lets a parent pass JSX without causing children to re-render on parent state change",
          "Lazy-load heavy leaf components with next/dynamic or React.lazy so they don't bloat the initial bundle",
        ],
        whyItMatters:
          "A monolithic component with mixed concerns forces every state change to re-render the entire tree. Splitting by responsibility makes render boundaries explicit and optimization natural.",
        commonPitfalls: [
          "Splitting components purely for style without thinking about render boundaries — no performance benefit",
          "Keeping state in a parent when only one child uses it — any sibling update triggers the child too",
          "Splitting so aggressively that component communication becomes tangled prop chains",
        ],
        examples: [
          {
            title: "Isolating fast-changing state from stable siblings",
            description:
              "Move the query state down so the expensive Results and Header don't re-render on every keystroke.",
            code: `// ❌ Before — query lives at page level, Header and Results re-render on every keystroke
function SearchPage() {
  const [query, setQuery] = useState("");
  return (
    <>
      <Header />                        {/* re-renders on every keystroke */}
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Results query={query} />         {/* expected — but Header is wasteful */}
    </>
  );
}

// ✅ After — query is colocated in SearchBar; Header is completely isolated
function SearchPage() {
  return (
    <>
      <Header />      {/* never re-renders due to typing */}
      <SearchBar />   {/* owns query state internally */}
    </>
  );
}

function SearchBar() {
  const [query, setQuery] = useState("");
  return (
    <>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <Results query={query} />
    </>
  );
}`,
            language: "typescript",
          },
          {
            title: "Children-as-props pattern",
            description:
              "Pass stable JSX as children so the parent can change state without re-rendering the children.",
            code: `// The wrapper manages scroll/expand state but children don't re-render
function ExpandablePanel({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)}>Toggle</button>
      {open && <div>{children}</div>}
    </div>
  );
}

// children (ExpensiveChart) is created by the parent once — no re-render on toggle
function Dashboard() {
  return (
    <ExpandablePanel>
      <ExpensiveChart />
    </ExpandablePanel>
  );
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "react-context-optimization",
      title: "Context Optimizations",
      iconName: "Share2",
      theory:
        "Every consumer of a Context re-renders whenever the context value changes. The key optimisations are splitting contexts by update frequency, memoising the value object, and using selector patterns to subscribe only to the slice you need.",
      theoryDetail: {
        keyConcepts: [
          "Context is not a performance tool — it is a data distribution tool; misuse causes cascading re-renders",
          "Split a fat context into multiple smaller ones grouped by how often each slice changes",
          "Memoise the value object with useMemo so referential equality is preserved when content hasn't changed",
          "Stable callbacks in context must be wrapped in useCallback (or handled by the React Compiler)",
          "For high-frequency updates (animations, cursors) prefer Zustand, Jotai, or Valtio over Context",
          "`use(Context)` (React 19) is equivalent to `useContext` but works inside async components and transitions",
        ],
        whyItMatters:
          "A single monolithic context that mixes auth state, theme, and UI flags will re-render every consumer on every minor change. Splitting by update frequency targets re-renders precisely.",
        commonPitfalls: [
          "Creating the context value as an inline object literal `{ user, setUser }` — new reference every render, all consumers re-render",
          "Putting frequently-updated state (e.g. mouse position) into a context consumed by many components",
          "Nesting too many providers at the root — impacts readability and makes debugging harder",
          "Forgetting that context bypasses React.memo — memoised children still re-render if they read a changed context",
        ],
        comparisons: [
          {
            title: "Single fat context vs split contexts",
            points: [
              "Fat: one AuthContext holding user, theme, locale, and cart — any change re-renders all consumers",
              "Split: UserContext (rare changes), ThemeContext (toggle only), CartContext (frequent) — each consumer opts in precisely",
              "Fat: impossible to memoise the value object stably when any field can change",
              "Split: each context value is small and easy to memoise independently",
            ],
          },
        ],
        examples: [
          {
            title: "Memoising the context value to prevent spurious re-renders",
            description:
              "Without useMemo, a new value object is created on every render, invalidating all consumers.",
            code: `import { createContext, useContext, useMemo, useState } from "react";

interface AuthContextValue {
  user: User | null;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Memoised — new object only created when user changes
  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      login: async (creds) => {
        const u = await fetchUser(creds);
        setUser(u);
      },
      logout: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};`,
            language: "typescript",
          },
          {
            title: "Split contexts by update frequency",
            description:
              "Separate the rarely-changing user object from the frequently-changing cart count.",
            code: `// UserContext — changes only on login/logout
const UserContext = createContext<User | null>(null);

// CartContext — changes on every add/remove
const CartContext = createContext<CartState>({ items: [], total: 0 });

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </UserProvider>
  );
}

// A product card only reads CartContext — it never re-renders on user changes
function AddToCartButton({ productId }: { productId: string }) {
  const { addItem } = useContext(CartContext);
  return <button onClick={() => addItem(productId)}>Add to Cart</button>;
}

// The nav avatar only reads UserContext — it never re-renders on cart changes
function UserAvatar() {
  const user = useContext(UserContext);
  return <img src={user?.avatar} alt={user?.name} />;
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "react-performance-lists",
      title: "Lists, Virtualization, and Windowing",
      iconName: "Rows3",
      link: "https://web.dev/articles/virtualize-long-lists-react-window",
      theory:
        "Rendering thousands of DOM nodes at once causes slow initial paint, heavy memory use, and janky scrolling. Virtualization (windowing) renders only the rows visible in the viewport and recycles them as the user scrolls.",
      theoryDetail: {
        keyConcepts: [
          "Virtualization renders a fixed window of rows regardless of list length — O(1) DOM nodes instead of O(n)",
          "`react-window` and `TanStack Virtual` are the two main windowing libraries for React",
          "`FixedSizeList` — all rows are the same height; fastest option",
          "`VariableSizeList` — rows can have different heights; requires an `itemSize` callback",
          "Memoise the row component with React.memo so recycling doesn't trigger full re-renders",
          "Always provide a stable `key` prop — avoid index keys on lists that can be reordered or filtered",
          "For data tables: TanStack Table + TanStack Virtual is the production-grade combination",
        ],
        whyItMatters:
          "A list of 10,000 rows without virtualization creates 10,000 DOM nodes on mount. Browsers handle ~200–300 complex nodes comfortably. Virtualization keeps the DOM size constant regardless of data size — paint time stays fast at any scale.",
        commonPitfalls: [
          "Not giving the list container a fixed height — virtualization breaks without a known viewport size",
          "Defining the row component inline inside the parent render — creates a new component type each render, forcing full row remounts on every scroll",
          "Using `index` as the row key on a filtered or sorted list — causes stale renders when the order changes",
          "Applying virtualization to small lists (<100 rows) where normal rendering is already fast",
        ],
        examples: [
          {
            title: "FixedSizeList with react-window",
            description:
              "50,000 rows rendered with only ~12 DOM nodes in the viewport at any time.",
            code: `import { FixedSizeList, type ListChildComponentProps } from "react-window";
import { memo } from "react";

interface Item { id: string; name: string; score: number; }

// ✅ Defined outside the parent — stable component type, no remounts on scroll
const Row = memo(function Row({ index, style, data }: ListChildComponentProps<Item[]>) {
  const item = data[index];
  return (
    // 'style' from react-window positions the row absolutely — required
    <div style={style} className="flex items-center gap-4 px-4 border-b">
      <span className="font-mono text-sm">{item.name}</span>
      <span>{item.score}</span>
    </div>
  );
});

export function LeaderBoard({ items }: { items: Item[] }) {
  return (
    <FixedSizeList
      height={600}          // viewport height in px — required
      itemCount={items.length}
      itemSize={48}         // row height in px
      width="100%"
      itemData={items}      // passed as 'data' to each Row
    >
      {Row}
    </FixedSizeList>
  );
}`,
            language: "typescript",
          },
          {
            title: "TanStack Virtual for flexible scroll containers",
            description:
              "More flexible than react-window — works with any scroll container and supports dynamic row heights.",
            code: `import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export function VirtualTable({ rows }: { rows: string[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40, // estimated row height — can be dynamic
    overscan: 5,            // render 5 extra rows above/below viewport
  });

  return (
    // Scroll container must have a fixed height and overflow-y: auto
    <div ref={parentRef} style={{ height: "500px", overflowY: "auto" }}>
      {/* Total-height spacer keeps the scrollbar track accurate */}
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((vRow) => (
          <div
            key={vRow.key}
            style={{
              position: "absolute",
              top: vRow.start,
              width: "100%",
              height: vRow.size,
            }}
          >
            {rows[vRow.index]}
          </div>
        ))}
      </div>
    </div>
  );
}`,
            language: "typescript",
          },
        ],
      },
    },
    {
      id: "react-performance-concurrency",
      title: "Concurrency and Perceived Performance",
      iconName: "Zap",
      link: "https://react.dev/reference/react/useTransition",
      theory:
        "React 18's concurrent APIs let you mark certain state updates as non-urgent so the browser stays responsive to input while expensive work runs in the background. The UI feels instant even when rendering is slow.",
      theoryDetail: {
        keyConcepts: [
          "`useTransition` — wraps a state setter in `startTransition`; returns `[isPending, startTransition]`",
          "`useDeferredValue(value)` — defers a derived value; React shows the stale result while the fresh one prepares",
          "Urgent updates (typing, clicking) are always processed first — deferred work is interrupted if needed",
          "`isPending` is `true` while the transition render is in progress — show a spinner or dim the stale content",
          "Suspense integrates with transitions: React shows the existing UI instead of a fallback during a deferred navigation",
          "`startTransition` (standalone) works outside components — useful in event handlers not tied to a component",
        ],
        whyItMatters:
          "Without concurrent APIs, a heavy render blocks the main thread entirely — clicks and keystrokes queue up and the UI freezes. Transitions let React yield to the browser between chunks of work, keeping interactions snappy regardless of render cost.",
        commonPitfalls: [
          "Wrapping every state update in startTransition — only defer genuinely non-urgent work; overuse makes interactions feel sluggish",
          "Not showing any pending indicator during `isPending` — users assume nothing happened and click again",
          "Using useDeferredValue without wrapping the consumer in React.memo — the old value still triggers a re-render on every parent render",
          "Treating `isPending` as a data-fetching loading flag — it only reflects whether the transition render has committed, not whether a fetch completed",
        ],
        comparisons: [
          {
            title: "useTransition vs useDeferredValue",
            points: [
              "useTransition — you control which state setter is deferred; best when you own the state update",
              "useDeferredValue — defers a value you receive (e.g. a prop); best when you don't own the setter",
              "Both prioritise urgent renders and let the deferred version catch up when the browser is idle",
              "useTransition exposes `isPending`; useDeferredValue requires comparing old vs new values manually",
            ],
          },
        ],
        examples: [
          {
            title: "useTransition — responsive filter input over a large list",
            description:
              "Typing updates the input immediately while the expensive filter runs in the background.",
            code: `import { useState, useTransition } from "react";

const ALL_ITEMS = Array.from({ length: 30_000 }, (_, i) => \`item-\${i}\`);

export function FilterList() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(ALL_ITEMS);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value); // urgent — input field updates immediately

    startTransition(() => {
      // non-urgent — React may pause and resume between frames
      setResults(ALL_ITEMS.filter((item) => item.includes(e.target.value)));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Filter items…" />
      <p style={{ opacity: isPending ? 0.5 : 1 }}>
        {isPending ? "Updating…" : \`\${results.length} results\`}
      </p>
      <ul style={{ opacity: isPending ? 0.6 : 1 }}>
        {results.slice(0, 50).map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}`,
            language: "typescript",
          },
          {
            title: "useDeferredValue — stale-while-revalidate for prop-driven renders",
            description:
              "Show the previous results immediately while the new expensive render catches up — without owning the state setter.",
            code: `import { useDeferredValue, memo } from "react";

// Wrap in memo so React can reuse the previous render while deferredQuery catches up
const SearchResults = memo(function SearchResults({ query }: { query: string }) {
  const results = Array.from({ length: 20_000 }, (_, i) => \`result-\${i}\`).filter(
    (r) => r.includes(query)
  );
  return <ul>{results.map((r) => <li key={r}>{r}</li>)}</ul>;
});

export function Search({ query }: { query: string }) {
  // deferredQuery lags behind query — React renders the urgent version first
  const deferredQuery = useDeferredValue(query);
  const isStale = deferredQuery !== query;

  return (
    // Dim stale content so users know a fresh render is coming
    <div style={{ opacity: isStale ? 0.6 : 1, transition: "opacity 0.15s" }}>
      <SearchResults query={deferredQuery} />
    </div>
  );
}`,
            language: "typescript",
          },
        ],
      },
    },
  ],
};
