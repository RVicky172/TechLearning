import type { TopicNode } from "@/data/types";

export const renderPipeline: TopicNode = {
  id: "react-render-pipeline",
  title: "Render, Reconciliation, Commit",
  iconName: "Workflow",
  link: "https://react.dev/learn/render-and-commit",
  theory:
    "React updates happen in a pipeline: render computes the next UI tree, reconciliation compares old and new trees, and commit applies minimal DOM changes. Treat render as a pure calculation; side effects belong in effects or event handlers.",
  theoryDetail: {
    keyConcepts: [
      "Render phase computes the next JSX output from current props/state and should be pure",
      "Reconciliation compares previous and next element trees to decide what can be reused",
      "Commit phase applies DOM mutations and runs layout/effect lifecycles",
      "React 18 batches many state updates to reduce unnecessary commits",
    ],
    whyItMatters:
      "This model is the foundation for performance tuning and bug debugging. If you understand where work happens, you can avoid expensive renders, isolate side effects, and reason about why a component remounts or preserves state.",
    commonPitfalls: [
      "Running side effects during render instead of inside useEffect or event handlers",
      "Assuming every render means every DOM node updates",
      "Confusing re-render with remount, which causes accidental state loss",
      "Optimizing before profiling commit/rerender hotspots",
    ],
    examples: [
      {
        title: "Pure render + effect for side effects",
        description: "Render computes UI; effect performs external synchronization.",
        code: `import { useEffect, useState } from 'react';

function SearchBox({ query }) {
  const [value, setValue] = useState(query);

  useEffect(() => {
    document.title = value; // side effect after commit
  }, [value]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search"
    />
  );
}`,
        language: "jsx",
      },
    ],
  },
};
