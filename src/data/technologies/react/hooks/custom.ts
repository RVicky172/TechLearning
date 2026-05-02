import type { TopicNode } from "@/data/types";

export const hookCustom: TopicNode = {
  id: "hook-custom",
  title: "Custom Hooks",
  iconName: "Package",
  link: "https://react.dev/learn/reusing-logic-with-custom-hooks",
  theory:
    "A custom hook is a plain JavaScript function whose name starts with 'use' and that calls one or more built-in hooks. They are the primary mechanism for extracting and sharing stateful logic between components — without adding components to the tree or changing component hierarchy.",
  theoryDetail: {
    keyConcepts: [
      "Name must start with 'use' — React's linter uses this convention to enforce rules of hooks",
      "Each component that calls the same custom hook gets its own isolated state — the hook is not a singleton",
      "Custom hooks can call other custom hooks — you can compose layers of abstraction",
      "They return whatever is useful: a value, a tuple, an object, or nothing — there is no forced API shape",
    ],
    whyItMatters:
      "Without custom hooks, stateful logic has to live directly in components or be duplicated. Custom hooks let you co-locate related state, effects, and handlers under a descriptive name, then reuse that bundle across many components — the same way utility functions share pure logic.",
    commonPitfalls: [
      "Putting custom hooks inside component bodies — they must be defined at module level, not inside another function",
      "Calling hooks conditionally inside the custom hook — all hooks must be called unconditionally on every render",
      "Returning unstable references (new objects/arrays each call) — memoize return values if consumers pass them to effects",
      "Making a custom hook too generic too early — extract only when duplication is clear and the abstraction boundary is obvious",
    ],
    examples: [
      {
        title: "useLocalStorage — persist state across sessions",
        description: "A drop-in replacement for useState that syncs to localStorage.",
        code: `import { useState, useEffect } from 'react';

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage — identical API to useState
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'dark');
  return (
    <select value={theme} onChange={e => setTheme(e.target.value)}>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
}`,
        language: "jsx",
      },
      {
        title: "useFetch — reusable data fetching",
        description: "Encapsulate loading, error, and data state for any fetch call.",
        code: `import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json(); })
      .then(setData)
      .catch(err => { if (err.name !== 'AbortError') setError(err); })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Any component — no fetch boilerplate needed
function RepoCard({ owner, repo }) {
  const { data, loading, error } = useFetch(
    \`https://api.github.com/repos/\${owner}/\${repo}\`
  );

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error.message}</p>;
  return <p>{data.full_name} ⭐ {data.stargazers_count}</p>;
}`,
        language: "jsx",
      },
      {
        title: "useDebounce — delay expensive effects",
        description: "Debounce any value so effects only fire after the user stops changing it.",
        code: `import { useState, useEffect } from 'react';

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

function SearchInput() {
  const [query, setQuery]     = useState('');
  const debouncedQuery        = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery) return;
    console.log('Searching for:', debouncedQuery);
    // fire API call here
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search…" />;
}`,
        language: "jsx",
      },
    ],
  },
};
