import type { TopicNode } from "@/data/types";

export const reactInterviewQuestions: TopicNode = {
  id: "react-interview-questions",
  title: "Interview Questions",
  iconName: "HelpCircle",
  theory:
    "This section focuses on high-frequency React interview questions asked in frontend and full-stack roles. Each question is framed with senior-level expectations: clear mental models, trade-offs, and practical implementation details.",
  theoryDetail: {
    keyConcepts: [
      "Interview-ready answers balance correctness, trade-offs, and real-world constraints",
      "Focus on React mental models: rendering, reconciliation, state ownership, and side effects",
      "Good answers include a practical example, a common pitfall, and a mitigation strategy",
    ],
    whyItMatters:
      "Strong interview performance comes from structured reasoning, not memorized definitions. This section trains you to explain React choices under production constraints.",
    commonPitfalls: [
      "Giving definition-only answers without explaining impact on user experience or maintainability",
      "Mixing framework concerns (Next.js specifics) with core React fundamentals in basic questions",
      "Ignoring performance and accessibility implications when describing solutions",
    ],
  },
  children: [
    {
      id: "react-iq-fundamentals",
      title: "Fundamentals Q&A",
      iconName: "BookOpen",
      theory: "Core React concepts that interviewers use to test baseline depth.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Virtual DOM vs real DOM",
            description:
              "A strong answer explains that React keeps an in-memory tree, diffs updates, and batches commits to the real DOM for predictable performance.",
            code: `// Interview-style response skeleton
// 1) What: Virtual DOM is a lightweight JS representation of the UI.
// 2) How: On state change, React creates a new tree and diffs against previous.
// 3) Why: It minimizes direct DOM writes and enables predictable updates.
// 4) Caveat: Performance still depends on component design and key stability.`,
            language: "javascript",
          },
          {
            title: "Q: Why are keys needed in lists?",
            description:
              "Mention identity across renders, state preservation, and why unstable keys (index/random) cause bugs.",
            code: `function List({ items }) {
  return items.map(item => (
    // Stable identity per item across renders
    <Row key={item.id} item={item} />
  ));
}

// Bad: key={index} in reorderable/filterable lists
// Bad: key={Math.random()} (forces remount every render)`,
            language: "jsx",
          },
        ],
      },
    },
    {
      id: "react-iq-hooks-state",
      title: "Hooks & State Q&A",
      iconName: "Hook",
      theory: "Questions around useState, useEffect, useMemo, useCallback, and state architecture.",
      theoryDetail: {
        examples: [
          {
            title: "Q: useMemo vs useCallback",
            description:
              "Explain that useMemo caches computed values; useCallback caches function references. Both are optimization tools, not default choices.",
            code: `const visibleRows = useMemo(() => filterRows(rows, query), [rows, query]);
const handleSave = useCallback((id) => saveRow(id), [saveRow]);

// useMemo -> value
// useCallback -> function reference`,
            language: "jsx",
          },
          {
            title: "Q: How to avoid stale closures in effects",
            description:
              "Interviewers expect awareness of dependency arrays, functional updates, and separating event logic from effect logic.",
            code: `useEffect(() => {
  const id = setInterval(() => {
    // Functional update avoids stale count capture
    setCount(c => c + 1);
  }, 1000);

  return () => clearInterval(id);
}, []);`,
            language: "jsx",
          },
        ],
      },
    },
    {
      id: "react-iq-performance",
      title: "Performance Q&A",
      iconName: "Gauge",
      theory: "Performance questions test your ability to profile first, then optimize surgically.",
      theoryDetail: {
        examples: [
          {
            title: "Q: How would you optimize a slow React list?",
            description:
              "Expected path: profile -> identify expensive rows -> memoize rows -> stabilize props -> add virtualization for large lists.",
            code: `const Row = memo(function Row({ item, onSelect }) {
  return <button onClick={() => onSelect(item.id)}>{item.name}</button>;
});

function HugeList({ items }) {
  const onSelect = useCallback((id) => {
    console.log('select', id);
  }, []);

  return items.map(item => <Row key={item.id} item={item} onSelect={onSelect} />);
}`,
            language: "jsx",
          },
          {
            title: "Q: When should you avoid memoization?",
            description:
              "Great answer: avoid premature optimization for cheap components/computations; memoization adds complexity and memory overhead.",
            code: `// Do not memoize by default.
// Use React DevTools Profiler first.
// Apply memo/useMemo/useCallback only where measurable bottlenecks exist.`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "react-iq-architecture",
      title: "Architecture Q&A",
      iconName: "Blocks",
      theory: "Senior interviews often include architectural trade-offs around boundaries, state ownership, and rendering strategy.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Context vs Redux vs React Query",
            description:
              "Strong answer separates concerns: Context for shared config/auth, Redux/Zustand for complex client state, React Query for server state.",
            code: `// Rule of thumb
// Context: theme/auth/locale
// Zustand/Redux: client domain state with complex workflows
// React Query: server state (fetch/cache/retry/invalidation)

// Avoid using one tool for every state problem.`,
            language: "javascript",
          },
          {
            title: "Q: Server Components vs Client Components",
            description:
              "Explain that server components reduce client JS and fetch securely, while client components are for interactivity/hooks/browser APIs.",
            code: `// Server component (default in Next.js app router)
export default async function Page() {
  const data = await fetchData();
  return <ClientWidget initialData={data} />;
}

// Client component
'use client';
function ClientWidget({ initialData }) {
  const [state, setState] = useState(initialData);
  return <button onClick={() => setState([])}>Clear</button>;
}`,
            language: "tsx",
          },
        ],
      },
    },
  ],
};
