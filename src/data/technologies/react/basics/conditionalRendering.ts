import type { TopicNode } from "@/data/types";

export const conditionalRendering: TopicNode = {
  id: "react-conditional-rendering",
  title: "Conditional Rendering",
  iconName: "GitBranch",
  link: "https://react.dev/learn/conditional-rendering",
  theory:
    "React components can decide what JSX to return based on conditions — just like regular JavaScript if/else. Because JSX is expressions, you can inline conditionals using the ternary operator, short-circuit &&, or early returns to produce different output from the same component.",
  theoryDetail: {
    keyConcepts: [
      "if/else or early return — the most readable pattern for two clearly distinct render branches",
      "Ternary: condition ? <A /> : <B /> — good for inline switches between two outputs",
      "Short-circuit: condition && <A /> — renders nothing (no DOM node) when condition is false",
      "null from a component renders nothing — useful to completely hide output without unmounting the parent",
    ],
    whyItMatters:
      "Every real UI has conditional states — logged in vs. guest, loading vs. loaded, empty vs. populated. Knowing which pattern to reach for (early return, ternary, &&, or switch) keeps the JSX readable instead of tangled with nested conditions.",
    commonPitfalls: [
      "Using 0 && <Component /> — JavaScript renders 0 as text; always coerce to boolean: !!count && <Component />",
      "Deeply nested ternaries — extract to variables or sub-components when logic is complex",
      "Returning undefined instead of null — only null/false suppress rendering; undefined throws in some contexts",
      "Changing conditions that cause keys to clash — different branches sharing the same key confuse React's reconciler",
    ],
    examples: [
      {
        title: "Early return — loading / error / data",
        description: "Use sequential early returns to handle three distinct states cleanly.",
        code: `function UserCard({ userId }) {
  const { data: user, loading, error } = useFetch(\`/api/users/\${userId}\`);

  if (loading) return <Spinner />;
  if (error)   return <ErrorMessage message={error.message} />;

  // happy path — no nesting needed
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Ternary — two branches inline",
        description: "Toggle between two outputs based on a boolean flag.",
        code: `function AuthButton({ isLoggedIn }) {
  return (
    <header>
      <h1>My App</h1>
      {isLoggedIn
        ? <button onClick={logout}>Log out</button>
        : <button onClick={login}>Log in</button>
      }
    </header>
  );
}`,
        language: "jsx",
      },
      {
        title: "Short-circuit && — show or hide",
        description: "Render an element only when a condition is truthy. Guard against falsy number 0.",
        code: `function Notifications({ count }) {
  return (
    <div>
      <h1>Inbox</h1>
      {/* ✅ Boolean cast prevents rendering '0' */}
      {count > 0 && (
        <span className="badge">{count} unread</span>
      )}
    </div>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
