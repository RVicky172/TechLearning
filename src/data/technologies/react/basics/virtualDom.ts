import type { TopicNode } from "@/data/types";

export const virtualDom: TopicNode = {
  id: "react-virtual-dom",
  title: "Virtual DOM",
  iconName: "Layers",
  link: "https://react.dev/learn/render-and-commit",
  theory:
    "The Virtual DOM is React's in-memory representation of what the UI should look like. On each render, React builds a new tree of elements, compares it with the previous tree, then updates only the real DOM nodes that changed.",
  theoryDetail: {
    keyConcepts: [
      "Rendering in React produces lightweight JavaScript objects (elements), not immediate DOM mutations",
      "React keeps previous and next render trees in memory to determine what changed",
      "Only changed parts are committed to the browser DOM, reducing expensive layout and paint work",
      "Virtual DOM is an implementation detail that enables declarative UI updates, not a standalone API",
    ],
    whyItMatters:
      "Understanding the Virtual DOM helps explain why React can keep UI code declarative while remaining performant. It also helps you reason about render cost, memoization decisions, and why stable keys matter.",
    commonPitfalls: [
      "Assuming every render means a full DOM rewrite",
      "Believing Virtual DOM alone guarantees performance without good component structure",
      "Over-optimizing with memoization before measuring real bottlenecks",
      "Mutating objects in state, which hides changes from React's update logic",
    ],
    examples: [
      {
        title: "Declarative Render",
        description: "State changes trigger a re-render; React computes the minimal DOM update.",
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
