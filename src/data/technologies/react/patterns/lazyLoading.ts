import type { TopicNode } from "@/data/types";

export const lazyLoading: TopicNode = {
  id: "react-lazy-loading",
  title: "Lazy Loading & Suspense",
  iconName: "Loader",
  link: "https://react.dev/reference/react/lazy",
  theory:
    "React.lazy() lets you defer loading a component's JavaScript bundle until it's first rendered. Paired with <Suspense fallback={...}>, React shows a fallback UI while the bundle downloads, then seamlessly swaps in the real component. This splits your app into smaller chunks loaded on-demand.",
  theoryDetail: {
    keyConcepts: [
      "React.lazy(() => import('./Component')) — the import() call is a dynamic import that returns a Promise",
      "<Suspense fallback={<Spinner />}> must wrap any lazy component — it catches the Promise and renders the fallback",
      "Code splitting happens automatically at every React.lazy boundary — the bundler (Webpack/Turbopack) creates a separate chunk",
      "Suspense can also handle async data in React 18+ when used with libraries that support it (React Query, Relay)",
    ],
    whyItMatters:
      "Loading the entire app bundle upfront delays the First Contentful Paint. Lazy loading routes, modals, and heavy components that aren't needed immediately reduces the initial bundle, making the app feel faster. A 200 KB modal that's rarely opened shouldn't be parsed on every page load.",
    commonPitfalls: [
      "Placing the Suspense boundary too far up — it shows the fallback for many unrelated components; put Suspense close to the lazy component",
      "Wrapping every tiny component in lazy — the network round-trip overhead outweighs the benefit for small components",
      "Not handling rejected Promises — pair Suspense with an Error Boundary to catch import failures (bad network, 404 chunk)",
      "Lazy loading components that are always needed on the initial render — they delay the first paint instead of improving it",
    ],
    examples: [
      {
        title: "Lazy load a route component",
        description: "Split each page into its own chunk so only the visited page's JS is downloaded.",
        code: `import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Each page is a separate JS chunk
const Home      = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings  = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<div className="page-loader">Loading…</div>}>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings"  element={<Settings />} />
      </Routes>
    </Suspense>
  );
}`,
        language: "jsx",
      },
      {
        title: "Lazy load a heavy modal",
        description: "Only download the chart library when the modal is first opened.",
        code: `import { lazy, Suspense, useState } from 'react';

// HeavyChartModal imports a large chart library — load only on demand
const HeavyChartModal = lazy(() => import('./HeavyChartModal'));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(true)}>View Analytics</button>

      {showChart && (
        // Suspense boundary scoped to just the modal
        <Suspense fallback={<div>Loading chart…</div>}>
          <HeavyChartModal onClose={() => setShowChart(false)} />
        </Suspense>
      )}
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Error boundary around lazy components",
        description: "Catch failed chunk downloads gracefully instead of crashing the whole app.",
        code: `import { lazy, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const HeavyWidget = lazy(() => import('./HeavyWidget'));

function WidgetContainer() {
  return (
    <ErrorBoundary
      fallback={<p>Failed to load widget. <button onClick={() => window.location.reload()}>Retry</button></p>}
    >
      <Suspense fallback={<p>Loading widget…</p>}>
        <HeavyWidget />
      </Suspense>
    </ErrorBoundary>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
