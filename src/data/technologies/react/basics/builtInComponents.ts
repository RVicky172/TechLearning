import type { TopicNode } from "@/data/types";

export const builtInComponents: TopicNode = {
  id: "react-built-in-components",
  title: "Built-in React Components",
  iconName: "Box",
  link: "https://react.dev/reference/react/components",
  theory:
    "React ships five built-in components that are available in any JSX without importing from a third-party library. Each one solves a specific structural or diagnostic concern: grouping nodes without extra DOM elements, measuring render performance, showing fallbacks during async loading, catching development bugs early, and hiding/restoring UI subtrees while preserving their state.",
  theoryDetail: {
    keyConcepts: [
      "<Fragment> / <>...</>: wraps multiple JSX nodes without adding a DOM element — use the shorthand <>...</> everywhere; use <Fragment key={id}> only when you need a key prop (e.g. inside .map())",
      "<Suspense>: displays a fallback UI (skeleton, spinner) while a child component is loading — works with React.lazy() for code-splitting and with data-fetching libraries that support Suspense (TanStack Query, Next.js Server Components)",
      "<StrictMode>: development-only wrapper that double-invokes render functions and effects to surface side-effect bugs; adds deprecation warnings; has zero cost in production builds",
      "<Profiler>: measures how long a component tree takes to render — takes an onRender callback with timing data; use to find slow subtrees before reaching for memoisation",
      "<Activity> (React 19+): hides a UI subtree from the screen while keeping its state alive — similar to CSS display:none but React-aware; used for background prerendering of tabs, modals, and off-screen routes",
    ],
    whyItMatters:
      "These components are the building blocks of performant, debuggable React apps. Suspense + lazy() is the standard code-splitting pattern. StrictMode is the first tool for catching subtle bugs. Profiler replaces guesswork with data. Activity unlocks instant tab switching without re-mounting. Understanding all five is expected knowledge in React interviews.",
    commonPitfalls: [
      "Wrapping the entire app in <Suspense> with one fallback — nest multiple Suspense boundaries to show granular fallbacks and avoid the whole page blanking",
      "Forgetting that StrictMode double-invokes effects in development — if your effect breaks on double-invocation, it has a cleanup problem; fix the cleanup, don't remove StrictMode",
      "Using <Fragment key={id}> with the shorthand syntax — <> does not accept props; switch to <Fragment key={id}> when you need a key",
      "Placing <Profiler> in production — the onRender callback still fires in production builds and adds overhead; wrap it in a check or remove it after profiling",
    ],
    examples: [
      {
        title: "Fragment — group without a wrapper div",
        description:
          "Use <> shorthand to return multiple elements; use <Fragment key> inside .map() when each item needs a key.",
        code: `import { Fragment } from "react";

// ── Shorthand: no extra DOM node ──────────────────────────
function UserCard() {
  return (
    <>
      <dt>Name</dt>
      <dd>Alice</dd>
    </>
  );
}

// ── Fragment with key — required inside .map() ────────────
const items = [
  { id: 1, term: "React",  desc: "UI library" },
  { id: 2, term: "Next.js", desc: "React framework" },
];

function DefinitionList() {
  return (
    <dl>
      {items.map(({ id, term, desc }) => (
        <Fragment key={id}>
          <dt>{term}</dt>
          <dd>{desc}</dd>
        </Fragment>
      ))}
    </dl>
  );
}`,
        language: "tsx",
      },
      {
        title: "Suspense + React.lazy() — code splitting",
        description:
          "Lazily load a heavy component and show a skeleton fallback while the bundle chunk downloads.",
        code: `import { lazy, Suspense } from "react";

// React.lazy() dynamically imports the component
// The bundle for HeavyChart is only downloaded when it's first rendered
const HeavyChart = lazy(() => import("./HeavyChart"));

function ChartSkeleton() {
  return (
    <div className="animate-pulse h-64 w-full rounded-lg bg-(--bg-elevated)" />
  );
}

export function Dashboard() {
  return (
    <section>
      <h2>Analytics</h2>

      {/* Suspense catches the lazy() Promise and shows the fallback */}
      <Suspense fallback={<ChartSkeleton />}>
        <HeavyChart />
      </Suspense>
    </section>
  );
}`,
        language: "tsx",
      },
      {
        title: "StrictMode — catch bugs in development",
        description:
          "Wrap your app (or a subtree) in StrictMode to get double-render checks, effect double-invocation, and deprecation warnings.",
        code: `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Recommended: wrap the entire app at the entry point
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// ── What StrictMode does in development ───────────────────
// 1. Renders components twice to catch impure render functions
// 2. Runs effects (setup + cleanup) twice to catch missing cleanups
// 3. Warns about deprecated APIs (findDOMNode, legacy context, etc.)
// 4. Zero impact on production builds — safe to always leave on

// ── Common StrictMode failure pattern ─────────────────────
function BadComponent() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount(c => c + 1), 1000);
    // ❌ Missing cleanup — StrictMode will expose this bug:
    // The interval runs twice, count increments at double speed
    // return () => clearInterval(id);  ← add this
  }, []);

  return <div>{count}</div>;
}`,
        language: "tsx",
      },
      {
        title: "Profiler — measure render performance",
        description:
          "Wrap any subtree with Profiler to get precise render timings and identify slow components.",
        code: `import { Profiler } from "react";
import type { ProfilerOnRenderCallback } from "react";

const onRender: ProfilerOnRenderCallback = (
  id,           // the "id" prop of the Profiler tree
  phase,        // "mount" or "update"
  actualDuration,  // ms spent rendering this commit
  baseDuration,    // estimated ms without memoisation
  startTime,
  commitTime,
) => {
  // Log to console or send to an analytics endpoint
  console.log(\`[\${id}] \${phase} — \${actualDuration.toFixed(2)}ms\`);
};

export function App() {
  return (
    // Wrap the subtree you want to measure
    <Profiler id="ProductList" onRender={onRender}>
      <ProductList />
    </Profiler>
  );
}

// ── Typical output ─────────────────────────────────────────
// [ProductList] mount  — 12.40ms   ← initial render
// [ProductList] update — 2.10ms    ← after state change
// If actualDuration >> baseDuration, add React.memo to children`,
        language: "tsx",
      },
      {
        title: "Activity — hide/restore UI without losing state (React 19+)",
        description:
          "Activity keeps a hidden subtree mounted in memory so re-activating it is instant — ideal for tabs, modals, and prefetched routes.",
        code: `import { Activity, useState } from "react";

type Tab = "overview" | "analytics" | "settings";

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div>
      <nav className="flex gap-2">
        {(["overview", "analytics", "settings"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? "font-bold underline" : ""}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Each tab stays mounted but is hidden when not active.
          Switching tabs is instant — no remount, no lost scroll position,
          no re-fetching data that was already loaded. */}
      <Activity mode={activeTab === "overview"   ? "visible" : "hidden"}>
        <OverviewTab />
      </Activity>
      <Activity mode={activeTab === "analytics"  ? "visible" : "hidden"}>
        <AnalyticsTab />
      </Activity>
      <Activity mode={activeTab === "settings"   ? "visible" : "hidden"}>
        <SettingsTab />
      </Activity>
    </div>
  );
}

// Activity vs conditional rendering:
// {show && <HeavyTab />}  ← unmounts on hide, remounts on show (loses state, re-fetches)
// <Activity mode="hidden"><HeavyTab /></Activity>  ← keeps state alive, instant reveal`,
        language: "tsx",
      },
    ],
  },
};
