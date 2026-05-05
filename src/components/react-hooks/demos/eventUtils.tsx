"use client";

import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";
import { DemoThemeProvider } from "../DemoThemeContext";

// useEffectEvent hook
function useEffectEvent<T extends (...args: never[]) => unknown>(fn: T): T {
  const fnRef = useRef<T>(fn);
  useLayoutEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  return useCallback((...args: Parameters<T>) => fnRef.current(...args), []) as T;
}

export function UseEffectEventDemo() {
  const renderCount = useRenderCount();
  const [count, setCount] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const onVisit = useEffectEvent(() => {
    console.log(`Visited count: ${count}, theme: ${theme}`);
  });

  useEffect(() => {
    onVisit();
  }, [count]);

  return (
    <DemoCard title="useEffectEvent">
      <RenderBadge count={renderCount} />
      <p>Reads latest state inside an effect event without extra dependencies.</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCount(value => value + 1)}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Trigger visit ({count})
        </button>
        <button
          type="button"
          onClick={() => setTheme(value => (value === "light" ? "dark" : "light"))}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Theme ({theme})
        </button>
      </div>
      <p>Check console logs for effect event output.</p>
    </DemoCard>
  );
}

// useStateEvent hook - alternative pattern
function useStateEvent<T extends (...args: never[]) => unknown>(fn: T): T {
  const fnRef = useRef<T>(fn);
  useLayoutEffect(() => {
    fnRef.current = fn;
  }, [fn]);
  return useCallback((...args: Parameters<T>) => fnRef.current(...args), []) as T;
}

export function UseStateEventDemo() {
  const renderCount = useRenderCount();
  const [count, setCount] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const logCount = useStateEvent(() => {
    setLog(prev => [...prev, `Snapshot at count = ${count}`]);
  });

  return (
    <DemoCard title="useStateEvent pattern">
      <RenderBadge count={renderCount} />
      <p>Stable callback identity that still reads latest state.</p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCount(c => c + 1)}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Increment count ({count})
        </button>
        <button
          type="button"
          onClick={logCount}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Log current count
        </button>
        <button
          type="button"
          onClick={() => setLog([])}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Clear log
        </button>
      </div>
      {log.length > 0 && (
        <ul className="list-disc space-y-1 pl-5">
          {log.map((entry, index) => (
            <li key={`${entry}-${index}`}>{entry}</li>
          ))}
        </ul>
      )}
    </DemoCard>
  );
}

// use() hook demo - reads context in Server Components
export function UseWithProviderDemo() {
  return (
    <DemoCard title="use()">
      <RenderBadge count={useRenderCount()} />
      <p>Reads context using use() instead of useContext().</p>
      <p>Use use() for reading promises and context in Server Components.</p>
    </DemoCard>
  );
}
