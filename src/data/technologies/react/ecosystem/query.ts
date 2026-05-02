import type { TopicNode } from "@/data/types";

export const query: TopicNode = {
  id: "react-query",
  title: "Data Fetching & Caching",
  iconName: "Database",
  link: "https://tanstack.com/query/latest",
  theory:
    "TanStack Query handles server state management — fetching, caching, background refetching, and synchronization. It's essential for modern React apps that interact with APIs, eliminating boilerplate around loading states, errors, and cache invalidation.",
  theoryDetail: {
    keyConcepts: [
      "useQuery({ queryKey, queryFn }) fetches data, caches it, and auto-refetches when data becomes stale",
      "Query keys are the cache identity — use arrays for parameterized queries: ['user', userId] or ['posts', { limit: 10 }]",
      "useMutation handles POST/PUT/DELETE operations and lets you invalidate related queries on success",
      "Queries automatically deduplicate — multiple components requesting the same data only make one fetch",
    ],
    whyItMatters:
      "Server state is different from UI state — it's remote, can change on the server, may become stale, and requires synchronization. TanStack Query manages this complexity with minimal code, supporting loading states, errors, stale states, and refetching automatically.",
    commonPitfalls: [
      "Using the same queryKey for different data — keys must uniquely identify the data for proper caching",
      "Not setting staleTime causing over-fetching on every component mount — without it data is immediately stale and refetched on each mount",
      "Invalidating too broadly after mutations causing unrelated queries to refetch unnecessarily",
      "Using TanStack Query for client state — use useState or Zustand instead",
    ],
    examples: [
      {
        title: "Basic Query",
        description: "Fetch data and handle loading/error states automatically.",
        code: `import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () =>
      fetch(\`/api/users/\${userId}\`).then(r => r.json()),
  });
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <h1>{user.name}</h1>;
}`,
        language: "jsx",
      },
      {
        title: "Query with Options",
        description: "Configure staleTime, caching, and refetch behavior.",
        code: `function PostsList() {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: () => fetch('/api/posts').then(r => r.json()),
    staleTime: 5 * 60 * 1000,      // Data fresh for 5 minutes (no refetch)
    gcTime:    30 * 60 * 1000,     // Keep in cache 30 min after last consumer unmounts
    refetchOnWindowFocus: false,    // Don't refetch when tab regains focus
    retry: 2,                       // Retry failed requests twice before erroring
  });
  
  return <ul>{posts?.map(p => <li key={p.id}>{p.title}</li>)}</ul>;
}`,
        language: "jsx",
      },
      {
        title: "Mutation with Cache Invalidation",
        description: "Handle writes and update related queries.",
        code: `import { useMutation, useQueryClient } from '@tanstack/react-query';

function AddPost() {
  const queryClient = useQueryClient();
  
  const { mutate, isPending } = useMutation({
    mutationFn: (newPost) =>
      fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
      }).then(r => r.json()),
    
    onSuccess: () => {
      // Invalidate the posts query so it refetches
      queryClient.invalidateQueries({
        queryKey: ['posts'],
      });
    },
  });
  
  return (
    <button disabled={isPending} onClick={() => mutate({ title: 'New' })}>
      {isPending ? 'Adding...' : 'Add Post'}
    </button>
  );
}`,
        language: "jsx",
      },
      {
        title: "Dependent Queries",
        description: "Query that depends on another query's data.",
        code: `function UserPosts({ userId }) {
  // First query
  const { data: user } = useQuery({
    queryKey: ['user', userId],
    queryFn: () =>
      fetch(\`/api/users/\${userId}\`).then(r => r.json()),
  });
  
  // Second query depends on first
  const { data: posts } = useQuery({
    queryKey: ['posts', user?.id],
    queryFn: () =>
      fetch(\`/api/users/\${user.id}/posts\`).then(r => r.json()),
    enabled: !!user,  // Only run when user is available
  });
  
  return (
    <div>
      <h1>{user?.name}</h1>
      <ul>{posts?.map(p => <li key={p.id}>{p.title}</li>)}</ul>
    </div>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
