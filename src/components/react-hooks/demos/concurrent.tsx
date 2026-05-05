"use client";

import { useState, useMemo, useTransition, useDeferredValue } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";

export function UseTransitionDeferredDemo() {
  const renderCount = useRenderCount();
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("");
  const [isPending, startTransition] = useTransition();
  const deferredFilter = useDeferredValue(filter);

  const bigList = useMemo(() => Array.from({ length: 2500 }, (_, index) => `Item ${index + 1}`), []);

  const filtered = useMemo(() => {
    const q = deferredFilter.trim();
    if (!q) {
      return bigList.slice(0, 40);
    }
    return bigList.filter(item => item.includes(q)).slice(0, 40);
  }, [bigList, deferredFilter]);

  return (
    <DemoCard title="useTransition & useDeferredValue">
      <RenderBadge count={renderCount} />
      <input
        value={input}
        onChange={event => {
          const value = event.target.value;
          setInput(value);
          startTransition(() => {
            setFilter(value);
          });
        }}
        placeholder="Type to filter"
        className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
      />
      <p>{isPending ? "Transitioning..." : `Showing results for: ${deferredFilter || "(all)"}`}</p>
      <ul className="max-h-56 overflow-auto rounded-lg border border-(--border) p-3">
        {filtered.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </DemoCard>
  );
}

export function UseDeferredValueDemo() {
  const renderCount = useRenderCount();
  const [search, setSearch] = useState("hook");
  const deferredSearch = useDeferredValue(search);
  const dataset = useMemo(() => Array.from({ length: 1800 }, (_, index) => `Hook helper ${index + 1}`), []);

  const filtered = useMemo(() => {
    const query = deferredSearch.toLowerCase().trim();
    if (!query) {
      return dataset.slice(0, 20);
    }
    return dataset.filter(item => item.toLowerCase().includes(query)).slice(0, 20);
  }, [dataset, deferredSearch]);

  return (
    <DemoCard title="useDeferredValue">
      <RenderBadge count={renderCount} />
      <input
        value={search}
        onChange={event => setSearch(event.target.value)}
        placeholder="Search"
        className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
      />
      <p>Deferred query: {deferredSearch}</p>
      <ul className="max-h-56 overflow-auto rounded-lg border border-(--border) p-3">
        {filtered.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </DemoCard>
  );
}
