import type { TopicNode } from "@/data/types";

export const performance: TopicNode = {
  id: "react-performance",
  title: "Performance Optimization",
  iconName: "Gauge",
  demoComponentKey: "reactPerformance",
  link: "https://react.dev/learn/render-and-commit",
  theory:
    "React re-renders when state changes, but not all re-renders are necessary. The memoization tools — useMemo, useCallback, and React.memo — let you skip rendering components that haven't changed. However, premature optimization adds complexity, so always profile before optimizing.",
  theoryDetail: {
    keyConcepts: [
      "React.memo wraps a component to skip re-renders when props haven't changed (shallow comparison)",
      "useMemo(fn, [deps]) caches an expensive computed value between renders",
      "useCallback(fn, [deps]) returns a stable function reference across renders, preventing child re-renders",
      "The dependency array determines when the memoized value or function is recalculated",
    ],
    whyItMatters:
      "At scale, unnecessary renders compound. A well-optimized component tree keeps interactions instant even with deeply nested state changes. Profiling and strategic memoization are the key tools.",
    commonPitfalls: [
      "Memoizing everything preemptively — profile with React DevTools Profiler first to identify real bottlenecks",
      "Passing new object/array literals as props defeating React.memo's comparison — memoize props with useMemo",
      "Omitting dependencies from useCallback causing the memoized function to close over stale values",
      "Memoizing very cheap computations — the memoization overhead becomes more expensive than the computation",
    ],
    examples: [
      {
        title: "React.memo for Preventing Re-renders",
        description: "Skip re-renders of child components when props haven't changed.",
        code: `import { memo, useState } from 'react';

// Memoized component — only re-renders if props change
const ExpensiveChild = memo(function Child({ count, name }) {
  console.log('Child rendered');
  return <p>{name}: {count}</p>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);
  
  // Without memo, Child would re-render even though its props didn't change
  return (
    <div>
      <ExpensiveChild count={count} name="Counter" />
      <button onClick={() => setOther(o => o + 1)}>
        Update other state ({other})
      </button>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "useMemo for Expensive Computations",
        description: "Cache expensive calculations between renders.",
        code: `import { useMemo } from 'react';

function DataAnalyzer({ data }) {
  // This computation only runs if data changes
  const statistics = useMemo(() => {
    console.log('Computing stats...');
    return {
      sum: data.reduce((a, b) => a + b, 0),
      avg: data.reduce((a, b) => a + b, 0) / data.length,
      max: Math.max(...data),
    };
  }, [data]);  // Dependency: recompute when data changes
  
  return (
    <div>
      <p>Average: {statistics.avg}</p>
      <p>Max: {statistics.max}</p>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "useCallback for Stable Function References",
        description: "Pass stable function references to memoized children. Avoid creating new inline arrows in JSX — they defeat the memoization.",
        code: `import { useCallback, memo, useState } from 'react';

type RowProps = { item: { id: number; name: string }; onDelete: (id: number) => void };

const TableRow = memo(function TableRow({ item, onDelete }: RowProps) {
  console.log('TableRow rendered:', item.id);
  return (
    <tr>
      <td>{item.name}</td>
      <td>
        {/* ✅ onDelete is stable, so clicking Delete won't cause all rows to re-render */}
        <button onClick={() => onDelete(item.id)}>Delete</button>
      </td>
    </tr>
  );
});

function DataTable({ items }) {
  const [selected, setSelected] = useState<number | null>(null);

  // ✅ Stable reference — created once, not on every render
  const handleDelete = useCallback((id: number) => {
    console.log('Delete', id);
  }, []); // empty deps: no external values captured

  // ❌ Anti-pattern: passing a new arrow function defeats memo
  // const handleDelete = (id) => deleteItem(id); // recreated every render

  return (
    <table>
      <tbody>
        {items.map(item => (
          <TableRow key={item.id} item={item} onDelete={handleDelete} />
        ))}
      </tbody>
    </table>
  );
}`,
        language: "tsx",
      },
      {
        title: "Profiling with the React Profiler API",
        description: "Wrap a subtree with <Profiler> to measure render time programmatically and log slow renders.",
        code: `import { Profiler } from 'react';

function onRenderCallback(
  id: string,            // the Profiler id prop
  phase: 'mount' | 'update' | 'nested-update',
  actualDuration: number // time spent rendering
) {
  // Log to your observability backend or console
  if (actualDuration > 16) {
    // Anything above 16ms risks dropping a frame at 60 fps
    console.warn(\`[Profiler] \${id} took \${actualDuration.toFixed(1)}ms (\${phase})\`);
  }
}

function App() {
  return (
    <Profiler id="ProductList" onRender={onRenderCallback}>
      <ProductList />
    </Profiler>
  );
}

// Browser DevTools workflow:
// 1. Install React DevTools extension
// 2. Open DevTools > Profiler tab
// 3. Click record, interact with the app, stop recording
// 4. Inspect the flame graph: grey = not rendered, colours = render cost
// 5. Sort by "Self time" to find the most expensive components
// 6. Look for components rendering when props/state didn't change (memo candidates)`,
        language: "tsx",
      },
    ],
  },
};
