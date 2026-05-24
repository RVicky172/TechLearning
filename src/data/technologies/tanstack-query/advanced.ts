import type { TopicNode } from "@/data/types";

export const tanstackAdvanced: TopicNode = {
  id: "tanstack-advanced",
  title: "Advanced — Infinite, Prefetch & Suspense",
  iconName: "Layers",
  link: "https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries",
  theory:
    "useInfiniteQuery powers paginated and infinite-scroll lists. Prefetching loads data before the user navigates. Suspense integration lets you co-locate loading states in the component tree rather than in every data-consuming component.",
  theoryDetail: {
    keyConcepts: [
      "useInfiniteQuery: fetches pages of data; provides fetchNextPage, hasNextPage, isFetchingNextPage for infinite scroll",
      "getNextPageParam: a function that extracts the next page cursor/offset from the last fetched page",
      "prefetchQuery: call queryClient.prefetchQuery in server components or route loaders to warm the cache before rendering",
      "Suspense mode: set suspense: true on a query — useQuery throws a Promise that Suspense catches; eliminates if (isLoading) checks",
      "useSuspenseQuery: the explicit hook for Suspense integration (TanStack Query v5) — data is guaranteed non-undefined",
      "select: transforms or slices query data before it reaches the component — keep components coupled to their view model, not the API shape",
      "Dependent queries: use enabled: !!userId to chain queries — the second query waits until the first resolves and provides the needed data",
    ],
    whyItMatters:
      "Infinite scroll, prefetching on hover, and Suspense-first data loading are the features that separate polished apps from basic CRUD. useInfiniteQuery and prefetchQuery are the tools every senior React developer is expected to know.",
    commonPitfalls: [
      "Calling fetchNextPage before hasNextPage is true — always guard: if (hasNextPage && !isFetchingNextPage) fetchNextPage()",
      "Forgetting to flatten infinite query pages — data.pages is an array of pages; use data.pages.flatMap(p => p.items) to get a flat list",
      "Using Suspense without an ErrorBoundary — useSuspenseQuery throws on error too; always wrap Suspense with a co-located ErrorBoundary",
    ],
    examples: [
      {
        title: "Infinite scroll with useInfiniteQuery",
        description:
          "Fetch paginated items with a cursor; load more when the user scrolls to the bottom using IntersectionObserver.",
        code: `import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useCallback, useEffect } from "react";

interface Page { items: Post[]; nextCursor: string | null; }

function useInfinitePosts() {
  return useInfiniteQuery<Page>({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) =>
      fetch(\`/api/posts?cursor=\${pageParam ?? ""}\`).then((r) => r.json()),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,  // null → no more pages
  });
}

function PostFeed() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfinitePosts();

  // IntersectionObserver sentinel — triggers next page load
  const sentinelRef = useRef<HTMLDivElement>(null);
  const handleIntersect = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const posts = data?.pages.flatMap((page) => page.items) ?? [];

  if (isLoading) return <Skeleton />;

  return (
    <>
      {posts.map((post) => <PostCard key={post.id} post={post} />)}
      <div ref={sentinelRef} className="h-10" />
      {isFetchingNextPage && <Spinner />}
      {!hasNextPage && <p className="text-center text-sm text-zinc-500">All caught up!</p>}
    </>
  );
}`,
        language: "typescript",
      },
    ],
  },
};
