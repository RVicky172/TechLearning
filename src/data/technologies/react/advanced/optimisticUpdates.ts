import type { TopicNode } from "@/data/types";

export const optimisticUpdates: TopicNode = {
  id: "react-optimistic-updates",
  title: "Optimistic Updates",
  iconName: "Zap",
  demoComponentKey: "reactOptimistic",
  link: "https://react.dev/reference/react/useOptimistic",
  theory:
    "Optimistic updates show the result of a user action immediately in the UI — before the server confirms it succeeded. If the server request fails, the UI reverts to the previous state. This pattern is what makes apps feel instant: Twitter/X updates the like count before the API responds, Notion saves text optimistically, and Vercel shows deployment status before the build finishes.",
  theoryDetail: {
    keyConcepts: [
      "useOptimistic (React 19) declaratively manages an optimistic state that auto-reverts when the async action settles",
      "The pattern: update UI immediately → send network request → on failure, revert; on success, confirm",
      "Optimistic updates are only appropriate for high-confidence, reversible actions (likes, follows, toggles)",
      "Always show a visual indicator (spinner, strikethrough) during the pending state so users know the action is in flight",
      "Idempotent server endpoints are critical — retrying an optimistic action must produce the same result",
    ],
    whyItMatters:
      "Network latency is unavoidable, but perceived latency is a design choice. Research shows UI feedback under 100ms feels instant. Optimistic updates are the difference between an app that feels like native software and one that feels like a 2005 website. Used by every major consumer app — Twitter, GitHub, Slack, Linear, Notion.",
    commonPitfalls: [
      "Not reverting on failure — if the API call fails and the UI stays updated, the UI is now showing incorrect data",
      "Using optimistic updates for non-idempotent operations (e.g., charge a credit card) — catastrophic if retried",
      "Not handling the race condition where two rapid clicks fire two competing requests",
      "Missing the loading indicator — users don't know if their action is pending or confirmed",
    ],
    examples: [
      {
        title: "Like Button with useOptimistic (React 19)",
        description:
          "The classic optimistic update: clicking like instantly updates the count, then syncs with the server. If the server fails, React automatically rolls back to the real count.",
        code: `'use client';
import { useOptimistic, useTransition } from 'react';

interface Post {
  id: string;
  likeCount: number;
  isLikedByMe: boolean;
}

// Server action (Next.js App Router)
async function toggleLike(postId: string): Promise<Post> {
  const res = await fetch(\`/api/posts/\${postId}/like\`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to like');
  return res.json();
}

function LikeButton({ post }: { post: Post }) {
  const [isPending, startTransition] = useTransition();

  // useOptimistic: returns an [optimisticValue, applyOptimisticUpdate] pair
  // When the async action settles, React automatically reverts to the real post data
  const [optimisticPost, addOptimisticLike] = useOptimistic(
    post,
    (currentPost, action: 'like' | 'unlike') => ({
      ...currentPost,
      isLikedByMe: action === 'like',
      likeCount: currentPost.likeCount + (action === 'like' ? 1 : -1),
    })
  );

  const handleClick = () => {
    const action = optimisticPost.isLikedByMe ? 'unlike' : 'like';

    startTransition(async () => {
      // 1. Apply optimistic update immediately (UI feels instant)
      addOptimisticLike(action);

      // 2. Send the real request
      try {
        await toggleLike(post.id);
        // On success: React commits the optimistic state
      } catch {
        // On failure: React automatically reverts to the original post
        // (because useOptimistic ties the optimistic state to the real post prop)
        alert('Failed to update like. Please try again.');
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={optimisticPost.isLikedByMe ? 'Unlike' : 'Like'}
    >
      {optimisticPost.isLikedByMe ? '❤️' : '🤍'}
      {optimisticPost.likeCount} {isPending && '(saving...)'}
    </button>
  );
}`,
        language: "tsx",
      },
      {
        title: "Optimistic Delete in a List",
        description:
          "Remove an item from the list immediately, then confirm with the server. Restore on failure.",
        code: `'use client';
import { useOptimistic, useTransition } from 'react';

interface Task { id: string; title: string; done: boolean }

async function deleteTask(id: string) {
  await fetch(\`/api/tasks/\${id}\`, { method: 'DELETE' });
}

function TaskList({ tasks }: { tasks: Task[] }) {
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, removeTask] = useOptimistic(
    tasks,
    (current, idToRemove: string) =>
      current.filter(t => t.id !== idToRemove) // Immediately remove from list
  );

  const handleDelete = (id: string) => {
    startTransition(async () => {
      removeTask(id); // Instant UI update
      try {
        await deleteTask(id); // Server request
      } catch {
        // useOptimistic reverts automatically — the task reappears
        alert('Could not delete task. It has been restored.');
      }
    });
  };

  return (
    <ul>
      {optimisticTasks.map(task => (
        <li key={task.id} style={{ opacity: isPending ? 0.7 : 1 }}>
          {task.title}
          <button onClick={() => handleDelete(task.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}`,
        language: "tsx",
      },
      {
        title: "Manual Optimistic Updates (without useOptimistic)",
        description:
          "Pre-React 19 pattern — or when using non-RSC architecture. Manually manage pending state with useState.",
        code: `import { useState } from 'react';

function FollowButton({ userId, initialIsFollowing }: { userId: string; initialIsFollowing: boolean }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isPending, setIsPending] = useState(false);

  const toggle = async () => {
    if (isPending) return; // Prevent race conditions from double-click

    const newValue = !isFollowing;

    // 1. Optimistic update
    setIsFollowing(newValue);
    setIsPending(true);

    try {
      await fetch(\`/api/users/\${userId}/follow\`, {
        method: newValue ? 'POST' : 'DELETE',
      });
      // 2. Success — keep the optimistic value
    } catch {
      // 3. Failure — revert to original
      setIsFollowing(!newValue);
      alert('Action failed. Please try again.');
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button onClick={toggle} disabled={isPending}>
      {isPending ? 'Saving...' : isFollowing ? 'Following' : 'Follow'}
    </button>
  );
}`,
        language: "tsx",
      },
    ],
  },
};
