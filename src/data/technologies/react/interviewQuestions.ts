import type { TopicNode } from "@/data/types";

export const reactInterviewQuestions: TopicNode = {
  id: "react-interview-questions",
  title: "Interview Questions",
  iconName: "HelpCircle",
  theory:
    "This section contains 60 high-frequency React interview questions across fundamentals, hooks, rendering, performance, architecture, and scenario-based design. Answers are written with real-world trade-offs and production-oriented reasoning.",
  theoryDetail: {
    keyConcepts: [
      "60 interview questions are grouped by theme so you can practice systematically and track weak areas",
      "Strong answers explain what, why, and when to use a pattern, not just definitions",
      "Interview readiness comes from trade-offs: performance vs readability, abstraction vs simplicity, and local vs global state",
    ],
    whyItMatters:
      "React interviews evaluate reasoning quality more than memorization. Practicing structured answers around trade-offs, edge cases, and implementation details improves both interview performance and day-to-day engineering decisions.",
    commonPitfalls: [
      "Answering with one-liners and skipping trade-offs",
      "Using advanced APIs in answers when simpler patterns are enough",
      "Ignoring accessibility, error handling, and testing implications",
    ],
  },
  children: [
    {
      id: "react-iq-easy",
      title: "Easy",
      iconName: "CircleCheck",
      theory:
        "Foundational React interview questions covering JSX, state basics, rendering model, and hooks fundamentals.",
      children: [
    {
      id: "react-iq-fundamentals",
      title: "Fundamentals Q&A",
      iconName: "BookOpen",
      theory: "Core conceptual questions used to validate React foundations.",
      theoryDetail: {
        keyConcepts: [
          "Q1. What is React and why is it called declarative? A: You describe desired UI for a state, and React handles DOM updates.",
          "Q2. What is JSX? A: A syntax extension compiled into React element calls; it is not HTML.",
          "Q3. How is React different from Angular/Vue? A: React is primarily a UI library with a composable ecosystem.",
          "Q4. What is the virtual DOM? A: An in-memory representation React diffs before committing real DOM changes.",
          "Q5. What is reconciliation? A: React's algorithm that compares previous and next trees to compute minimal updates.",
          "Q6. Why are keys needed in lists? A: They preserve item identity across renders and avoid state mismatches.",
          "Q7. Why is one-way data flow useful? A: It makes ownership and updates predictable, simplifying debugging.",
          "Q8. What are controlled components? A: Inputs driven by React state with change handlers.",
          "Q9. Controlled vs uncontrolled inputs? A: Controlled gives validation control; uncontrolled can reduce rerenders.",
          "Q10. Why avoid mutating state directly? A: Mutation breaks change detection assumptions and causes stale UI bugs.",
        ],
        examples: [
          {
            title: "Q: Virtual DOM vs Real DOM",
            description:
              "A high-quality answer explains representation, diffing, and commit phases with caveats on poor component design.",
            code: `// Interview answer framework
// 1) Virtual DOM: lightweight in-memory UI representation.
// 2) Re-render: creates a new tree from current state/props.
// 3) Reconciliation: computes minimal set of changes.
// 4) Commit: applies updates to real DOM.
// 5) Caveat: expensive render logic can still hurt performance.`,
            language: "javascript",
          },
          {
            title: "Q: Why Keys Matter In Dynamic Lists",
            description:
              "Explain identity, reordering safety, and why index/random keys cause remounts and state drift.",
            code: `function List({ items }) {
  return items.map(item => (
    // Stable identity preserves component state correctly
    <Row key={item.id} item={item} />
  ));
}

// Avoid index key when items can reorder
// Never use random keys`,
            language: "jsx",
          },
        ],
      },
    },
    {
      id: "react-iq-hooks-state",
      title: "Hooks & State Q&A",
      iconName: "Hook",
      theory: "Questions around state ownership, hooks rules, effects, and modern React 19 hooks.",
      theoryDetail: {
        keyConcepts: [
          "Q11. What are the Rules of Hooks? A: Call hooks at top level in components or custom hooks only.",
          "Q12. useState vs useReducer? A: useState for simple local updates; useReducer for complex transition logic.",
          "Q13. What is stale closure in React? A: Function captures older values due to render snapshot semantics.",
          "Q14. How do you fix stale closure issues? A: Correct dependencies, functional updates, refs, or effect events.",
          "Q15. What is useEffect for? A: Synchronizing with external systems, not deriving render-only values.",
          "Q16. When should useLayoutEffect be used? A: DOM measurement/mutation before paint to avoid visual flicker.",
          "Q17. useMemo vs useCallback? A: useMemo caches values; useCallback caches function references.",
          "Q18. What problem does useRef solve? A: Persist mutable values and access DOM nodes without rerender.",
          "Q19. What is a custom hook? A: Reusable stateful logic packaged in a function starting with use.",
          "Q20. How does useActionState help forms? A: It models submit pending/result/error with server or async actions.",
        ],
        examples: [
          {
            title: "Q: useMemo vs useCallback",
            description:
              "Clarify value caching vs function reference caching and mention both are optional optimizations.",
            code: `const visibleRows = useMemo(() => filterRows(rows, query), [rows, query]);
const handleSave = useCallback((id) => saveRow(id), [saveRow]);

// useMemo => memoized value
// useCallback => memoized function reference`,
            language: "jsx",
          },
          {
            title: "Q: Avoiding Stale Closures In Effects",
            description:
              "Show functional updates and cleanup to prove understanding of closure-safe effect patterns.",
            code: `useEffect(() => {
  const id = setInterval(() => {
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
      id: "react-iq-rendering-lifecycle",
      title: "Rendering & Lifecycle Q&A",
      iconName: "RefreshCw",
      theory: "Questions focused on render triggers, Strict Mode behavior, and lifecycle reasoning.",
      theoryDetail: {
        keyConcepts: [
          "Q21. What causes a component to rerender? A: Local state, parent rerender, context changes, or hook/store updates.",
          "Q22. Does rerender always mean DOM update? A: No, React may bail out during reconciliation.",
          "Q23. What does React Strict Mode do in dev? A: Intentionally double-invokes some logic to surface side effects.",
          "Q24. Why are effects run after paint by default? A: To keep UI responsive unless layout synchronization is required.",
          "Q25. How do cleanup functions work in useEffect? A: Run before next effect and on unmount.",
          "Q26. Why can index keys break state? A: Reordering reassigns identity and mixes child state.",
          "Q27. What is hydration? A: Attaching React behavior to server-rendered HTML.",
          "Q28. Hydration mismatch causes? A: Non-deterministic renders like Date.now or random values on first paint.",
          "Q29. Class lifecycle mapping to hooks? A: componentDidMount/Update/Unmount are modeled with effects plus dependencies.",
          "Q30. Should derived render data be in state? A: Usually no, compute from source state unless expensive.",
        ],
        examples: [
          {
            title: "Q: Why Strict Mode Seems To Render Twice",
            description:
              "This answer should separate dev-only checks from production behavior.",
            code: `// Development-only behavior in Strict Mode:
// - Render functions may run twice
// - Effects mount -> cleanup -> mount
// Goal: reveal non-idempotent side effects

// Production build does not double invoke for this check.
// Fix root issue: make side effects idempotent and cleanup correctly.`,
            language: "javascript",
          },
          {
            title: "Q: Hydration Mismatch Example",
            description:
              "Show deterministic rendering and delaying browser-only logic until after mount.",
            code: `function Clock() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid server/client mismatch for time-dependent output
  if (!mounted) return <span>Loading...</span>;

  return <span>{new Date().toLocaleTimeString()}</span>;
}`,
            language: "tsx",
          },
        ],
      },
    },
      ],
    },
    {
      id: "react-iq-medium",
      title: "Medium",
      iconName: "CircleDot",
      theory:
        "Mid-level React interview questions focused on optimization judgment and architecture trade-offs.",
      children: [
    {
      id: "react-iq-performance",
      title: "Performance Q&A",
      iconName: "Gauge",
      theory: "Performance questions test profiling mindset, memoization judgment, and list scalability.",
      theoryDetail: {
        keyConcepts: [
          "Q31. First step in performance tuning? A: Measure with React DevTools Profiler before changing code.",
          "Q32. When does React.memo help? A: When prop-stable components rerender frequently and render cost is non-trivial.",
          "Q33. Why can useCallback hurt performance? A: It adds dependency management overhead when no memoized consumer exists.",
          "Q34. How to optimize large lists? A: Virtualization, row memoization, stable keys, and avoiding inline heavy work.",
          "Q35. What is windowing? A: Rendering only visible rows plus overscan, not the entire dataset.",
          "Q36. useTransition use case? A: Keep urgent input responsive while deferring expensive update.",
          "Q37. useDeferredValue use case? A: Render stale value while expensive recalculation catches up.",
          "Q38. React Compiler impact? A: Automatic memoization in many paths, reducing manual memo boilerplate.",
          "Q39. How to optimize context performance? A: Split contexts, memoize values, and reduce broad consumers.",
          "Q40. What are common perf anti-patterns? A: Premature memoization, unstable object props, and heavy work during render.",
        ],
        examples: [
          {
            title: "Q: Optimizing A Slow Search Results List",
            description:
              "Expected sequence: profile, identify heavy rows, stabilize props, memoize row, then virtualize.",
            code: `const Row = memo(function Row({ item, onOpen }) {
  return <button onClick={() => onOpen(item.id)}>{item.name}</button>;
});

function Results({ items }) {
  const onOpen = useCallback((id) => {
    console.log("open", id);
  }, []);

  return items.map(item => <Row key={item.id} item={item} onOpen={onOpen} />);
}`,
            language: "jsx",
          },
          {
            title: "Q: Transitioning Non-Urgent Updates",
            description:
              "This demonstrates urgent input state vs deferred heavy filtering state.",
            code: `const [query, setQuery] = useState("");
const [isPending, startTransition] = useTransition();

function onChange(next) {
  setQuery(next); // urgent
  startTransition(() => {
    setFiltered(expensiveFilter(items, next)); // non-urgent
  });
}`,
            language: "tsx",
          },
        ],
      },
    },
    {
      id: "react-iq-architecture",
      title: "Architecture Q&A",
      iconName: "Blocks",
      theory: "Senior-level architecture questions around boundaries, state choices, and data ownership.",
      theoryDetail: {
        keyConcepts: [
          "Q41. How do you decide local state vs context vs store? A: Choose the smallest shared scope that meets requirements.",
          "Q42. Context vs Redux/Zustand? A: Context for distribution, store for complex update workflows and tooling.",
          "Q43. Server state vs client state? A: Server state is fetched/cached/invalidation-driven; client state is local UI interaction state.",
          "Q44. How should large React apps be organized? A: Feature-first folders with collocated UI, hooks, and tests.",
          "Q45. What is prop drilling and when is it okay? A: Passing props through layers; acceptable for shallow, explicit paths.",
          "Q46. What are container/presentational patterns today? A: Less rigid, but separation of data orchestration and UI still helps.",
          "Q47. Why use Error Boundaries at route/widget level? A: To contain crashes and preserve the rest of the app.",
          "Q48. How do you approach code splitting? A: Split by routes and heavy islands, not tiny low-value components.",
          "Q49. What is a good React testing strategy? A: Mostly integration tests, selective unit tests, minimal brittle implementation checks.",
          "Q50. How do you handle auth state in React apps? A: Provider/store for session state plus secure backend token handling.",
        ],
        examples: [
          {
            title: "Q: Context vs Store vs Query Libraries",
            description:
              "Use this answer to separate shared config, client domain state, and async server cache concerns.",
            code: `// Choose by problem category:
// Context => theme/auth/locale distribution
// Store => complex client workflows and derived state
// Query lib => server cache, retries, invalidation

// Avoid using one tool for every state problem.`,
            language: "javascript",
          },
          {
            title: "Q: Error Boundary Placement Strategy",
            description:
              "Demonstrates containing failures at route and widget boundaries for graceful degradation.",
            code: `// Place boundaries at:
// 1) App shell (last resort fallback)
// 2) Route segment (page-level safety)
// 3) Risky widgets (charts, rich editors)

// Goal: one crashing widget should not blank the entire page.`,
            language: "javascript",
          },
        ],
      },
    },
      ],
    },
    {
      id: "react-iq-hard",
      title: "Hard / Advanced",
      iconName: "Flame",
      theory:
        "Senior-level scenario and system-design interview questions for production React systems.",
      children: [
    {
      id: "react-iq-system-design",
      title: "System Design & Scenario Q&A",
      iconName: "Network",
      theory: "Scenario-driven questions where interviewers evaluate design decisions, not just API recall.",
      theoryDetail: {
        keyConcepts: [
          "Q51. Design a search UI that stays responsive with 30k rows. A: Split urgent input from deferred filtering and virtualize results.",
          "Q52. How would you prevent request race conditions? A: Abort previous fetches or rely on query-keyed cache tools.",
          "Q53. How do you structure a 50-field form? A: Prefer form library + schema validation + focused subscriptions.",
          "Q54. How would you build optimistic updates safely? A: Apply optimistic patch, rollback on failure, reconcile with server response.",
          "Q55. Design offline-friendly React data flow. A: Cache reads, queue writes, sync/retry with conflict strategy.",
          "Q56. How do you avoid state explosion in dashboards? A: Partition global, feature, and URL state with clear ownership.",
          "Q57. How do you secure React output against XSS? A: Escape by default, sanitize HTML, avoid unsafe injection.",
          "Q58. How do you monitor performance regressions? A: Profiler baselines, web vitals, and CI performance budgets.",
          "Q59. How do you ship large React apps incrementally? A: Route-based code splitting and progressive feature rollout.",
          "Q60. How do you migrate a legacy class app to hooks? A: Strangler pattern, feature-by-feature conversion with parity tests.",
        ],
        examples: [
          {
            title: "Q: Handle Race Conditions In Search",
            description:
              "Shows an abort-first approach to prevent stale responses from overwriting fresher results.",
            code: `function useAbortableSearch() {
  const controllerRef = useRef(null);

  const search = useCallback(async (query) => {
    controllerRef.current?.abort();
    controllerRef.current = new AbortController();

    const response = await fetch(\`/api/search?q=\${query}\`, {
      signal: controllerRef.current.signal,
    });

    return response.json();
  }, []);

  return { search };
}`,
            language: "tsx",
          },
          {
            title: "Q: Optimistic Update With Rollback",
            description:
              "Shows optimistic patching with rollback when API request fails.",
            code: `const [todos, setTodos] = useState(initialTodos);

async function addTodoOptimistic(text) {
  const temp = { id: "temp-1", text };
  setTodos(prev => [temp, ...prev]);

  try {
    const saved = await api.createTodo({ text });
    setTodos(prev => prev.map(t => (t.id === temp.id ? saved : t)));
  } catch {
    setTodos(prev => prev.filter(t => t.id !== temp.id));
  }
}`,
            language: "tsx",
          },
        ],
      },
    },
      ],
    },
  ],
};
