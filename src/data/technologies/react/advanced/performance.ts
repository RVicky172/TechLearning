import type { TopicNode } from "@/data/types";

export const performance: TopicNode = {
  id: "react-performance",
  title: "Performance Optimization",
  iconName: "Gauge",
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
        description: "Pass stable function references to memoized children.",
        code: `import { useCallback, memo } from 'react';

const Button = memo(({ onClick, label }) => {
  console.log('Button rendered');
  return <button onClick={onClick}>{label}</button>;
});

function Parent({ userId }) {
  // Without useCallback, Button would re-render on every Parent render
  const handleDelete = useCallback((id) => {
    console.log('Deleting:', id);
  }, []);  // This function is created once and reused
  
  const handleEdit = useCallback((id) => {
    console.log('Editing:', id);
  }, [userId]);  // Recreate if userId changes
  
  return (
    <div>
      <Button onClick={() => handleDelete(userId)} label="Delete" />
      <Button onClick={() => handleEdit(userId)} label="Edit" />
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Profiling with React DevTools",
        description: "Use React DevTools Profiler to identify performance bottlenecks.",
        code: `// Steps:
// 1. Install React DevTools browser extension
// 2. Open your app in the browser
// 3. Go to DevTools > Profiler tab
// 4. Click record and interact with your app
// 5. Stop recording and analyze which components re-rendered
// 6. Check the timeline to see which renders took longest

// Look for:
// - Unnecessary re-renders (component rendered but props didn't change)
// - Slow renders (taking > 16ms for 60fps)
// - Components rendering together that could be split

// Then apply targeted optimizations like memo, useMemo, useCallback`,
        language: "javascript",
      },
    ],
  },
};
