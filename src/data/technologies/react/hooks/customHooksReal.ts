import type { TopicNode } from "@/data/types";

export const customHooksReal: TopicNode = {
  id: "react-custom-hooks-real-world",
  title: "Real-World Custom Hooks",
  iconName: "Wrench",
  demoComponentKey: "customHooksReal",
  link: "https://react.dev/learn/reusing-logic-with-custom-hooks",
  theory:
    "Production React apps rely on a toolkit of battle-tested custom hooks that eliminate repetitive boilerplate across every project. These aren't academic examples — they're the actual hooks that appear in every senior React codebase: debouncing expensive API calls, persisting state to localStorage, observing element visibility, tracking window dimensions, and reading the previous value of any prop or state.",
  theoryDetail: {
    keyConcepts: [
      "useDebounce: delay expensive operations (search API calls) until the user stops typing",
      "useLocalStorage: useState that automatically persists to and reads from localStorage",
      "useIntersectionObserver: fire callbacks when elements enter/leave the viewport — the foundation of infinite scroll and lazy images",
      "usePrevious: capture the previous value of any prop or state variable for comparison",
      "useWindowSize: track viewport dimensions for responsive logic in JavaScript",
      "Each hook is a small, focused unit — compose them together for complex behavior",
    ],
    whyItMatters:
      "Every project reinvents these wheels. Recognising the patterns behind them — syncing React state with external systems (localStorage, DOM APIs, timers) — is what separates junior developers who copy code from senior developers who understand WHY each hook is structured the way it is. They're also a common interview topic.",
    commonPitfalls: [
      "useDebounce without cleanup — always clear the timeout in the cleanup function or you'll fire stale callbacks",
      "useLocalStorage with JSON.parse without a try/catch — corrupted localStorage entries will crash the app",
      "useIntersectionObserver without disconnect() cleanup — memory leak if the component unmounts while observing",
      "useWindowSize without a debounced resize handler — fires on every pixel of window resize, potentially 100+ times per second",
      "Forgetting to use a ref in usePrevious — a regular variable resets to undefined on each render",
    ],
    examples: [
      {
        title: "useDebounce — Debounce Any Value",
        description:
          "The most-used hook in any search UX. Delays updating a value until the user stops typing for `delay` ms. Use the debounced value as the search query to avoid firing an API call on every keystroke.",
        code: `import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update the debounced value after the delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: cancel the timer if value changes before delay expires
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ── Usage: Search with API calls ──
function ProductSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 400);

  // This effect only fires when user STOPS typing for 400ms
  // Without debounce: fires on every keystroke = 100s of API calls
  useEffect(() => {
    if (!debouncedQuery) return;
    console.log('Fetching results for:', debouncedQuery);
    // fetch(\`/api/products?q=\${debouncedQuery}\`)
  }, [debouncedQuery]);

  return (
    <div>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search products..."
      />
      {debouncedQuery !== query && <span>Typing...</span>}
    </div>
  );
}`,
        language: "tsx",
      },
      {
        title: "useLocalStorage — Persistent State",
        description:
          "Drop-in replacement for useState that reads from and writes to localStorage. Handles SSR, JSON serialization errors, and storage events from other tabs.",
        code: `import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Lazy initializer — runs once on mount (safe for SSR)
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      // Corrupted JSON, storage blocked — fall back to initialValue
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      // Allow functional updates just like useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(\`useLocalStorage: Could not save "\${key}"\`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// ── Usage: User preferences that survive page refresh ──
function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}`,
        language: "tsx",
      },
      {
        title: "useIntersectionObserver — Visibility Detection",
        description:
          "The foundation for infinite scroll, lazy image loading, and analytics (track when a CTA enters view). Uses the browser's IntersectionObserver API.",
        code: `import { useState, useEffect, useRef, type RefObject } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean; // Once visible, stop observing (e.g. lazy-loaded image)
}

function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [RefObject<HTMLDivElement | null>, boolean] {
  const { threshold = 0, root = null, rootMargin = '0px', freezeOnceVisible = false } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If already visible and we're in freeze mode, bail out early
    if (freezeOnceVisible && isIntersecting) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold, root, rootMargin }
    );
    observer.observe(el);

    // ✅ Always disconnect to prevent memory leaks
    return () => observer.disconnect();
  }, [threshold, root, rootMargin, freezeOnceVisible, isIntersecting]);

  return [ref, isIntersecting];
}

// ── Usage 1: Lazy-load a heavy component ──
function LazySection() {
  const [ref, isVisible] = useIntersectionObserver({ freezeOnceVisible: true });
  return (
    <div ref={ref} style={{ minHeight: 200 }}>
      {isVisible ? <HeavyChart /> : <Skeleton />}
    </div>
  );
}

// ── Usage 2: Infinite scroll trigger ──
function InfiniteList() {
  const [ref, isVisible] = useIntersectionObserver({ rootMargin: '200px' });
  // When the sentinel div enters view (200px before the bottom), load more
  useEffect(() => {
    if (isVisible) fetchNextPage();
  }, [isVisible]);
  return <div ref={ref} />;
}`,
        language: "tsx",
      },
      {
        title: "usePrevious & useWindowSize — Utility Hooks",
        description:
          "usePrevious stores the previous render's value (useful for 'did this prop change?' logic). useWindowSize tracks the viewport for responsive JavaScript.",
        code: `import { useRef, useEffect, useState } from 'react';

// ── usePrevious ──
// Returns the value from the PREVIOUS render
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  // Effect runs after render — so ref.current always lags one render behind
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

// Usage: animate when count direction changes
function AnimatedCounter({ count }: { count: number }) {
  const prevCount = usePrevious(count);
  const direction = prevCount === undefined
    ? 'none'
    : count > prevCount ? 'up' : 'down';

  return (
    <span className={\`animate-\${direction}\`}>
      {count}
    </span>
  );
}

// ── useWindowSize ──
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    update(); // Set initial size

    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return size;
}

// Usage: render different components per breakpoint (not CSS — actual JS logic)
function AdaptiveLayout() {
  const { width } = useWindowSize();
  return width < 768
    ? <MobileMenu />
    : <DesktopNav />;
}`,
        language: "tsx",
      },
    ],
  },
};
