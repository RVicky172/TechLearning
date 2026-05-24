import type { TopicNode } from "@/data/types";

export const tanstackMutations: TopicNode = {
  id: "tanstack-mutations",
  title: "Mutations & Cache Invalidation",
  iconName: "Edit",
  link: "https://tanstack.com/query/latest/docs/framework/react/guides/mutations",
  theory:
    "useMutation handles writes (POST, PUT, DELETE). After a successful mutation, you invalidate affected query keys so the UI refetches fresh data. Optimistic updates go further — update the cache immediately and roll back on error, making the UI feel instant.",
  theoryDetail: {
    keyConcepts: [
      "useMutation: executes an async side-effecting function; provides mutate/mutateAsync, isPending, isError, isSuccess",
      "onSuccess callback: ideal place to call queryClient.invalidateQueries — triggers background refetch of affected queries",
      "invalidateQueries: marks matching cached queries as stale, triggering a refetch for any component currently subscribed",
      "Optimistic updates: onMutate callback updates the cache before the server responds; onError rolls back using the snapshot from onMutate; onSettled always revalidates",
      "setQueryData: directly write data into the cache without a network request — used for optimistic updates and prefetching",
      "mutateAsync: promise-based API that throws on error — useful when you need to await the mutation in a form submit handler",
    ],
    whyItMatters:
      "Proper cache invalidation is what keeps the UI consistent after writes. Optimistic updates are the difference between a UI that feels snappy and one that shows a spinner after every click. Both are core patterns in production apps.",
    commonPitfalls: [
      "Invalidating too broadly — queryClient.invalidateQueries() with no key invalidates everything; always be specific with the key",
      "Not handling mutation errors — always provide an onError callback or display isError so users know their write failed",
      "Forgetting to reset mutation state — after success/error, the mutation state persists; call reset() if you re-use the same mutation in a modal",
    ],
    examples: [
      {
        title: "useMutation with cache invalidation and optimistic update",
        description:
          "Create a todo with an optimistic UI update — the item appears instantly and rolls back if the server rejects it.",
        code: `import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Todo { id: number; text: string; done: boolean; }

function useTodos() {
  return useQuery<Todo[]>({
    queryKey: ["todos"],
    queryFn: () => fetch("/api/todos").then((r) => r.json()),
  });
}

function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (text: string) =>
      fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      }).then((r) => r.json()),

    // ── Optimistic update ──────────────────────────────
    onMutate: async (text) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot previous value for rollback
      const previous = queryClient.getQueryData<Todo[]>(["todos"]);

      // Optimistically insert the new todo
      queryClient.setQueryData<Todo[]>(["todos"], (old = []) => [
        ...old,
        { id: Date.now(), text, done: false },
      ]);

      return { previous };   // context passed to onError
    },

    onError: (_err, _text, context) => {
      // Roll back to snapshot
      queryClient.setQueryData(["todos"], context?.previous);
    },

    onSettled: () => {
      // Always refetch to sync with server truth
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}

// ── Usage in component ─────────────────────────────────
function TodoForm() {
  const createTodo = useCreateTodo();

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      createTodo.mutate(fd.get("text") as string);
      e.currentTarget.reset();
    }}>
      <input name="text" placeholder="New todo…" required />
      <button type="submit" disabled={createTodo.isPending}>
        {createTodo.isPending ? "Adding…" : "Add"}
      </button>
      {createTodo.isError && <p>Failed to create todo</p>}
    </form>
  );
}`,
        language: "typescript",
      },
    ],
  },
};
