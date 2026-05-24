import type { TopicNode } from "@/data/types";

export const concurrentRendering: TopicNode = {
  id: "react-concurrent-rendering",
  title: "Concurrent Rendering",
  iconName: "Layers",
  theory:
    "Concurrent Rendering is React 18's new rendering model. React can now interrupt, pause, resume, and abandon in-progress renders, allowing the browser to stay responsive while heavy updates are computed in the background.",
  theoryDetail: {
    keyConcepts: [
      "Concurrent rendering is opt-in — it activates when you switch to `createRoot` (React 18+)",
      "React can work on multiple versions of the UI at the same time without blocking the main thread",
      "Urgent updates (typing, clicking) are prioritised over non-urgent ones (search results, list transitions)",
      "`useTransition` — marks a state update as non-urgent; returns `[isPending, startTransition]`",
      "`useDeferredValue` — defers a derived value, showing stale content while fresh content prepares",
      "`startTransition` — the standalone function equivalent of `useTransition` for use outside components",
      "Automatic batching — React 18 batches all state updates (timeouts, promises, native events) by default",
      "Tearing prevention — React guarantees a consistent snapshot of external store state during a render",
    ],
    whyItMatters:
      "Before React 18, a large state update would block the browser entirely until it finished — causing janky UIs. Concurrent Rendering lets React keep interactions snappy by deferring expensive work and yielding control back to the browser between chunks of rendering.",
    commonPitfalls: [
      "Still using `ReactDOM.render` — it opts out of concurrent features entirely; migrate to `createRoot`",
      "Wrapping every update in `startTransition` — only defer genuinely non-urgent updates, otherwise transitions feel sluggish",
      "Forgetting that `useDeferredValue` shows stale content — always visually indicate staleness with opacity or a spinner keyed off the deferred vs live value equality",
      "Reading external mutable state during render without `useSyncExternalStore` — can cause tearing",
      "Treating `isPending` as a loading state for async data — it only reflects whether a transition is in progress, not whether a fetch has completed",
    ],
    comparisons: [
      {
        title: "useTransition vs useDeferredValue",
        points: [
          "`useTransition` — you control which state setter is deferred; best when you own the state update",
          "`useDeferredValue` — defers a value you receive (e.g. a prop); best when you don't own the setter",
          "Both produce the same outcome: urgent renders ship first, the deferred version catches up",
          "Use `useTransition` for user-triggered events; `useDeferredValue` for prop-driven recalculations",
        ],
      },
      {
        title: "Concurrent Rendering vs Legacy Synchronous Rendering",
        points: [
          "Legacy: every render runs to completion before the browser can paint — blocks input during heavy updates",
          "Concurrent: renders are interruptible; React yields to the browser between chunks of work",
          "Legacy mode: `ReactDOM.render(<App />, root)`",
          "Concurrent mode: `createRoot(root).render(<App />)` — required for all React 18 features",
        ],
      },
    ],
    examples: [
      {
        title: "Opt in to Concurrent Rendering with createRoot",
        description:
          "Switching from the legacy render API to createRoot unlocks all concurrent features.",
        code: `// ❌ Legacy — blocks concurrent features
import ReactDOM from "react-dom";
ReactDOM.render(<App />, document.getElementById("root"));

// ✅ React 18 — enables concurrent rendering
import { createRoot } from "react-dom/client";
const root = createRoot(document.getElementById("root")!);
root.render(<App />);`,
        language: "typescript",
      },
      {
        title: "useTransition — keeping the UI responsive during heavy updates",
        description:
          "Wrapping the slow state update in startTransition lets React deprioritise it while keeping typing instant.",
        code: `import { useState, useTransition } from "react";

const ITEMS = Array.from({ length: 20_000 }, (_, i) => \`Item \${i}\`);

export function FilterList() {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState(ITEMS);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Urgent: update the input immediately
    setQuery(e.target.value);

    // Non-urgent: filter the list in the background
    startTransition(() => {
      setFiltered(ITEMS.filter((item) => item.includes(e.target.value)));
    });
  }

  return (
    <div>
      <input value={query} onChange={handleChange} placeholder="Filter…" />
      {isPending && <span>Updating…</span>}
      <ul style={{ opacity: isPending ? 0.6 : 1 }}>
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}`,
        language: "typescript",
      },
      {
        title: "useDeferredValue — deferring a prop-driven recalculation",
        description:
          "When you don't own the state setter (e.g. it comes from a parent), useDeferredValue lets you show stale results while the fresh ones are computed.",
        code: `import { useDeferredValue, memo } from "react";

// Wrap the expensive list in memo so React can skip re-rendering
// the stale version while the deferred value catches up
const HeavyList = memo(function HeavyList({ query }: { query: string }) {
  const items = Array.from({ length: 10_000 }, (_, i) => \`Item \${i}\`).filter(
    (item) => item.includes(query)
  );
  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
});

export function Search({ query }: { query: string }) {
  // deferredQuery lags behind query — React renders the urgent
  // version first, then schedules the deferred re-render
  const deferredQuery = useDeferredValue(query);
  const isStale = deferredQuery !== query;

  return (
    <div style={{ opacity: isStale ? 0.6 : 1 }}>
      <HeavyList query={deferredQuery} />
    </div>
  );
}`,
        language: "typescript",
      },
      {
        title: "Automatic Batching in React 18",
        description:
          "React 18 batches state updates from ALL contexts — not just event handlers — reducing unnecessary re-renders.",
        code: `import { useState } from "react";

// Before React 18: each setState inside setTimeout triggered a separate render
// After React 18 with createRoot: both updates are batched into one render

function Demo() {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  function handleClick() {
    // Batched in React 18 — only ONE re-render
    setCount((c) => c + 1);
    setFlag((f) => !f);
  }

  function handleAsync() {
    setTimeout(() => {
      // Also batched in React 18 (was NOT batched in React 17)
      setCount((c) => c + 1);
      setFlag((f) => !f);
    }, 1000);
  }

  return (
    <>
      <button onClick={handleClick}>Sync update</button>
      <button onClick={handleAsync}>Async update</button>
      <p>{count} — {String(flag)}</p>
    </>
  );
}`,
        language: "typescript",
      },
      {
        title: "useSyncExternalStore — safe external state in concurrent mode",
        description:
          "External stores (e.g. custom pub-sub, Zustand internals) must use useSyncExternalStore to prevent UI tearing during concurrent renders.",
        code: `import { useSyncExternalStore } from "react";

// Minimal external store
let count = 0;
const listeners = new Set<() => void>();

const countStore = {
  getSnapshot: () => count,
  subscribe: (callback: () => void) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
  increment: () => {
    count++;
    listeners.forEach((l) => l());
  },
};

export function Counter() {
  // React guarantees a consistent snapshot — no tearing
  const value = useSyncExternalStore(
    countStore.subscribe,
    countStore.getSnapshot
  );

  return (
    <button onClick={countStore.increment}>
      Count: {value}
    </button>
  );
}`,
        language: "typescript",
      },
    ],
  },
};
