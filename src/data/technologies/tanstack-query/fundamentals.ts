import type { TopicNode } from "@/data/types";

export const tanstackFundamentals: TopicNode = {
  id: "tanstack-fundamentals",
  title: "Queries & Caching",
  iconName: "RefreshCw",
  link: "https://tanstack.com/query/latest/docs/framework/react/overview",
  theory:
    "TanStack Query (formerly React Query) is a server-state management library. It handles fetching, caching, synchronising, and updating async data in React applications. Unlike useState + useEffect patterns, TanStack Query manages stale-while-revalidate caching, background refetching, deduplication, and loading/error states automatically.",
  theoryDetail: {
    keyConcepts: [
      "Query: a declarative data subscription — useQuery(key, fetcher) returns { data, isLoading, isError, refetch }",
      "Query Key: a serialisable array that uniquely identifies a query and its dependencies — ['users', userId] means re-fetch when userId changes",
      "Stale time: how long data is considered fresh before a background refetch is triggered — default is 0 (always stale)",
      "Cache time (gcTime): how long unused query data stays in memory before being garbage-collected — default 5 minutes",
      "QueryClient: the shared cache — create once at the app root and provide via QueryClientProvider",
      "Background refetch: TanStack Query refetches stale data on window focus, network reconnect, and component mount — keeps UI fresh automatically",
      "Deduplication: multiple components calling useQuery with the same key share one network request — no waterfall or duplicate fetches",
    ],
    whyItMatters:
      "Most React apps spend 80% of their async state management on fetching, loading states, error handling, and cache invalidation. TanStack Query eliminates this boilerplate with a few hooks, while adding features (background sync, optimistic updates, infinite scroll) that would take weeks to build manually.",
    commonPitfalls: [
      "Using useQuery for mutations — useQuery is for reads (idempotent); use useMutation for writes that have side effects",
      "Object query keys without memoisation — { id: userId } creates a new object reference every render, invalidating the cache; use arrays ['users', userId] instead",
      "Setting staleTime: Infinity everywhere — data never refreshes; users see stale state until they hard-reload",
      "Forgetting to invalidate after mutations — after a POST/PUT/DELETE, call queryClient.invalidateQueries({ queryKey: ['users'] }) to trigger a refetch",
    ],
    examples: [
      {
        title: "QueryClient setup and useQuery with error/loading states",
        description: "Bootstrapping TanStack Query in a React app and fetching typed data.",
        code: `// ── main.tsx / app/layout.tsx ────────────────────────────
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:  60 * 1000,       // data is fresh for 1 minute
      gcTime:     5 * 60 * 1000,   // keep unused data in cache for 5 min
      retry:      2,                // retry failed requests twice
      refetchOnWindowFocus: true,   // refresh when tab is focused
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// ── useQuery — typed data fetching ───────────────────────
interface User { id: number; name: string; email: string; }

async function fetchUser(id: number): Promise<User> {
  const res = await fetch(\`/api/users/\${id}\`);
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json();
}

function UserProfile({ userId }: { userId: number }) {
  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ["users", userId],      // refetch if userId changes
    queryFn: () => fetchUser(userId),
    enabled:  userId > 0,             // skip query if userId is invalid
  });

  if (isLoading) return <Skeleton />;
  if (isError)   return <ErrorMessage message={error.message} />;

  return <div>{user.name} — {user.email}</div>;
}`,
        language: "typescript",
      },
    ],
  },
};
