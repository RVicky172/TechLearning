import type { TopicNode } from "@/data/types";

export const hookUseMemoCallback: TopicNode = {
  id: "hook-usememo-usecallback",
  title: "useMemo & useCallback",
  iconName: "Cpu",
  link: "https://react.dev/reference/react/useMemo",
  theory:
    "useMemo caches the result of an expensive computation between renders. useCallback caches a function reference between renders. Both accept a dependency array — the cached value is reused as long as none of the dependencies change. They exist to prevent unnecessary work and preserve referential equality.",
  theoryDetail: {
    keyConcepts: [
      "useMemo(() => compute(a, b), [a, b]) — recalculates only when a or b change",
      "useCallback(fn, [deps]) is syntactic sugar for useMemo(() => fn, [deps]) — returns a stable function reference",
      "Referential equality matters for React.memo — if a prop is a new function/object each render, memoisation is bypassed",
      "Both have a cost (memory + comparison) — only apply after measuring a real performance problem",
    ],
    whyItMatters:
      "Without memoisation, every re-render creates new object/function references, defeating React.memo and causing all children to re-render regardless of whether their props changed. useCallback and useMemo let you opt specific values out of the re-render cascade.",
    commonPitfalls: [
      "Memoising everything by default — the overhead of useMemo/useCallback is often larger than the computation it avoids",
      "Missing a dependency in the array — the cached value goes stale silently; use the eslint-plugin-react-hooks lint rule",
      "Using useMemo for side effects — it's for computed values only; use useEffect for side effects",
      "Expecting useMemo to always skip the computation — React may choose to discard the cache under memory pressure",
    ],
    examples: [
      {
        title: "useMemo — expensive filter",
        description: "Re-filter a large list only when the list or search term changes.",
        code: `import { useState, useMemo } from 'react';

function ProductList({ products }) {
  const [search, setSearch] = useState('');

  // ✅ Only re-runs when products or search changes
  const filtered = useMemo(
    () => products.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    ),
    [products, search]
  );

  return (
    <>
      <input value={search}
             onChange={e => setSearch(e.target.value)}
             placeholder="Search products" />
      <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </>
  );
}`,
        language: "jsx",
      },
      {
        title: "useCallback — stable handler for memoised child",
        description: "Prevent a child wrapped in React.memo from re-rendering when the parent re-renders.",
        code: `import { useState, useCallback, memo } from 'react';

// Child only re-renders when its own props change
const ExpensiveList = memo(function ExpensiveList({ items, onDelete }) {
  console.log('ExpensiveList rendered');
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => onDelete(item.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
});

function Parent() {
  const [items, setItems] = useState([
    { id: 1, name: 'Alpha' },
    { id: 2, name: 'Beta' },
  ]);
  const [other, setOther] = useState(0);

  // ✅ Same function reference between renders — won't bust React.memo
  const handleDelete = useCallback((id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);   // no deps — setItems from useState is always stable

  return (
    <>
      <button onClick={() => setOther(n => n + 1)}>Unrelated update ({other})</button>
      <ExpensiveList items={items} onDelete={handleDelete} />
    </>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
