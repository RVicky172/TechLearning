import type { TopicNode } from "@/data/types";

export const diffing: TopicNode = {
  id: "react-diffing-reconciliation",
  title: "Diffing & Reconciliation",
  iconName: "GitCompareArrows",
  link: "https://legacy.reactjs.org/docs/reconciliation.html",
  theory:
    "Reconciliation is React's process for comparing the previous and next element trees to decide what should update. Its diffing strategy uses heuristics, including element type matching and keys, to perform updates efficiently.",
  theoryDetail: {
    keyConcepts: [
      "If element types differ, React replaces the subtree instead of reusing it",
      "If element types match, React updates props and recursively compares children",
      "Keys tell React how to match list items between renders",
      "Stable keys preserve component identity and local state across reorders",
    ],
    whyItMatters:
      "Diffing behavior directly affects correctness and performance. Choosing stable keys avoids UI bugs like input state jumping between rows, and understanding reconciliation helps explain when components remount versus update.",
    commonPitfalls: [
      "Using array indexes as keys in dynamic/reordered lists",
      "Using random keys (for example, Math.random()) that force remounts every render",
      "Expecting state to persist when element type or key changes",
      "Reordering list items without stable identifiers",
    ],
    examples: [
      {
        title: "Good vs Bad Keys",
        description: "Stable IDs preserve item identity; index keys can break identity during reorder.",
        code: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        // Good: stable key from data
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}

function BadTodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        // Risky for reorders/inserts/removals
        <li key={index}>{todo.text}</li>
      ))}
    </ul>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
