"use client";

import { useState, useEffect } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount, useCounter, useLocalStorageState } from "../hooks";

export function CreateCustomHookGuideDemo() {
  const likes = useCounter(10);

  return (
    <DemoCard title="Custom Hooks">
      <RenderBadge count={likes.renderCount} />
      <p>Extract repeated stateful logic into reusable hooks.</p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={likes.decrement}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          -
        </button>
        <strong className="text-(--text-1)">{likes.count}</strong>
        <button
          type="button"
          onClick={likes.increment}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          +
        </button>
        <button
          type="button"
          onClick={likes.reset}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Reset
        </button>
      </div>
    </DemoCard>
  );
}

export function UseStateDemo() {
  const renderCount = useRenderCount();
  const [count, setCount] = useState(0);
  const [note, setNote] = useLocalStorageState("techlearning-hooks-note", "Persistent note from custom hook");

  return (
    <DemoCard title="useState">
      <RenderBadge count={renderCount} />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCount(value => value + 1)}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Clicked: {count}
        </button>
        <button
          type="button"
          onClick={() => setCount(0)}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Reset
        </button>
      </div>
      <input
        value={note}
        onChange={event => setNote(event.target.value)}
        className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
      />
      <p>Saved by custom hook: useLocalStorageState.</p>
    </DemoCard>
  );
}

export function UseEffectDemo() {
  const renderCount = useRenderCount();
  const [clicks, setClicks] = useState(0);
  const [enabled, setEnabled] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    document.title = `Hooks clicks: ${clicks}`;
  }, [clicks]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setSeconds(value => value + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled]);

  return (
    <DemoCard title="useEffect">
      <RenderBadge count={renderCount} />
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setClicks(value => value + 1)}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          Update title ({clicks})
        </button>
        <button
          type="button"
          onClick={() => setEnabled(value => !value)}
          className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
        >
          {enabled ? "Stop timer" : "Start timer"}
        </button>
      </div>
      <p>Timer seconds: {seconds}</p>
    </DemoCard>
  );
}
