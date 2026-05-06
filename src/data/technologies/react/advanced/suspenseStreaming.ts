import type { TopicNode } from "@/data/types";

export const suspenseStreaming: TopicNode = {
  id: "react-suspense-streaming",
  title: "Suspense & Streaming",
  iconName: "Layers",
  link: "https://react.dev/reference/react/Suspense",
  theory:
    "Suspense lets you declaratively handle async loading states. Instead of managing `isLoading` booleans manually, you wrap async components in <Suspense> and React shows a fallback until the data is ready. Streaming SSR sends HTML in chunks as data resolves, so users see content progressively instead of waiting for the entire page.",
  theoryDetail: {
    keyConcepts: [
      "<Suspense fallback={<Spinner />}> — React shows the fallback while the child component is loading (data, lazy import, etc.)",
      "Streaming SSR sends the shell instantly and streams in async sections as they resolve — no blocking on slow data",
      "Nested Suspense boundaries let you control loading granularity — one spinner per section, not one for the entire page",
      "The `use()` hook integrates with Suspense to read promises in Client Components",
      "React.lazy() uses Suspense for code splitting — the lazy component suspends while its chunk loads",
      "Error Boundaries + Suspense = complete async UI: loading, success, and error states handled declaratively",
    ],
    whyItMatters:
      "Traditional loading patterns (useState + useEffect + isLoading) create waterfall fetches and messy conditional rendering. Suspense inverts the model: write your component as if data is always available, and React handles the loading UI. Combined with streaming, users see meaningful content in milliseconds, not seconds.",
    commonPitfalls: [
      "Wrapping the entire app in one Suspense boundary — use granular boundaries so parts of the page can load independently",
      "Forgetting an Error Boundary alongside Suspense — without it, a thrown error crashes the whole tree",
      "Using Suspense without a data-fetching library that supports it (only use(), React.lazy, and compatible libraries like TanStack Query trigger Suspense)",
      "Not providing meaningful skeleton fallbacks — a spinner is worse than a layout placeholder",
      "Client Components can't use async/await directly — use the `use()` hook or a Suspense-compatible fetch library",
    ],
    examples: [
      {
        title: "Nested Suspense Boundaries",
        description:
          "Each section loads independently. The shell appears instantly; individual sections stream in as their data resolves.",
        code: `// app/dashboard/page.tsx
import { Suspense } from 'react';
import { RevenueChart } from './RevenueChart';
import { LatestInvoices } from './LatestInvoices';
import { CardsSkeleton, ChartSkeleton, InvoicesSkeleton } from './Skeletons';
import { StatsCards } from './StatsCards';

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>

      {/* Each Suspense boundary loads independently */}
      <Suspense fallback={<CardsSkeleton />}>
        <StatsCards />  {/* Resolves in ~200ms */}
      </Suspense>

      <div className="grid grid-cols-2 gap-4">
        <Suspense fallback={<ChartSkeleton />}>
          <RevenueChart />  {/* Resolves in ~800ms */}
        </Suspense>

        <Suspense fallback={<InvoicesSkeleton />}>
          <LatestInvoices />  {/* Resolves in ~1200ms */}
        </Suspense>
      </div>
    </main>
  );
}

// Users see: Shell → Cards → Chart → Invoices
// Instead of: Blank screen → Everything at once`,
        language: "tsx",
      },
      {
        title: "Suspense with use() Hook",
        description:
          "The use() hook reads a promise inside a Client Component, integrating with Suspense for automatic loading states.",
        code: `'use client';

import { use, Suspense } from 'react';

// Create the promise OUTSIDE the component (or in a parent/cache)
const commentsPromise = fetch('/api/comments').then(r => r.json());

function Comments() {
  // use() suspends until the promise resolves
  // React shows the nearest Suspense fallback while waiting
  const comments = use(commentsPromise);

  return (
    <ul>
      {comments.map((c: { id: number; text: string }) => (
        <li key={c.id}>{c.text}</li>
      ))}
    </ul>
  );
}

// ✅ Conditional use() — unlike hooks, use() CAN be called conditionally
function ConditionalData({ shouldLoad }: { shouldLoad: boolean }) {
  if (!shouldLoad) return <p>Click to load</p>;

  const data = use(fetchPromise);  // OK inside conditions!
  return <pre>{JSON.stringify(data)}</pre>;
}

export function CommentsSection() {
  return (
    <Suspense fallback={<p>Loading comments...</p>}>
      <Comments />
    </Suspense>
  );
}`,
        language: "tsx",
      },
      {
        title: "Code Splitting with React.lazy",
        description:
          "Dynamically import heavy components so their JavaScript only loads when needed.",
        code: `import { lazy, Suspense, useState } from 'react';

// The chart library (e.g., recharts) is only downloaded when the tab is active
const HeavyChart = lazy(() => import('./HeavyChart'));
const DataTable = lazy(() => import('./DataTable'));

function AnalyticsDashboard() {
  const [tab, setTab] = useState<'chart' | 'table'>('chart');

  return (
    <div>
      <nav>
        <button onClick={() => setTab('chart')}>Chart View</button>
        <button onClick={() => setTab('table')}>Table View</button>
      </nav>

      <Suspense fallback={<div className="skeleton" />}>
        {tab === 'chart' ? <HeavyChart /> : <DataTable />}
      </Suspense>
    </div>
  );
}

// Bundle analysis result:
// main.js        → 45 KB (shell + nav)
// HeavyChart.js  → 120 KB (loaded on demand)
// DataTable.js   → 80 KB (loaded on demand)
// Total savings: 200 KB not loaded on initial page load`,
        language: "tsx",
      },
      {
        title: "Suspense + Error Boundary",
        description:
          "The complete pattern: handle loading AND error states declaratively without manual state management.",
        code: `import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="error-panel">
      <h3>Something went wrong</h3>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="skeleton-grid">
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="skeleton-card pulse" />
      ))}
    </div>
  );
}

// ✅ Complete async pattern — no isLoading, no error state, no try/catch
export function ProductsSection() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingSkeleton />}>
        <ProductList />
      </Suspense>
    </ErrorBoundary>
  );
}

// Compare with the traditional approach:
// ❌ const [products, setProducts] = useState([]);
// ❌ const [loading, setLoading] = useState(true);
// ❌ const [error, setError] = useState(null);
// ❌ useEffect(() => { fetch(...).then(...).catch(...) }, []);
// ❌ if (loading) return <Spinner />;
// ❌ if (error) return <Error />;
// ❌ return <List data={products} />;`,
        language: "tsx",
      },
    ],
  },
};
