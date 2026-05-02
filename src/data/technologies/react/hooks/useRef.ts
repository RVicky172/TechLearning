import type { TopicNode } from "@/data/types";

export const hookUseRef: TopicNode = {
  id: "hook-useref",
  title: "useRef",
  iconName: "Anchor",
  link: "https://react.dev/reference/react/useRef",
  theory:
    "useRef returns a mutable container object { current: value } that persists across renders without causing re-renders when changed. It has two distinct uses: holding a reference to a DOM node, and storing any mutable value that should survive re-renders but doesn't need to trigger them.",
  theoryDetail: {
    keyConcepts: [
      "ref.current is the raw DOM node after the element mounts — available inside effects and event handlers",
      "Changing ref.current does NOT trigger a re-render — it's a plain JS object, not reactive state",
      "Pass ref={myRef} to any JSX element to attach it; React sets ref.current on mount and null on unmount",
      "Common use-cases: focus management, scroll control, storing previous values, caching timer IDs",
    ],
    whyItMatters:
      "Some DOM interactions (focus, scroll, measuring dimensions, playing media) require a direct reference to the element and can't be expressed declaratively. useRef also solves the stale-closure problem for mutable values that effects need but shouldn't react to.",
    commonPitfalls: [
      "Reading ref.current during render — refs are not reactive; the value may be null or stale before mount",
      "Using useRef for values that should cause re-renders — use useState or useReducer for those",
      "Forgetting that ref.current is null until after the first commit — always guard inside effects or handlers",
      "Storing JSX or computed values in refs instead of derived state or memoized values",
    ],
    examples: [
      {
        title: "Focus an input programmatically",
        description: "Attach a ref to an input and focus it when a button is clicked.",
        code: `import { useRef } from 'react';

function SearchBar() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Search..." />
      <button onClick={focusInput}>Focus Search</button>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Persist a value without re-rendering",
        description: "Store a timer ID so it can be cleared later, without affecting the render cycle.",
        code: `import { useState, useRef } from 'react';

function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);   // stores interval ID — NOT state

  const start = () => {
    if (timerRef.current) return;  // already running
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  return (
    <div>
      <p>{elapsed}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Track previous value",
        description: "Capture the previous render's value using a ref updated in an effect.",
        code: `import { useState, useRef, useEffect } from 'react';

function usePrevious(value) {
  const ref = useRef(undefined);
  useEffect(() => { ref.current = value; });   // runs after render
  return ref.current;                          // returns value from LAST render
}

function PriceDisplay({ price }) {
  const prev = usePrevious(price);
  const diff = prev !== undefined ? price - prev : 0;

  return (
    <p>
      \${price} {diff !== 0 && <span>({diff > 0 ? '+' : ''}{diff})</span>}
    </p>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
