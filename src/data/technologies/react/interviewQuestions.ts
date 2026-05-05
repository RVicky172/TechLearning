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
    {
      id: "react-iq-system-design",
      title: "System Design & Scenarios",
      iconName: "Network",
      theory: "Advanced interviews include real-world scenarios: designing a form system, state architecture for a large app, handling async data, and performance under constraints.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Design a Form Management System (Controlled vs Uncontrolled)",
            description:
              "Discuss tradeoffs: controlled inputs (React state) vs uncontrolled (DOM refs). For forms, explain why libraries like React Hook Form use uncontrolled by default (reduce renders), but controlled when validation/cross-field deps needed.",
            code: `// Scenario: Large form with 50 fields, complex validation
// Controlled approach: every keystroke updates state → 50 renders per keystroke
// Uncontrolled approach: refs + manual validation → fewer rerenders

// Best practice: Hybrid
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

function SignupForm() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });
  
  // Only watched fields trigger rerenders
  const password = watch('password');
  
  const onSubmit = (data) => console.log(data);
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}
      
      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <p>{errors.password.message}</p>}
      
      <input {...register('confirmPassword')} type="password" placeholder="Confirm" />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      
      <button type="submit">Sign Up</button>
    </form>
  );
}

// Key insights:
// 1) Only watch fields you need for dynamic UI
// 2) Validation rules centralized in schema
// 3) Errors accessed without extra state
// 4) Library handles re-render optimization`,
            language: "tsx",
          },
          {
            title: "Q: Design State Architecture for a Large Dashboard App",
            description:
              "Discuss: app-level state (auth, user prefs), feature-level state (open panels, filters), and server state (data). Explain tool selection and boundaries.",
            code: `// Architecture layers for large app

// 1. Global app state (auth, user, settings)
// → Zustand or Context (small, accessed often)
const useAppStore = create((set) => ({
  user: null,
  theme: 'light',
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme }),
}));

// 2. Feature state (dashboard filters, panels)
// → Local state + URL params (searchParams for "shareability")
function Dashboard() {
  const [filters, setFilters] = useSearchParams();
  const selectedPanel = filters.get('panel') || 'overview';
  
  return (
    <div>
      <Sidebar 
        active={selectedPanel} 
        onChange={(p) => setFilters({ panel: p })} 
      />
      {selectedPanel === 'overview' && <OverviewPanel />}
      {selectedPanel === 'analytics' && <AnalyticsPanel />}
    </div>
  );
}

// 3. Server state (user data, reports)
// → React Query (cache + invalidation + retry)
function UserReport() {
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['report', userId],
    queryFn: () => fetch(\`/api/report/\${userId}\`).then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 min
    retry: 2,
  });
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  return <ReportView data={report} />;
}

// Benefits:
// - Each tool has clear responsibility
// - Easy to test (zustand + react query are tested in isolation)
// - Scalable (new features don't add to central store)`,
            language: "tsx",
          },
          {
            title: "Q: Handle Race Conditions in Data Fetching",
            description:
              "Common problem: user types a search, multiple fetch requests fire, older response arrives after newer one, shows stale data. Solutions: AbortController, React Query key versioning, or state timestamp.",
            code: `// Problem scenario:
// User types 'a' → fetch A fires
// User types 'ab' → fetch B fires
// Fetch B completes first
// Fetch A completes after → state reverts to stale A data

// Solution 1: AbortController (vanilla approach)
function useAbortableFetch() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const abortRef = useRef<AbortController | null>(null);
  
  const fetch = useCallback((url) => {
    // Cancel previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    
    return window
      .fetch(url, { signal: abortRef.current.signal })
      .then(r => r.json())
      .then(data => setData(data))
      .catch(err => {
        // Don't update state if aborted
        if (err.name !== 'AbortError') setError(err);
      });
  }, []);
  
  return { data, error, fetch };
}

// Solution 2: React Query (handles automatically via queryKey)
function SearchUsers({ query }) {
  const { data: users } = useQuery({
    queryKey: ['users', query], // Key includes query
    queryFn: () => fetch(\`/api/users?q=\${query}\`).then(r => r.json()),
    enabled: query.length > 0,
  });
  // Old query results are cached separately, never overwrite each other
  return users?.map(u => <UserRow key={u.id} user={u} />);
}

// Solution 3: Timestamp check (detect stale updates)
const [data, setData] = useState(null);
const [requestTime, setRequestTime] = useState(0);

const handleSearch = async (q) => {
  const now = Date.now();
  setRequestTime(now);
  
  const result = await fetch(\`/api/search?q=\${q}\`);
  
  // Ignore if newer request started
  if (now < requestTime) return;
  
  setData(result);
};

// Best practice: Use React Query for server state, avoids these issues entirely`,
            language: "tsx",
          },
          {
            title: "Q: Optimize a List with 10,000 Items (Virtualization)",
            description:
              "Rendering 10k items causes jank. Solution: virtualization libraries (react-window, react-virtualized) render only visible items in viewport.",
            code: `// Naive approach (slow)
function HugeList({ items }) {
  return (
    <ul>
      {items.map(item => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

// Optimized approach: Virtualization with react-window
import { FixedSizeList } from 'react-window';

function OptimizedList({ items }) {
  const Row = ({ index, style }) => (
    <li style={style} key={items[index].id}>
      {items[index].name}
    </li>
  );
  
  return (
    <FixedSizeList
      height={600}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// Key insights:
// - Renders only ~20 items in viewport (not 10k)
// - Huge perf gain with negligible UX difference
// - Need fixed item height for FixedSizeList
// - Use VariableSizeList for dynamic heights (more complex)`,
            language: "tsx",
          },
          {
            title: "Q: Handle Async Loading States (Pending, Success, Error)",
            description:
              "Discuss state machine patterns for robust async handling. Avoid boolean flags (loading/error both true?) — use explicit state union types.",
            code: `// ❌ Problematic: Multiple booleans can be inconsistent
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [data, setData] = useState(null);

// What if loading && error are both true? Confusing.

// ✅ Better: State machine with union types
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

function useAsync<T>(
  fn: () => Promise<T>,
  deps: unknown[]
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'idle' });
  
  useEffect(() => {
    setState({ status: 'pending' });
    fn()
      .then(data => setState({ status: 'success', data }))
      .catch(error => setState({ status: 'error', error }));
  }, deps);
  
  return state;
}

// Usage
function UserProfile({ userId }) {
  const state = useAsync(() => fetch(\`/api/user/\${userId}\`).then(r => r.json()), [userId]);
  
  switch (state.status) {
    case 'idle': return null;
    case 'pending': return <LoadingSpinner />;
    case 'success': return <Profile user={state.data} />;
    case 'error': return <ErrorBoundary error={state.error} />;
  }
}

// Benefits:
// - Compiler enforces all states handled
// - No impossible state combinations
// - Clear, predictable flow`,
            language: "tsx",
          },
        ],
      },
    },
  ],
};
