import type { TopicNode } from "@/data/types";

export const reactPerformanceOptimization: TopicNode = {
  id: "react-performance-optimization",
  title: "React Performance & Optimization",
  iconName: "Gauge",
  theory:
    "Performance work in React starts with measurement, not guesswork. Profile slow interactions, identify expensive renders, and then apply targeted optimizations like memoization, state colocation, list virtualization, concurrency APIs, and network-level improvements.",
  theoryDetail: {
    keyConcepts: [
      "Profile first with React DevTools Profiler to find real bottlenecks before optimizing",
      "Reduce unnecessary renders by colocating state and keeping component boundaries focused",
      "Use React.memo, useMemo, and useCallback surgically when props or expensive computations are stable",
      "Virtualize large lists and tables so the UI renders only visible rows",
      "Use useTransition/useDeferredValue to keep urgent updates responsive during expensive work",
      "Optimize fetch patterns with caching, pagination, and partial rendering",
    ],
    whyItMatters:
      "Most React performance issues come from unnecessary rendering and over-fetching. A repeatable optimization workflow keeps apps fast at scale and avoids premature complexity.",
    commonPitfalls: [
      "Applying memoization everywhere without measuring impact",
      "Passing new object/array/function props each render and invalidating memoized children",
      "Storing too much state high in the tree, which causes broad re-renders",
      "Rendering huge lists without virtualization",
      "Confusing perceived performance with raw render speed and ignoring loading states",
    ],
    examples: [
      {
        title: "Profile -> Optimize -> Verify",
        description:
          "Treat optimization as a loop: measure, change one thing, and measure again.",
        code: `// 1) Record interaction in React DevTools Profiler\n// 2) Find components with high self/total render time\n// 3) Apply one focused optimization\n// 4) Re-profile and compare\n\n// Example focus areas:\n// - Stabilize props for memoized children\n// - Move local UI state closer to where it is used\n// - Virtualize long lists\n// - Use transition APIs for non-urgent updates`,
        language: "javascript",
      },
      {
        title: "State Colocation to Shrink Render Surface",
        description:
          "Move transient state down so unrelated siblings do not re-render.",
        code: `function Page() {\n  return (\n    <>\n      <Header />\n      <SearchPanel />\n      <Results />\n    </>\n  );\n}\n\nfunction SearchPanel() {\n  const [query, setQuery] = useState('');\n  // query state lives here, so Header and Results don't re-render on every keystroke\n  return <input value={query} onChange={e => setQuery(e.target.value)} />;\n}`,
        language: "jsx",
      },
    ],
  },
  children: [
    {
      id: "react-performance-playbook",
      title: "Optimization Playbook",
      iconName: "ListChecks",
      theory:
        "A practical sequence for real projects: baseline metrics, identify hot paths, optimize one bottleneck at a time, and track regressions in CI.",
      link: "https://react.dev/reference/react/Profiler",
    },
    {
      id: "react-performance-rendering",
      title: "Rendering and Memoization",
      iconName: "Layers",
      theory:
        "Understand render triggers, stabilize props, and use memoization only where render cost is measurable.",
      link: "https://react.dev/reference/react/memo",
    },
    {
      id: "react-performance-lists",
      title: "Lists, Virtualization, and Windowing",
      iconName: "Rows3",
      theory:
        "For large datasets, render only what is visible and keep row components lightweight.",
      link: "https://web.dev/articles/virtualize-long-lists-react-window",
    },
    {
      id: "react-performance-concurrency",
      title: "Concurrency and Perceived Performance",
      iconName: "Timer",
      theory:
        "Use transitions and deferred values to prioritize input responsiveness while expensive updates happen in the background.",
      link: "https://react.dev/reference/react/useTransition",
    },
  ],
};
