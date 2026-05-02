import type { TopicNode } from "@/data/types";

export const hookUseTransition: TopicNode = {
  id: "hook-usetransition",
  title: "useTransition & useDeferredValue",
  iconName: "Timer",
  link: "https://react.dev/reference/react/useTransition",
  theory:
    "React 18 introduced concurrent rendering — the ability to interrupt, pause and resume renders. useTransition and useDeferredValue are the two hooks that let you mark state updates as low-priority (non-urgent) so React can keep the UI responsive while the expensive update is in progress.",
  theoryDetail: {
    keyConcepts: [
      "useTransition() returns [isPending, startTransition] — wrap slow state updates in startTransition to mark them non-urgent",
      "useDeferredValue(value) returns a version of the value that lags behind during high-priority updates, useful for derived expensive renders",
      "While a transition is pending, the old UI stays visible — React renders the new state in the background",
      "startTransition cannot wrap async code — it must be synchronous; useTransition is for state updates you control",
    ],
    whyItMatters:
      "Before React 18, every state update was treated equally — a slow render would block typing, clicking, and scrolling. useTransition lets you tell React 'this update can wait' so interaction stays smooth even when re-rendering a huge list or complex chart.",
    commonPitfalls: [
      "Wrapping async fetches in startTransition — it only works with synchronous state updates; combine with Suspense for async",
      "Using transitions for every update — reserve them for genuinely slow renders; they add complexity otherwise",
      "Expecting isPending to show while the transition renders on screen — it only covers the time until React starts committing",
    ],
    examples: [
      {
        title: "useTransition — keep input responsive during slow list filter",
        description: "Type in an input without lag even while a large list re-renders.",
        code: `import { useState, useTransition } from 'react';

const ITEMS = Array.from({ length: 20_000 }, (_, i) => \`Item \${i}\`);

function SlowList({ filter }) {
  const shown = ITEMS.filter(i => i.includes(filter));
  return <ul>{shown.map(i => <li key={i}>{i}</li>)}</ul>;
}

function FilteredPage() {
  const [input, setInput]   = useState('');
  const [filter, setFilter] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    setInput(e.target.value);           // urgent — updates immediately
    startTransition(() => {
      setFilter(e.target.value);        // non-urgent — can be interrupted
    });
  };

  return (
    <>
      <input value={input} onChange={handleChange} placeholder="Filter…" />
      {isPending && <span>Updating list…</span>}
      <SlowList filter={filter} />
    </>
  );
}`,
        language: "jsx",
      },
      {
        title: "useDeferredValue — debounce a derived render",
        description: "Defer the expensive child render without controlling the state update yourself.",
        code: `import { useState, useDeferredValue, memo } from 'react';

const HeavyResults = memo(function HeavyResults({ query }) {
  // simulate slow render
  const items = Array.from({ length: 5000 }, (_, i) => \`\${query} result \${i}\`);
  return <ul>{items.slice(0, 20).map(i => <li key={i}>{i}</li>)}</ul>;
});

function Search() {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);   // lags behind during typing
  const isStale = query !== deferred;

  return (
    <>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <div style={{ opacity: isStale ? 0.5 : 1 }}>
        <HeavyResults query={deferred} />
      </div>
    </>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
