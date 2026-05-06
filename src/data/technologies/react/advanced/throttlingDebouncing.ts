import type { TopicNode } from "@/data/types";

export const throttlingDebouncing: TopicNode = {
  id: "react-throttling-debouncing",
  title: "Throttling & Debouncing",
  iconName: "Timer",
  demoComponentKey: "throttlingDebouncing",
  link: "https://react.dev/learn/reusing-logic-with-custom-hooks",
  theory:
    "Throttling and debouncing are techniques to control how frequently a function fires in response to rapid events like typing, scrolling, or resizing. Without them, event handlers can fire hundreds of times per second, making expensive operations (API calls, DOM updates) crush performance. Debouncing delays execution until the event stops; throttling limits execution to at most once per interval.",
  theoryDetail: {
    keyConcepts: [
      "Debounce: waits until N ms of silence before firing — 'call me only when the user finishes typing'",
      "Throttle: fires at most once every N ms regardless of how many events occur — 'call me regularly but not too often'",
      "Use debounce for: search inputs, form validation, resize-triggered recalculations",
      "Use throttle for: scroll position tracking, mouse move events, window resize handlers, rate-limited API polling",
      "Both techniques require cleanup in useEffect to cancel pending timers on unmount",
      "The leading/trailing options control whether the function fires at the START or END of the quiet period",
    ],
    whyItMatters:
      "A search box that fires an API call on every keystroke can generate 50+ requests in 3 seconds of typing. A scroll handler without throttling fires 60+ times per second. These patterns are the difference between a smooth, performant app and one that hammers your API and causes laggy UIs. Every senior React developer implements these from scratch and knows when to reach for lodash alternatives.",
    commonPitfalls: [
      "Creating the debounced/throttled function inside the component body — it gets recreated on every render, defeating the purpose. Always wrap in useCallback or useMemo.",
      "Forgetting to cancel timers on unmount — causes 'setState on unmounted component' warnings and potential memory leaks",
      "Using debounce when you need throttle and vice versa — debounce can cause 0 calls if events never stop; throttle can miss the final event",
      "Debouncing with too short a delay (< 150ms) — still fires too frequently; too long (> 500ms) — feels sluggish to users",
      "Not considering the leading edge — sometimes you want the first call to fire immediately and then debounce subsequent calls",
    ],
    examples: [
      {
        title: "Visual: Debounce vs Throttle Behaviour",
        description:
          "Understanding the firing pattern is key to choosing the right technique. This shows how the same stream of events produces different outputs.",
        code: `// Events: user typing 'r', 'e', 'a', 'c', 't' one key every 100ms
// Debounce delay: 300ms | Throttle interval: 300ms

// RAW EVENTS (fires on every keystroke):
// 0ms   → 'r'
// 100ms → 're'
// 200ms → 'rea'
// 300ms → 'reac'
// 400ms → 'react'

// DEBOUNCED (fires 300ms after LAST event):
// ...silence...
// 700ms → 'react'  ← only ONE call, after user stops typing
// ✅ Best for: search API calls, form validation

// THROTTLED (fires at most once per 300ms):
// 0ms   → 'r'      ← fires immediately (leading edge)
// 300ms → 'rea'    ← fires after 300ms interval
// 600ms → 'react'  ← fires after next 300ms
// ✅ Best for: scroll handlers, mouse tracking, analytics

// KEY INSIGHT:
// Debounce = "wait for calm"  → minimizes total calls
// Throttle = "pace yourself" → guarantees regular cadence`,
        language: "typescript",
      },
      {
        title: "useDebounce Hook — Built from Scratch",
        description:
          "A production-ready debounce hook that works with any value. Returns the debounced value which you use as a dependency for API calls.",
        code: `import { useState, useEffect, useCallback, useRef } from 'react';

// ── Hook 1: useDebounce (debounces a VALUE) ──
// Use this when you want to delay reacting to a changing value
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    // Cleanup: cancel the timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ── Hook 2: useDebouncedCallback (debounces a FUNCTION) ──
// Use this when you want to delay calling a function directly
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number = 300
): [T, () => void] {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);

  // Always call the latest version of fn without resetting the timer
  useEffect(() => { fnRef.current = fn; }, [fn]);

  const debouncedFn = useCallback((...args: Parameters<T>) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fnRef.current(...args), delay);
  }, [delay]) as T;

  const cancel = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // Cancel on unmount to prevent memory leaks
  useEffect(() => () => cancel(), [cancel]);

  return [debouncedFn, cancel];
}

// ── Real-world usage: Search with debounce ──
function ProductSearch() {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // debouncedQuery only updates 400ms after the user stops typing
  const debouncedQuery = useDebounce(inputValue, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }
    setIsSearching(true);
    fetch(\`/api/products?q=\${encodeURIComponent(debouncedQuery)}\`)
      .then(r => r.json())
      .then(data => { setResults(data); setIsSearching(false); });
  }, [debouncedQuery]); // Only fires when user STOPS typing

  return (
    <div>
      <input
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Search products..."
      />
      {/* Show typing indicator while debounce is pending */}
      {inputValue !== debouncedQuery && <p>Typing...</p>}
      {isSearching && <p>Searching...</p>}
      <ul>
        {results.map(p => <li key={p.id}>{p.name}</li>)}
      </ul>
    </div>
  );
}`,
        language: "tsx",
      },
      {
        title: "useThrottle Hook — Built from Scratch",
        description:
          "A throttle hook that fires at most once per interval. Includes both leading-edge (fires immediately) and trailing-edge (fires after interval) options.",
        code: `import { useState, useEffect, useRef, useCallback } from 'react';

// ── Hook 1: useThrottle (throttles a VALUE) ──
export function useThrottle<T>(value: T, interval: number = 200): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastUpdated = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    const timeSinceLast = now - lastUpdated.current;

    if (timeSinceLast >= interval) {
      // Enough time has passed — update immediately
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      // Schedule an update for when the interval expires
      const timer = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLast);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}

// ── Hook 2: useThrottledCallback (throttles a FUNCTION) ──
export function useThrottledCallback<T extends (...args: never[]) => unknown>(
  fn: T,
  interval: number = 200
): T {
  const lastCalled = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fnRef = useRef(fn);

  useEffect(() => { fnRef.current = fn; }, [fn]);

  const throttled = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const remaining = interval - (now - lastCalled.current);

    if (remaining <= 0) {
      // Enough time has passed — call immediately (leading edge)
      if (timerRef.current) clearTimeout(timerRef.current);
      lastCalled.current = now;
      fnRef.current(...args);
    } else {
      // Schedule trailing-edge call
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        lastCalled.current = Date.now();
        fnRef.current(...args);
      }, remaining);
    }
  }, [interval]) as T;

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return throttled;
}

// ── Real-world usage 1: Scroll position tracker ──
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0);
  const throttledScrollY = useThrottle(scrollY, 100); // Update at most every 100ms

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // throttledScrollY is used for UI — prevents 60+ re-renders per second
  const showBackToTop = throttledScrollY > 400;

  return showBackToTop
    ? <button onClick={() => window.scrollTo(0, 0)}>↑ Back to top</button>
    : null;
}

// ── Real-world usage 2: Auto-save with throttle ──
function DocumentEditor() {
  const [content, setContent] = useState('');

  const [saveDocument] = useThrottledCallback(async (text: string) => {
    await fetch('/api/document', {
      method: 'PUT',
      body: JSON.stringify({ content: text }),
    });
    console.log('Document saved');
  }, 2000); // Save at most every 2 seconds, not on every keystroke

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    saveDocument(e.target.value);
  };

  return (
    <textarea
      value={content}
      onChange={handleChange}
      placeholder="Start typing — auto-saves every 2 seconds..."
      rows={10}
    />
  );
}`,
        language: "tsx",
      },
      {
        title: "Comparison: When to Use Each",
        description:
          "A side-by-side decision guide with real use cases for debounce vs throttle, including when to use neither.",
        code: `// ══════════════════════════════════════════════════════
// DECISION GUIDE: Debounce vs Throttle vs Neither
// ══════════════════════════════════════════════════════

// ✅ USE DEBOUNCE WHEN:
// → You only care about the FINAL value after user stops
// → Intermediate values have no meaning

const debouncedSearch = useDebounce(query, 400);    // Search input
const debouncedValidate = useDebounce(email, 600);  // Form validation
const debouncedResize = useDebounce(size, 300);     // Expensive resize recalc

// ✅ USE THROTTLE WHEN:
// → Events fire continuously and intermediate values matter
// → You want regular updates, just not every single event

const throttledScroll = useThrottle(scrollY, 100);    // Scroll position UI
const throttledMousePos = useThrottle(mousePos, 50);  // Mouse trail effects
const throttledPrice = useThrottle(ticker, 1000);     // Stock price display

// ❌ USE NEITHER WHEN:
// → The operation is cheap (no need to optimize)
// → You need to respond to every single event (e.g., dragging)
// → React 18's concurrent features already handle the update priority

// ══════════════════════════════════════════════════════
// EDGE CASES
// ══════════════════════════════════════════════════════

// Problem: Debounce + rapid unmount/remount = stale call
function SearchPage() {
  const [visible, setVisible] = useState(true);
  // If component unmounts during the debounce delay,
  // the timer fires and tries to setState on an unmounted component
  // Our useDebouncedCallback handles this via the cleanup in useEffect
  const [debouncedFn] = useDebouncedCallback(
    (q: string) => console.log('search', q),
    300
  );
  return visible ? <input onChange={e => debouncedFn(e.target.value)} /> : null;
}

// Problem: Dependencies that change on every render defeat the hook
// ❌ Wrong: fn recreated every render, debounce never settles
function Bad() {
  const [debouncedFn] = useDebouncedCallback(
    () => console.log('search'), // New function reference every render
    300
  );
}

// ✅ Correct: fnRef inside the hook always calls latest fn
// without resetting the timer — this is handled by the useRef(fn) pattern`,
        language: "tsx",
      },
    ],
  },
};
