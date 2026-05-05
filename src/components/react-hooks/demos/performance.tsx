"use client";

import { useState, useMemo, useCallback, useRef, memo } from "react";
import { DemoCard, RenderBadge, SaveButton } from "../ui";
import { useRenderCount } from "../hooks";

export function UseMemoCallbackDemo() {
  const renderCount = useRenderCount();
  const [query, setQuery] = useState("1");
  const [note, setNote] = useState("Memoize callbacks passed to children");
  const [saved, setSaved] = useState(false);

  const bigList = useMemo(() => Array.from({ length: 1600 }, (_, index) => `Item ${index + 1}`), []);

  const filtered = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) {
      return bigList.slice(0, 20);
    }
    return bigList.filter(item => item.includes(normalized)).slice(0, 20);
  }, [bigList, query]);

  const onSave = useCallback(() => {
    window.localStorage.setItem("techlearning-use-callback-note", note);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1200);
  }, [note]);

  return (
    <DemoCard title="useMemo & useCallback">
      <RenderBadge count={renderCount} />
      <p>useMemo caches expensive filtering; useCallback stabilizes callback identity.</p>
      <input
        value={query}
        onChange={event => setQuery(event.target.value)}
        placeholder="Filter"
        className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
      />
      <ul className="max-h-48 overflow-auto rounded-lg border border-(--border) p-3">
        {filtered.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <div className="space-y-2 rounded-lg border border-(--border) p-3">
        <input
          value={note}
          onChange={event => setNote(event.target.value)}
          className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
        />
        <div className="flex items-center gap-3">
          <SaveButton onSave={onSave} />
          {saved && <span className="text-xs text-(--success)">Saved</span>}
        </div>
      </div>
    </DemoCard>
  );
}
