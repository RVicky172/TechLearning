import type { TopicNode } from "@/data/types";

function example(title: string, description: string, code: string, language: "ts" | "tsx" = "tsx") {
  return { title, description, code, language };
}

const useRenderCountExample = example(
  "useRenderCount.ts",
  "Exact source from react/src/hooks/useRenderCount.ts",
  `import { useEffect, useId } from 'react'

const renderCountStore = new Map<string, number>()

export function useRenderCount() {
  const id = useId()
  const nextCount = (renderCountStore.get(id) ?? 0) + 1
  renderCountStore.set(id, nextCount)

  useEffect(() => {
    return () => {
      renderCountStore.delete(id)
    }
  }, [id])

  return nextCount
}`,
  "ts",
);

const themeContextExample = example(
  "ThemeContext.tsx",
  "Exact source from react/src/context/ThemeContext.tsx",
  `import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

export type Theme = 'sunrise' | 'mint'

type ThemeContextValue = {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('sunrise')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('ThemeContext is missing. Wrap with ThemeProvider.')
  }
  return context
}`,
  "tsx",
);

// ─────────────────────────────────────────────────────────
// useId
// ─────────────────────────────────────────────────────────

export const hookUseId: TopicNode = {
  id: "hook-useid",
  title: "useId",
  iconName: "Fingerprint",
  demoComponentKey: "useId",
  link: "https://react.dev/reference/react/useId",
  theory:
    "useId generates a stable, unique string ID that is consistent between server and client renders. Use it exclusively for accessibility attributes — htmlFor, aria-labelledby, aria-describedby — never for list keys or data IDs.",
  theoryDetail: {
    keyConcepts: [
      "useId() returns a string like ':r0:' — stable across SSR and client hydration, preventing hydration mismatch errors",
      "Each call to useId() in a component gets a different ID — use suffixes like `${id}-email` and `${id}-password` for multiple fields in one form",
      "IDs are per-component-instance — two instances of the same component each get their own unique ID namespace, preventing collisions",
      "Never use useId for list keys — it's not designed for dynamic lists; use server-provided IDs or a stable key from your data instead",
    ],
    whyItMatters:
      "Before useId, developers used Math.random() or incrementing counters for accessible IDs — both cause hydration mismatches in SSR because the server and client generate different values. useId is React's first-class solution: deterministic, hydration-safe, and zero-config.",
    commonPitfalls: [
      "Using Math.random() or Date.now() for IDs — these differ between server and client and break SSR hydration",
      "Using the raw useId() value as a list key — list keys must come from your data, not generated IDs",
      "Sharing one ID across multiple elements in a form — each form field needs its own unique ID; use suffixes to namespace them",
      "Using useId in non-component contexts (plain functions) — it must be called inside a component or custom hook",
    ],
    examples: [
      example(
        "Accessible form with multiple fields",
        "One useId() call provides an ID namespace for all fields in a form — avoiding hydration mismatches.",
        `import { useId } from "react";

function SignupForm() {
  const id = useId(); // e.g. ":r3:"

  return (
    <form>
      <div>
        <label htmlFor={\`\${id}-email\`}>Email</label>
        <input
          id={\`\${id}-email\`}
          type="email"
          aria-describedby={\`\${id}-email-hint\`}
        />
        <small id={\`\${id}-email-hint\`}>We'll never share your email.</small>
      </div>
      <div>
        <label htmlFor={\`\${id}-password\`}>Password</label>
        <input id={\`\${id}-password\`} type="password" />
      </div>
    </form>
  );
}

// Two instances — each gets its own ID namespace, no collision ──
export function App() {
  return (
    <>
      <SignupForm /> {/* id = :r3: */}
      <SignupForm /> {/* id = :r4: */}
    </>
  );
}`,
      ),
      example(
        "UseIdDemo.tsx",
        "Exact source from react/src/components/hooks/UseIdDemo.tsx",
        `import { useId } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseIdDemo() {
  const renderCount = useRenderCount()
  const fieldId = useId()

  return (
    <article>
      <h2>useId</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Generates stable ids for accessible forms.</p>
      <label htmlFor={\`\${fieldId}-name\`}>Name</label>
      <input id={\`\${fieldId}-name\`} placeholder="Accessible input" />
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// useImperativeHandle
// ─────────────────────────────────────────────────────────

export const hookUseImperativeHandle: TopicNode = {
  id: "hook-useimperativehandle",
  title: "useImperativeHandle",
  iconName: "Hand",
  demoComponentKey: "useImperativeHandle",
  link: "https://react.dev/reference/react/useImperativeHandle",
  theory:
    "useImperativeHandle customises the value exposed to a parent that holds a ref to the child. Instead of the raw DOM node, the parent receives a minimal, intentional API (e.g. focus(), play(), scrollTo()) — keeping the child's internals private.",
  theoryDetail: {
    keyConcepts: [
      "Always used with forwardRef (React < 19) or ref-as-prop (React 19+) — the child receives the forwarded ref and passes it to useImperativeHandle",
      "useImperativeHandle(ref, () => ({ method }), [deps]) — the factory returns the object the parent sees; the deps array controls when it's recreated",
      "The parent is restricted to only the methods you expose — it cannot accidentally access internal DOM refs or component state",
      "Treat the dependency array like useMemo's — include every value closed over by the factory function",
    ],
    whyItMatters:
      "React's mental model is declarative data flow (props down, events up). Sometimes a parent genuinely needs to trigger an action imperatively — focus, play video, scroll to top, reset a form. useImperativeHandle lets you support this without leaking the child's entire DOM node or internal implementation.",
    commonPitfalls: [
      "Using it for data flow — if the parent needs to read data from the child, lift state up or use a callback prop instead",
      "Forgetting the dependency array — the handle is recreated every render if deps are missing, causing stale refs in the parent",
      "Using forwardRef unnecessarily in React 19 — prefer accepting ref as a plain prop in React 19+",
      "Exposing too many methods — keep the surface minimal; every exposed method is a contract the child must maintain forever",
    ],
    examples: [
      example(
        "Custom focus + reset API",
        "Child exposes only focus() and clear() — the parent cannot reach the raw DOM input node.",
        `import { forwardRef, useImperativeHandle, useRef, useState } from "react";

type InputApi = { focus: () => void; clear: () => void };

// ── Child: expose a minimal API ───────────────────────────
const ControlledInput = forwardRef<InputApi, { label: string }>(
  function ControlledInput({ label }, ref) {
    const innerRef = useRef<HTMLInputElement>(null);
    const [value, setValue] = useState("");

    useImperativeHandle(
      ref,
      () => ({
        focus: () => innerRef.current?.focus(),
        clear: () => {
          setValue("");
          innerRef.current?.focus();
        },
      }),
      [], // stable callbacks, no deps needed
    );

    return (
      <div>
        <label>{label}</label>
        <input ref={innerRef} value={value} onChange={(e) => setValue(e.target.value)} />
      </div>
    );
  }
);

// ── Parent: only sees focus() and clear() ────────────────
export function Form() {
  const inputRef = useRef<InputApi>(null);
  return (
    <div>
      <ControlledInput ref={inputRef} label="Username" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={() => inputRef.current?.clear()}>Clear</button>
    </div>
  );
}`,
      ),
      example(
        "UseImperativeHandleDemo.tsx",
        "Exact source from react/src/components/hooks/UseImperativeHandleDemo.tsx",
        `import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

type FocusApi = {
  focus: () => void
  clear: () => void
}

const FancyInput = memo(
  forwardRef<FocusApi, { value: string; onChange: (value: string) => void }>(
    function FancyInput({ value, onChange }, ref) {
      const innerRef = useRef<HTMLInputElement>(null)

      useImperativeHandle(
        ref,
        () => ({
          focus: () => innerRef.current?.focus(),
          clear: () => {
            onChange('')
            innerRef.current?.focus()
          },
        }),
        [onChange],
      )

      return (
        <input
          ref={innerRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Expose methods to parent"
        />
      )
    },
  ),
)

export function UseImperativeHandleDemo() {
  const renderCount = useRenderCount()
  const [value, setValue] = useState('Parent can focus or clear me')
  const apiRef = useRef<FocusApi>(null)

  return (
    <article>
      <h2>useImperativeHandle</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Child exposes a tiny imperative API.</p>
      <FancyInput ref={apiRef} value={value} onChange={setValue} />
      <div className="row">
        <button type="button" onClick={() => apiRef.current?.focus()}>
          Focus
        </button>
        <button type="button" onClick={() => apiRef.current?.clear()}>
          Clear
        </button>
      </div>
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// useDeferredValue
// ─────────────────────────────────────────────────────────

export const hookUseDeferredValue: TopicNode = {
  id: "hook-usedeferredvalue",
  title: "useDeferredValue",
  iconName: "Gauge",
  demoComponentKey: "useDeferredValue",
  link: "https://react.dev/reference/react/useDeferredValue",
  theory:
    "useDeferredValue returns a stale copy of a value that React updates only when the main thread is idle. It's the declarative alternative to debouncing — no fixed timeout, just React's scheduler keeping expensive derived renders from blocking urgent interactions like typing.",
  theoryDetail: {
    keyConcepts: [
      "useDeferredValue(value) returns a version of value that lags behind the real value during high-priority renders (like typing)",
      "Not a debounce — there's no fixed delay; React schedules the deferred render whenever it has spare time",
      "Always pair with useMemo for the expensive computation — without memo the computation runs synchronously anyway, defeating the purpose",
      "Compare deferredValue !== value to detect when results are stale and show a loading indicator or faded UI",
    ],
    whyItMatters:
      "Filtering a list of thousands of items while a user types causes dropped frames — every keystroke triggers a full re-render of the huge list. useDeferredValue keeps the input responsive by letting React commit the keystroke instantly, then rerender the expensive list whenever it can without blocking the user.",
    commonPitfalls: [
      "Forgetting to wrap the expensive derived render in useMemo — useDeferredValue defers re-renders, not computations; the work still runs synchronously if not memoised",
      "Using it for network requests — useDeferredValue defers a render, not a fetch; use Suspense + use(Promise) for async data",
      "Not showing stale state to users — always compare `deferredValue !== value` and show a spinner or muted styling while results are updating",
      "Applying it to values that change rarely — the overhead is only justified for expensive renders triggered by fast-changing inputs",
    ],
    examples: [
      example(
        "Responsive search with stale indicator",
        "Type fast — the input updates instantly while the expensive list lags. A visual indicator shows when results are stale.",
        `import { useDeferredValue, useMemo, useState } from "react";

const items = Array.from({ length: 5000 }, (_, i) => \`Product \${i + 1}\`);

export function Search() {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  // ✅ useMemo ensures filtering only re-runs when deferredQuery changes
  const results = useMemo(() => {
    const q = deferredQuery.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(q)).slice(0, 50);
  }, [deferredQuery]);

  const isStale = query !== deferredQuery; // true while deferred render is pending

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
      />
      {/* ── List fades while results are updating ── */}
      <ul style={{ opacity: isStale ? 0.5 : 1, transition: "opacity 0.2s" }}>
        {results.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {isStale && <p>Updating…</p>}
    </div>
  );
}`,
      ),
      example(
        "UseDeferredValueDemo.tsx",
        "Exact source from react/src/components/hooks/UseDeferredValueDemo.tsx",
        `import { useDeferredValue, useMemo, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

const dataset = Array.from({ length: 1800 }, (_, index) => \`Hook helper \${index + 1}\`)

export function UseDeferredValueDemo() {
  const renderCount = useRenderCount()
  const [search, setSearch] = useState('hook')
  const deferredSearch = useDeferredValue(search)

  const filtered = useMemo(() => {
    const query = deferredSearch.toLowerCase().trim()
    if (!query) {
      return dataset.slice(0, 20)
    }
    return dataset.filter((item) => item.toLowerCase().includes(query)).slice(0, 20)
  }, [deferredSearch])

  return (
    <article>
      <h2>useDeferredValue</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Keeps typing fast while expensive filtering lags behind.</p>
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
      <p className="muted">Deferred query: {deferredSearch}</p>
      <ul>
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// useSyncExternalStore
// ─────────────────────────────────────────────────────────

export const hookUseSyncExternalStore: TopicNode = {
  id: "hook-usesyncexternalstore",
  title: "useSyncExternalStore",
  iconName: "Clock3",
  demoComponentKey: "useSyncExternalStore",
  link: "https://react.dev/reference/react/useSyncExternalStore",
  theory:
    "useSyncExternalStore is the official React API for subscribing to external mutable stores. It ensures consistent snapshots in concurrent rendering, preventing tearing — a bug where different parts of the UI show different versions of the same store state.",
  theoryDetail: {
    keyConcepts: [
      "useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot?) — subscribe must return an unsubscribe function; getSnapshot must return a stable (referentially equal) value when the store hasn't changed",
      "Prevents tearing — in concurrent mode, React may render a component tree over multiple frames; useSyncExternalStore guarantees all components see the same store snapshot in one render",
      "Used internally by Redux, Zustand, Jotai, and every other major state library for their React integrations",
      "getServerSnapshot is required for SSR — it provides the initial value for server rendering; omitting it causes hydration warnings",
    ],
    whyItMatters:
      "The old pattern (useEffect + useState to subscribe to external stores) is broken in concurrent mode — React can interrupt and restart renders, leading to tearing where some components see old state and others see new state. useSyncExternalStore solves this at the React runtime level and is the canonical way to bridge external stores with React.",
    commonPitfalls: [
      "getSnapshot returning a new object/array reference on every call (e.g. () => ({ count: store.count })) — React calls getSnapshot frequently; a new reference on every call causes infinite re-renders; return primitives or cache the object",
      "Forgetting getServerSnapshot in SSR — causes hydration mismatches; provide a server-safe snapshot (often a constant or an empty state)",
      "Subscribing inline without a stable callback — creates a new subscription on every render; memoize the subscribe function",
      "Using useState + useEffect instead in new code — this pattern is broken in concurrent mode; always prefer useSyncExternalStore for external mutable stores",
    ],
    examples: [
      example(
        "Browser online/offline store",
        "Subscribe to window online/offline events with a stable snapshot — the canonical useSyncExternalStore pattern.",
        `import { useSyncExternalStore } from "react";

// ── Store definition: subscribe + getSnapshot ─────────────
const onlineStore = {
  subscribe(callback: () => void) {
    window.addEventListener("online", callback);
    window.addEventListener("offline", callback);
    return () => {
      window.removeEventListener("online", callback);
      window.removeEventListener("offline", callback);
    };
  },
  getSnapshot: () => navigator.onLine,          // primitive — always stable
  getServerSnapshot: () => true,                 // assume online during SSR
};

// ── Hook wrapping the store ───────────────────────────────
function useOnline() {
  return useSyncExternalStore(
    onlineStore.subscribe,
    onlineStore.getSnapshot,
    onlineStore.getServerSnapshot,
  );
}

// ── Component using the hook ──────────────────────────────
export function NetworkStatus() {
  const online = useOnline();
  return <p>{online ? "🟢 Online" : "🔴 Offline"}</p>;
}`,
      ),
      example(
        "UseSyncExternalStoreDemo.tsx",
        "Exact source from react/src/components/hooks/UseSyncExternalStoreDemo.tsx",
        `import { useSyncExternalStore } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

function createClockStore() {
  let value = new Date().toLocaleTimeString()
  const listeners = new Set<() => void>()

  setInterval(() => {
    value = new Date().toLocaleTimeString()
    listeners.forEach((listener) => listener())
  }, 1000)

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => value,
  }
}

const clockStore = createClockStore()

export function UseSyncExternalStoreDemo() {
  const renderCount = useRenderCount()
  const now = useSyncExternalStore(clockStore.subscribe, clockStore.getSnapshot, () => '00:00:00')

  return (
    <article>
      <h2>useSyncExternalStore</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Subscribes to an external clock store.</p>
      <p className="muted">Current time: {now}</p>
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// useDebugValue
// ─────────────────────────────────────────────────────────

export const hookUseDebugValue: TopicNode = {
  id: "hook-usedebugvalue",
  title: "useDebugValue",
  iconName: "Bug",
  demoComponentKey: "useDebugValue",
  link: "https://react.dev/reference/react/useDebugValue",
  theory:
    "useDebugValue annotates custom hooks with a human-readable label that appears in React DevTools. It has no effect on the rendered output — it's a pure developer-experience tool for debugging custom hook state in the Components inspector.",
  theoryDetail: {
    keyConcepts: [
      "useDebugValue(value, format?) — value is shown next to the hook name in React DevTools; format is an optional lazy formatter function called only when DevTools is open",
      "Only useful inside custom hooks — calling it in an application component is valid but pointless; DevTools shows it without meaningful context",
      "Pass a formatter as the second argument to avoid expensive formatting on every render: useDebugValue(date, d => d.toISOString()) — the formatter runs lazily",
      "Only visible in React DevTools' Components tab — it does not log to the console or appear in the UI",
    ],
    whyItMatters:
      "Custom hooks appear as opaque hook entries in DevTools without labels. If you have `useOnlineStatus`, `useCartTotal`, or `useAuthUser`, DevTools just shows the raw state values without context. useDebugValue gives them a meaningful label — 'Online', '$42.00', 'Alice' — making it trivial to inspect hook state while debugging.",
    commonPitfalls: [
      "Using it in application components instead of shared custom hooks — it's designed for reusable hooks that will be inspected across many components",
      "Skipping the formatter for expensive computations — without the formatter, the display value is computed on every render even when DevTools is closed; always use the lazy formatter form for expensive formatting",
      "Expecting it to show in the console or the UI — it only appears in React DevTools' Components tab",
      "Using it in production in performance-critical hooks without the formatter — the formatter ensures no extra work in production where DevTools is rarely open",
    ],
    examples: [
      example(
        "Lazy-formatted debug label",
        "The formatter runs only when DevTools is open — zero cost in production.",
        `import { useDebugValue, useState } from "react";

interface CartItem { id: number; price: number; qty: number }

// ── Custom hook with useDebugValue ────────────────────────
function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  // ✅ Lazy formatter: only runs when React DevTools is open
  useDebugValue(total, (t) => \`Cart total: $\${t.toFixed(2)}\`);

  return { items, setItems, total };
}

// ── Without formatter (runs every render) — avoid for expensive ops ─
function useCartBad() {
  const [items] = useState<CartItem[]>([]);
  // ❌ This formatting happens on every render
  useDebugValue(\`$\${items.reduce((s, i) => s + i.price * i.qty, 0).toFixed(2)}\`);
  return items;
}`,
      ),
      {
        title: "UseDebugValueDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseDebugValueDemo.tsx",
        code: `import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseDebugValueDemo() {
  const renderCount = useRenderCount()
  const online = useOnlineStatus()

  return (
    <article>
      <h2>useDebugValue</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Debug label is visible in React DevTools for the custom status hook.</p>
      <p className="muted">Network: {online ? 'Online' : 'Offline'}</p>
    </article>
  )
}`,
        language: "tsx",
      },
      {
        title: "useOnlineStatus.ts",
        description: "Exact source from react/src/hooks/useOnlineStatus.ts",
        code: `import { useDebugValue, useSyncExternalStore } from 'react'

export function useOnlineStatus() {
  const online = useSyncExternalStore(
    (notify) => {
      window.addEventListener('online', notify)
      window.addEventListener('offline', notify)
      return () => {
        window.removeEventListener('online', notify)
        window.removeEventListener('offline', notify)
      }
    },
    () => navigator.onLine,
    () => true,
  )

  useDebugValue(online ? 'Online' : 'Offline')
  return online
}`,
        language: "ts",
      },
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// useInsertionEffect
// ─────────────────────────────────────────────────────────

export const hookUseInsertionEffect: TopicNode = {
  id: "hook-useinsertioneffect",
  title: "useInsertionEffect",
  iconName: "Paintbrush",
  demoComponentKey: "useInsertionEffect",
  link: "https://react.dev/reference/react/useInsertionEffect",
  theory:
    "useInsertionEffect fires synchronously before any DOM mutations are committed — even before useLayoutEffect. It exists exclusively for CSS-in-JS libraries to inject style rules before React reads layout, preventing flash of unstyled content (FOUC) and incorrect dimension measurements.",
  theoryDetail: {
    keyConcepts: [
      "Fires before DOM mutations — earlier than useLayoutEffect, which fires after DOM mutations; earlier than useEffect, which fires after paint",
      "No DOM ref access — refs are null here because React hasn't written to the DOM yet; you can only manipulate the document (e.g. inject a <style> tag)",
      "No state updates allowed — calling setState inside useInsertionEffect throws; it's for style injection only",
      "Intended for CSS-in-JS library authors, not application code — libraries like styled-components and emotion use it; application code should prefer CSS modules, Tailwind, or plain CSS",
    ],
    whyItMatters:
      "CSS-in-JS libraries need to inject generated class styles before React measures layout. If they inject styles in useLayoutEffect, `getBoundingClientRect` inside the same useLayoutEffect reads incorrect dimensions (styles not yet applied). useInsertionEffect guarantees styles are in the document before any layout effects run, making dimension measurements accurate on the first read.",
    commonPitfalls: [
      "Using it in application code — this hook is a library primitive; use CSS modules, Tailwind, or inline styles for application styling",
      "Expecting ref access — refs are null during useInsertionEffect; if you need DOM access, use useLayoutEffect or useEffect",
      "Updating state or calling dispatch — React throws an error; the hook is intentionally restricted to style injection only",
      "Using it for subscriptions or data fetching — those belong in useEffect; useInsertionEffect is exclusively for synchronous DOM style injection",
    ],
    examples: [
      example(
        "Dynamic theme injection (CSS-in-JS pattern)",
        "Inject a <style> tag with CSS variables before layout effects read them — the useInsertionEffect use case.",
        `import { useInsertionEffect } from "react";

// ── Simplified CSS-in-JS runtime ──────────────────────────
const injectedStyles = new Map<string, HTMLStyleElement>();

function injectStyle(id: string, css: string) {
  if (injectedStyles.has(id)) {
    injectedStyles.get(id)!.textContent = css;
    return;
  }
  const tag = document.createElement("style");
  tag.dataset.styleId = id;
  tag.textContent = css;
  document.head.appendChild(tag);
  injectedStyles.set(id, tag);
}

// ── Hook using useInsertionEffect ─────────────────────────
function useDynamicTheme(primary: string, bg: string) {
  useInsertionEffect(() => {
    // ✅ Runs before DOM mutations — before useLayoutEffect reads layout
    injectStyle("dynamic-theme", \`
      :root {
        --color-primary: \${primary};
        --color-bg: \${bg};
      }
    \`);
    return () => {
      // Cleanup: remove when component unmounts
      injectedStyles.get("dynamic-theme")?.remove();
      injectedStyles.delete("dynamic-theme");
    };
  }, [primary, bg]);
}

export function ThemeableCard({ dark }: { dark: boolean }) {
  useDynamicTheme(dark ? "#60a5fa" : "#3b82f6", dark ? "#1e293b" : "#f8fafc");
  return (
    <div style={{ backgroundColor: "var(--color-bg)", color: "var(--color-primary)" }}>
      Themed card
    </div>
  );
}`,
      ),
      example(
        "UseInsertionEffectDemo.tsx",
        "Exact source from react/src/components/hooks/UseInsertionEffectDemo.tsx",
        `import { useInsertionEffect, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseInsertionEffectDemo() {
  const renderCount = useRenderCount()
  const [tone, setTone] = useState<'warm' | 'cool'>('warm')

  useInsertionEffect(() => {
    const styleTag = document.createElement('style')
    styleTag.dataset.dynamicTone = 'true'
    styleTag.textContent =
      tone === 'warm'
        ? ':root { --dynamic-accent: #ce5a1f; --dynamic-soft: #ffe6c7; }'
        : ':root { --dynamic-accent: #006d5b; --dynamic-soft: #d7fff4; }'
    document.head.appendChild(styleTag)

    return () => styleTag.remove()
  }, [tone])

  return (
    <article>
      <h2>useInsertionEffect</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Injects dynamic CSS before layout effects run.</p>
      <button type="button" onClick={() => setTone((value) => (value === 'warm' ? 'cool' : 'warm'))}>
        Toggle tone ({tone})
      </button>
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// use()
// ─────────────────────────────────────────────────────────

export const hookUse: TopicNode = {
  id: "hook-use",
  title: "use()",
  iconName: "CirclePlay",
  demoComponentKey: "use",
  link: "https://react.dev/reference/react/use",
  theory:
    "use() is a React 19 API that lets you read the value of a resource — a Context or a Promise — directly inside a component's render function. Unlike every other hook, use() can be called conditionally and inside loops, making it the most flexible way to consume context and async data in React.",
  theoryDetail: {
    keyConcepts: [
      "use(Context): reads a React context value — equivalent to useContext() but can be called conditionally, inside loops, or after an early return, which useContext() cannot",
      "use(Promise): unwraps a Promise during render — React suspends the component (shows the nearest <Suspense> fallback) until the Promise resolves, then re-renders with the resolved value",
      "Not a hook in the traditional sense: use() breaks the Rules of Hooks — it is the only built-in React API you can call conditionally; React handles it differently from useState/useEffect",
      "Works in both Client and Server Components: in Server Components, use(fetch(...)) is the natural way to await data without async/await at the component level",
      "Error handling: if the Promise rejects, the rejection propagates to the nearest Error Boundary — wrap with <ErrorBoundary> just as you would for Suspense",
      "Passing Promises as props: the recommended pattern is to create a Promise in a Server Component (or parent) and pass it as a prop to a Client Component that calls use() — this starts the fetch early and avoids waterfalls",
    ],
    whyItMatters:
      "use() is the cornerstone of React 19's async data model. It replaces the useEffect + useState fetch pattern with a simpler, Suspense-integrated approach. It also makes context consumption more flexible — you can now read context after conditional checks, which was previously impossible. Every React developer should understand when use(Promise) is better than useEffect and when use(Context) is better than useContext.",
    commonPitfalls: [
      "Creating the Promise inside the component body — a new Promise is created on every render, causing an infinite Suspense loop; always create the Promise outside the component or in a parent/server component and pass it as a prop",
      "Forgetting a <Suspense> boundary — if you call use(promise) and there's no ancestor <Suspense>, React throws an error; always wrap the component (or an ancestor) with <Suspense fallback={...}>",
      "No error boundary — a rejected Promise will crash the subtree silently without an <ErrorBoundary>; always pair <Suspense> with <ErrorBoundary> in production",
      "Using use() for context when the context is always at the top level — if you don't need conditional consumption, useContext() is slightly more explicit and familiar to most readers",
    ],
    examples: [
      example(
        "use(Context) — conditional context reading",
        "Read context conditionally — something useContext() cannot do. Useful when a component is optional and shouldn't require the context to be present.",
        `import { use, createContext } from "react";

const ThemeContext = createContext<"light" | "dark" | null>(null);

// ── use(Context) allows conditional calls ─────────────────
function ThemedBadge({ showTheme }: { showTheme: boolean }) {
  // ✅ Calling use() after a condition — impossible with useContext()
  if (!showTheme) return <span>No badge</span>;

  const theme = use(ThemeContext);   // conditionally called — this is allowed!

  return (
    <span className={theme === "dark" ? "bg-zinc-800 text-white" : "bg-white text-zinc-900"}>
      {theme} mode
    </span>
  );
}

// ── vs useContext() — must always be called unconditionally ─
function ThemedBadge_OLD({ showTheme }: { showTheme: boolean }) {
  const theme = useContext(ThemeContext); // must be called before any early return
  if (!showTheme) return <span>No badge</span>;
  return <span>{theme}</span>;
}`,
        "tsx",
      ),
      example(
        "use(Promise) — async data without useEffect",
        "Pass a Promise from a parent/server component and unwrap it with use() — React suspends until resolved.",
        `import { use, Suspense } from "react";

interface User { id: number; name: string; email: string; }

// ── Child: unwraps the Promise ────────────────────────────
function UserProfile({ userPromise }: { userPromise: Promise<User> }) {
  const user = use(userPromise); // React suspends here until resolved
  return <div><h2>{user.name}</h2><p>{user.email}</p></div>;
}

// ── Parent: creates Promise OUTSIDE child render ──────────
// ✅ Promise created once at module level — not inside UserProfile
const userPromise = fetch("/api/user/1").then((r) => r.json() as Promise<User>);

function App() {
  return (
    <Suspense fallback={<p>Loading user…</p>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}

// ── ❌ Anti-pattern: Promise created INSIDE component ──────
function UserProfile_BAD() {
  // New Promise on every render → infinite Suspense loop!
  const user = use(fetch("/api/user/1").then((r) => r.json()));
  return <div>{(user as User).name}</div>;
}`,
        "tsx",
      ),
      example(
        "use(Promise) + ErrorBoundary — handling rejections",
        "Pair Suspense with an ErrorBoundary to handle both loading and error states cleanly.",
        `import { use, Suspense, Component, type ReactNode } from "react";

class ErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) return this.props.fallback;
    return this.props.children;
  }
}

function Posts({ postsPromise }: { postsPromise: Promise<{ id: number; title: string }[]> }) {
  const posts = use(postsPromise);
  return <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;
}

export function PostsFeed() {
  const postsPromise = fetch("/api/posts").then((r) => {
    if (!r.ok) throw new Error("Failed to load posts");
    return r.json();
  });

  return (
    <ErrorBoundary fallback={<p>Failed to load posts.</p>}>
      <Suspense fallback={<p>Loading posts…</p>}>
        <Posts postsPromise={postsPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}`,
        "tsx",
      ),
      example(
        "UseUseDemo.tsx",
        "Exact source from react/src/components/hooks/UseUseDemo.tsx",
        `import { use } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseUseDemo() {
  const renderCount = useRenderCount()
  const contextValue = use(ThemeContext)
  if (!contextValue) {
    throw new Error('ThemeContext is missing. Wrap with ThemeProvider.')
  }

  return (
    <article>
      <h2>use</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Reads context using use instead of useContext.</p>
      <p className="muted">Theme from context: {contextValue.theme}</p>
    </article>
  )
}`,
      ),
      themeContextExample,
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// useActionState
// ─────────────────────────────────────────────────────────

export const hookUseActionState: TopicNode = {
  id: "hook-useactionstate",
  title: "useActionState",
  iconName: "Send",
  demoComponentKey: "useActionState",
  link: "https://react.dev/reference/react/useActionState",
  theory:
    "useActionState manages form action state and pending status declaratively. In React 19, it pairs with the native <form action={fn}> pattern, replacing the manual useState + handleSubmit + loading flag boilerplate for async form submissions.",
  theoryDetail: {
    keyConcepts: [
      "useActionState(action, initialState) returns [state, dispatch, isPending] — dispatch is passed to <form action={dispatch}> or called programmatically",
      "The action receives (prevState, formData) — read form values with formData.get('fieldName'); always return the new state",
      "isPending is true while the async action is in-flight — use it to disable the submit button and show a loading indicator",
      "Works with Progressive Enhancement: if the action is a Next.js/React server action, the form works even without JavaScript enabled in the browser",
    ],
    whyItMatters:
      "The manual form pattern (useState for each field + useState for loading + try/catch + setError) is verbose and error-prone. useActionState collapses all of that into one hook, and integrates naturally with React's concurrent features — the pending state is synchronised with React's scheduler rather than managed manually.",
    commonPitfalls: [
      "Forgetting to return from the action — the new state will be undefined; always return a value (the updated state or an error message)",
      "Not handling errors in the action — wrap the async work in try/catch and return an error state; don't let the action throw without a catch",
      "Using controlled inputs (value + onChange) — useActionState works best with uncontrolled form inputs via formData; mixing both patterns causes confusion",
      "Calling dispatch in a non-transition context — useActionState wraps calls in a transition automatically, but manually wrapping in startTransition can cause double-pending states",
    ],
    examples: [
      example(
        "Newsletter signup form",
        "Full async form with validation, error state, success state, and automatic isPending — all in one hook.",
        `import { useActionState } from "react";

type FormState =
  | { status: "idle" }
  | { status: "error"; message: string }
  | { status: "success"; email: string };

async function subscribeAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email.includes("@")) {
    return { status: "error", message: "Enter a valid email address." };
  }

  // Simulate API call
  await new Promise((r) => setTimeout(r, 800));
  return { status: "success", email };
}

export function NewsletterForm() {
  const [state, dispatch, isPending] = useActionState(subscribeAction, {
    status: "idle",
  });

  if (state.status === "success") {
    return <p>Subscribed {state.email}!</p>;
  }

  return (
    <form action={dispatch}>
      <input name="email" type="email" placeholder="you@example.com" />
      {state.status === "error" && <p style={{ color: "red" }}>{state.message}</p>}
      <button type="submit" disabled={isPending}>
        {isPending ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );
}`,
      ),
      example(
        "UseActionStateDemo.tsx",
        "Exact source from react/src/components/hooks/UseActionStateDemo.tsx",
        `import { useActionState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseActionStateDemo() {
  const renderCount = useRenderCount()
  const [status, submitForm, isPending] = useActionState(
    async (_prevState: string, formData: FormData) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const feedback = String(formData.get('feedback') ?? '').trim()
      if (!feedback) {
        return 'Please enter feedback first.'
      }
      return \`Saved: \${feedback}\`
    },
    'No feedback submitted yet.',
  )

  return (
    <article>
      <h2>useActionState</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Handles async form actions with pending state.</p>
      <form action={submitForm}>
        <label htmlFor="feedback">Feedback</label>
        <input id="feedback" name="feedback" placeholder="Share a note" />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
        <small>{status}</small>
      </form>
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// useOptimistic
// ─────────────────────────────────────────────────────────

export const hookUseOptimistic: TopicNode = {
  id: "hook-useoptimistic",
  title: "useOptimistic",
  iconName: "Sparkles",
  demoComponentKey: "useOptimistic",
  link: "https://react.dev/reference/react/useOptimistic",
  theory:
    "useOptimistic renders a temporary optimistic value while an async mutation is in-flight. When the mutation settles, React automatically reconciles with the real server state — reverting if it fails, or keeping the real response if it succeeds.",
  theoryDetail: {
    keyConcepts: [
      "useOptimistic(state, updateFn) returns [optimisticState, addOptimistic] — optimisticState equals state when nothing is pending; diverges while a mutation is in flight",
      "The updateFn receives (currentState, optimisticValue) and returns the temporary display state — it's a pure function, not a setter",
      "React automatically reverts optimisticState to state if the surrounding async action fails — no manual error-state cleanup needed",
      "Designed to be used inside startTransition or with useActionState — the optimistic update persists until the wrapping transition completes",
    ],
    whyItMatters:
      "Users expect instant feedback — a like button that updates in 600 ms feels broken. useOptimistic makes the UI update the instant the user acts, then silently reconciles with the server result. This pattern (optimistic UI) previously required complex manual state management; useOptimistic makes it a single hook call.",
    commonPitfalls: [
      "Not pairing with an async action — the optimistic update immediately reverts if there's no concurrent async work in a transition; always use inside startTransition or useActionState",
      "Forgetting error handling — useOptimistic reverts automatically on failure, but users still need to see an error message; handle errors from the action separately",
      "Using for unpredictable mutations — optimistic UI only works well when you can confidently predict the server result (e.g. a like count +1, not a complex calculation)",
      "Using it as a replacement for all loading states — it's specifically for cases where you know the likely outcome; fallback to isPending for uncertain operations",
    ],
    examples: [
      example(
        "Instant like button",
        "The count updates immediately when clicked; if the server request fails, React reverts automatically.",
        `import { useOptimistic, useState, useTransition } from "react";

async function sendLike(postId: number): Promise<number> {
  // Simulate server — returns new like count
  await new Promise((r) => setTimeout(r, 600));
  return postId * 3 + 1; // pretend server response
}

export function LikeButton({ postId, initialLikes }: { postId: number; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes);
  const [isPending, startTransition] = useTransition();

  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (current, amount: number) => current + amount, // updateFn: show current + delta
  );

  function handleLike() {
    startTransition(async () => {
      addOptimisticLike(1);              // ← instant UI update
      const newCount = await sendLike(postId);
      setLikes(newCount);                // ← reconcile with real server state
    });
  }

  return (
    <button onClick={handleLike} disabled={isPending}>
      ❤️ {optimisticLikes}              {/* shows optimistic value while pending */}
    </button>
  );
}`,
      ),
      example(
        "UseOptimisticDemo.tsx",
        "Exact source from react/src/components/hooks/UseOptimisticDemo.tsx",
        `import { useOptimistic, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseOptimisticDemo() {
  const renderCount = useRenderCount()
  const [likes, setLikes] = useState(5)
  const [optimisticLikes, addOptimisticLike] = useOptimistic(likes, (state, amount: number) => state + amount)

  return (
    <article>
      <h2>useOptimistic</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Shows immediate optimistic UI before server confirmation.</p>
      <div className="row">
        <button
          type="button"
          onClick={() => {
            addOptimisticLike(1)
            setTimeout(() => setLikes((value) => value + 1), 700)
          }}
        >
          Like ({optimisticLikes})
        </button>
        <small>Confirmed: {likes}</small>
      </div>
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// useEffectEvent
// ─────────────────────────────────────────────────────────

export const hookUseEffectEvent: TopicNode = {
  id: "hook-useeffectevent",
  title: "useEffectEvent",
  iconName: "RadioTower",
  demoComponentKey: "useEffectEvent",
  link: "https://react.dev/reference/react/useEffectEvent",
  theory:
    "useEffectEvent extracts non-reactive logic out of an effect into a stable 'event' function that always reads the latest props and state. The event function is excluded from the effect's dependency array, solving the common problem of effects re-subscribing whenever a value they read (but don't react to) changes.",
  theoryDetail: {
    keyConcepts: [
      "useEffectEvent(fn) returns a stable function that always reads current props/state — it is NOT reactive; changes to values it reads don't trigger the effect to re-run",
      "The returned function must only be called from inside effects — never from render, event handlers, or other effects",
      "Effect events are excluded from the effect's dependency array by convention — they represent 'things that happen' not 'values that change'",
      "Experimental in React 19 — the API may change; the React compiler's 'forget' mode aims to make this automatic in future",
    ],
    whyItMatters:
      "Effects that read props/state must list them as dependencies, causing the effect to re-subscribe every time those values change. If a value is read for side-effect logging (e.g. analytics) but shouldn't trigger resubscription, the effect breaks. useEffectEvent cleanly separates 'reactive' dependencies from 'non-reactive reads', making complex effects maintainable.",
    commonPitfalls: [
      "Calling the effect event from render or event handlers — it's only valid inside effect cleanup and setup; calling it elsewhere gives stale results",
      "Passing the effect event as a prop or returning it from a hook for external use — it's scoped to the effect that created it",
      "Using it as a replacement for useCallback — useCallback creates stable callbacks for memoisation; useEffectEvent creates non-reactive reads for effects; these are different problems",
      "Expecting it to be stable across hot reload in development — the function reference may change during development; only rely on stability in production",
    ],
    examples: [
      example(
        "Analytics logger that reads latest state without re-subscribing",
        "The effect subscribes once; the event function always reads the current state when the event fires.",
        `import { useEffect, useEffectEvent, useState } from "react";

// ── Without useEffectEvent (broken) ──────────────────────
function PageViewTracker_BAD({ url, userId }: { url: string; userId: string }) {
  useEffect(() => {
    // ❌ Must list userId as dep — logs fire again if userId changes
    logPageView(url, userId);
  }, [url, userId]);
  return null;
}

// ── With useEffectEvent (correct) ─────────────────────────
function PageViewTracker({ url, userId }: { url: string; userId: string }) {
  // onVisit always reads the latest userId without being reactive
  const onVisit = useEffectEvent((currentUrl: string) => {
    logPageView(currentUrl, userId); // userId read from closure, not a dep
  });

  useEffect(() => {
    onVisit(url);
    // ✅ Only url in deps — userId changes don't re-fire the log
  }, [url, onVisit]);

  return null;
}

function logPageView(url: string, userId: string) {
  console.log("Page view:", url, "User:", userId);
}

// ── Usage ─────────────────────────────────────────────────
export function App() {
  const [page, setPage] = useState("/home");
  const [user] = useState("alice");

  return (
    <div>
      <PageViewTracker url={page} userId={user} />
      <button onClick={() => setPage("/about")}>Go to /about</button>
    </div>
  );
}`,
      ),
      example(
        "UseEffectEventDemo.tsx",
        "Exact source from react/src/components/hooks/UseEffectEventDemo.tsx",
        `import { useEffect, useEffectEvent, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseEffectEventDemo() {
  const renderCount = useRenderCount()
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const onVisit = useEffectEvent(() => {
    console.log(\`Visited count: \${count}, theme: \${theme}\`)
  })

  useEffect(() => {
    onVisit()
  }, [count, onVisit])

  return (
    <article>
      <h2>useEffectEvent</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Reads latest state inside an effect event without extra dependencies.</p>
      <div className="row">
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Trigger visit ({count})
        </button>
        <button type="button" onClick={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}>
          Theme ({theme})
        </button>
      </div>
      <p className="muted">Check console logs for effect event output.</p>
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// useStateEvent pattern
// ─────────────────────────────────────────────────────────

export const hookUseStateEvent: TopicNode = {
  id: "hook-usestateevent",
  title: "useStateEvent pattern",
  iconName: "History",
  demoComponentKey: "useStateEvent",
  theory:
    "The useStateEvent pattern is a custom hook that creates a stable event handler reference (never changes identity) that always reads the latest state. It uses useRef to hold the current callback and useCallback to wrap it in a stable function — solving stale closures in event listeners without adding the state to the effect's dependency array.",
  theoryDetail: {
    keyConcepts: [
      "Not a React built-in — a widely-used pattern combining useRef + useCallback; similar to the problem useEffectEvent solves, but for event handlers",
      "The returned function is referentially stable (never changes) — safe to pass to addEventListener or as a prop to React.memo'd components without causing re-subscriptions",
      "The ref is updated synchronously on every render — when the stable function is called, it always invokes the latest version of the callback",
      "Effectively the userland equivalent of useEffectEvent for event handler contexts",
    ],
    whyItMatters:
      "Event listeners registered in useEffect need stable callbacks to avoid re-subscribing on every render. But those callbacks often need to read current state. Without this pattern you either put state in deps (causing re-subscription) or read stale state. useStateEvent gives you both: stable identity and fresh state.",
    commonPitfalls: [
      "Using it when useCallback with correct deps would suffice — if the callback's deps are cheap to compare, prefer useCallback for clarity",
      "Reading the ref synchronously during render — ref.current reflects the previous render's value during the current render; only read it inside the stable callback (which is called asynchronously)",
      "Thinking it replaces useMemo — this pattern is for stable callbacks only, not for memoised computed values",
      "Using across concurrent renders — refs are not safe in concurrent mode when the value is read during render; restrict reads to event handlers and effects",
    ],
    examples: [
      example(
        "Stable listener that reads current state",
        "The keydown listener never re-registers, but always reads the current count.",
        `import { useCallback, useEffect, useRef, useState } from "react";

// ── The pattern ───────────────────────────────────────────
function useStateEvent<T extends (...args: never[]) => unknown>(fn: T): T {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;                              // always up-to-date
  return useCallback((...args: Parameters<T>) => fnRef.current(...args), []) as T;
}

// ── Usage ─────────────────────────────────────────────────
export function KeyLogger() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  // Without useStateEvent, this handler would stale-close over count
  const handleKey = useStateEvent((e: KeyboardEvent) => {
    setLog((prev) => [...prev, \`"\${e.key}" pressed when count = \${count}\`]);
  });

  useEffect(() => {
    // ✅ Registers once — handleKey never changes
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      <ul>{log.slice(-5).map((entry, i) => <li key={i}>{entry}</li>)}</ul>
    </div>
  );
}`,
      ),
      example(
        "UseStateEventDemo.tsx",
        "Exact source from react/src/components/hooks/UseStateEventDemo.tsx",
        `import { useCallback, useRef, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

function useStateEvent<T extends (...args: never[]) => unknown>(fn: T): T {
  const fnRef = useRef<T>(fn)
  fnRef.current = fn
  return useCallback((...args: Parameters<T>) => fnRef.current(...args), []) as T
}

export function UseStateEventDemo() {
  const renderCount = useRenderCount()
  const [count, setCount] = useState(0)
  const [log, setLog] = useState<string[]>([])

  const logCount = useStateEvent(() => {
    setLog((prev) => [...prev, \`Snapshot at count = \${count}\`])
  })

  return (
    <article>
      <h2>useStateEvent</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>
        <code>useStateEvent</code> wraps a function in a ref so the stable callback always accesses
        the latest state — solving stale-closure problems without adding extra effect dependencies.
      </p>
      <div className="row">
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Increment count ({count})
        </button>
        <button type="button" onClick={logCount}>
          Log current count
        </button>
        <button type="button" onClick={() => setLog([])}>
          Clear log
        </button>
      </div>
      {log.length > 0 && (
        <ul className="muted">
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      )}
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// ref as a prop (React 19)
// ─────────────────────────────────────────────────────────

export const hookRefAsProp: TopicNode = {
  id: "react19-ref-as-prop",
  title: "ref as a prop",
  iconName: "Waypoint",
  demoComponentKey: "refAsProp",
  theory:
    "In React 19, function components can receive ref as a plain prop — no forwardRef wrapper required. This removes the boilerplate of forwardRef and makes ref behave consistently with all other props. forwardRef still works for backward compatibility but is deprecated for new code.",
  theoryDetail: {
    keyConcepts: [
      "React 19 function components accept ref as a prop directly — type it as ref: Ref<T> in the component's props interface",
      "forwardRef is deprecated in React 19 — still works for backward compatibility but should not be used in new React 19+ code",
      "Still compatible with useImperativeHandle — accept ref as a prop and pass it to useImperativeHandle to expose a custom API",
      "ref prop behaves like any other prop — it can be renamed, defaulted, or passed through without special treatment",
    ],
    whyItMatters:
      "forwardRef created an awkward API — a higher-order component wrapper just to pass one prop. React 19's ref-as-prop eliminates this: components are simpler, TypeScript types are cleaner, and the mental model is consistent (ref is just a prop like any other).",
    commonPitfalls: [
      "Using forwardRef for new React 19 components — prefer the ref-as-prop pattern; forwardRef is a legacy API going forward",
      "TypeScript typing: missing Ref<T> import — import { type Ref } from 'react' and use ref: Ref<T> in props; without it the ref won't have the correct type",
      "Using ref as a prop in React 18 or earlier — this pattern only works in React 19+; use forwardRef for older React versions",
      "Renaming the ref prop — while you can rename it (e.g. inputRef), consumers must pass the renamed prop; this breaks the standard ref={...} syntax on JSX",
    ],
    examples: [
      example(
        "React 19 ref as a prop — no forwardRef needed",
        "Pass ref directly as a prop in React 19. No wrapper, no boilerplate.",
        `import { useImperativeHandle, useRef, type Ref } from "react";

type InputApi = { focus: () => void; selectAll: () => void };

// ── React 19: ref is just a prop ──────────────────────────
function SmartInput({
  placeholder,
  ref,           // ← plain prop, no forwardRef
}: {
  placeholder?: string;
  ref: Ref<InputApi>;
}) {
  const innerRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    focus: () => innerRef.current?.focus(),
    selectAll: () => innerRef.current?.select(),
  }), []);

  return <input ref={innerRef} placeholder={placeholder} />;
}

// ── Parent uses it exactly the same way ──────────────────
export function Form() {
  const inputRef = useRef<InputApi>(null);
  return (
    <div>
      <SmartInput ref={inputRef} placeholder="React 19 style" />
      <button onClick={() => inputRef.current?.focus()}>Focus</button>
      <button onClick={() => inputRef.current?.selectAll()}>Select all</button>
    </div>
  );
}

// ── React 18 equivalent (still valid, just verbose) ──────
// const SmartInput = forwardRef<InputApi, { placeholder?: string }>(
//   function SmartInput({ placeholder }, ref) { ... }
// );`,
      ),
      example(
        "RefAsPropDemo.tsx",
        "Exact source from react/src/components/hooks/RefAsPropDemo.tsx",
        `import { useImperativeHandle, useRef, useState, type Ref } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

type InputApi = {
  focus: () => void
  selectAll: () => void
}

function SmartInput({
  value,
  onChange,
  ref,
}: {
  value: string
  onChange: (value: string) => void
  ref: Ref<InputApi>
}) {
  const innerRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(
    ref,
    () => ({
      focus: () => innerRef.current?.focus(),
      selectAll: () => innerRef.current?.select(),
    }),
    [],
  )

  return (
    <input
      ref={innerRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="React 19 lets ref come as a prop"
    />
  )
}

export function RefAsPropDemo() {
  const renderCount = useRenderCount()
  const [value, setValue] = useState('No forwardRef needed in React 19.')
  const apiRef = useRef<InputApi>(null)

  return (
    <article>
      <h2>ref as a prop</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>
        In React 19, function components can receive ref directly as a prop, so many cases no
        longer need forwardRef.
      </p>
      <SmartInput ref={apiRef} value={value} onChange={setValue} />
      <div className="row">
        <button type="button" onClick={() => apiRef.current?.focus()}>
          Focus
        </button>
        <button type="button" onClick={() => apiRef.current?.selectAll()}>
          Select all
        </button>
      </div>
      <p className="muted">This example uses ref as a prop and still exposes methods with useImperativeHandle.</p>
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

// ─────────────────────────────────────────────────────────
// createPortal
// ─────────────────────────────────────────────────────────

export const hookPortal: TopicNode = {
  id: "react-create-portal",
  title: "createPortal",
  iconName: "AppWindow",
  demoComponentKey: "portal",
  link: "https://react.dev/reference/react-dom/createPortal",
  theory:
    "createPortal renders React children into a different DOM node than the component's natural parent, while keeping them in the React component tree. It's the standard solution for modals, tooltips, and overlays that must visually escape overflow:hidden or z-index stacking contexts.",
  theoryDetail: {
    keyConcepts: [
      "createPortal(children, domNode, key?) — children renders into domNode (e.g. document.body) regardless of where the component is in the DOM",
      "React context crosses portal boundaries — a portal's content is part of the React tree and can read any context provided by its React ancestors",
      "React event bubbling follows the React tree, not the DOM tree — events from portal content bubble up through React ancestors even though they're in a different DOM location",
      "The portal's lifecycle follows the component that renders it — unmounting the component unmounts the portal content",
    ],
    whyItMatters:
      "Modals, tooltips, and dropdowns rendered inside deeply nested components often clip or get hidden by parent overflow:hidden or z-index stacking contexts. Portals escape the DOM hierarchy while staying in the React tree — getting the best of both worlds: visual freedom and React integration (context, events, lifecycle).",
    commonPitfalls: [
      "Forgetting focus trapping in modals — portals don't auto-trap keyboard focus; use a library like focus-trap-react or add manual aria-modal and keyboard handling",
      "Assuming portal events don't bubble to React ancestors — they do bubble through the React component tree; a click inside a portal modal will trigger any React onClick handlers up the tree",
      "Rendering to a DOM node that doesn't exist yet — ensure the target element is mounted before calling createPortal (use a ref or the document.body fallback)",
      "Not adding aria-modal and role='dialog' to modal portals — without these, screen readers don't know the content is a modal and may read content behind it",
    ],
    examples: [
      example(
        "Accessible modal with focus trap",
        "A portal modal that renders in document.body — escaping any parent overflow:hidden — while staying in the React tree.",
        `import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Focus the dialog on mount for accessibility
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  return createPortal(
    <div
      role="presentation"
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        style={{ background: "#fff", padding: "2rem", borderRadius: "0.5rem" }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body,
  );
}

export function App() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ overflow: "hidden" }}> {/* overflow:hidden won't clip the modal */}
      <button onClick={() => setOpen(true)}>Open modal</button>
      {open && <Modal onClose={() => setOpen(false)}>Modal content</Modal>}
    </div>
  );
}`,
      ),
      example(
        "UsePortalDemo.tsx",
        "Exact source from react/src/components/hooks/UsePortalDemo.tsx",
        `import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UsePortalDemo() {
  const renderCount = useRenderCount()
  const [open, setOpen] = useState(false)

  return (
    <article>
      <h2>Portal (createPortal)</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Renders modal outside normal DOM tree.</p>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      {open &&
        createPortal(
          <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
            <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <h3>Portal Modal</h3>
              <p>This is rendered in document.body using createPortal.</p>
              <button type="button" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>,
          document.body,
        )}
    </article>
  )
}`,
      ),
      useRenderCountExample,
    ],
  },
};

export const modernHookTopics: TopicNode[] = [
  hookUseId,
  hookUseImperativeHandle,
  hookUseDeferredValue,
  hookUseSyncExternalStore,
  hookUseDebugValue,
  hookUseInsertionEffect,
  hookUse,
  hookUseActionState,
  hookUseOptimistic,
  hookUseEffectEvent,
  hookUseStateEvent,
  hookRefAsProp,
  hookPortal,
];
