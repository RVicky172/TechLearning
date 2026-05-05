import type { TopicNode } from "@/data/types";

export const renderPipeline: TopicNode = {
  id: "react-render-pipeline",
  title: "Render, Reconciliation, Commit",
  iconName: "Workflow",
  link: "https://react.dev/learn/render-and-commit",
  theory:
    "React updates happen in a pipeline: render computes the next UI tree, reconciliation compares old and new trees, and commit applies minimal DOM changes. Treat render as a pure calculation; side effects belong in effects or event handlers. React 18+ uses Fiber architecture to make rendering interruptible, enabling concurrent features and priority scheduling.",
  theoryDetail: {
    keyConcepts: [
      "Render phase (aka 'work phase') computes next JSX from props/state — must be pure, can run multiple times or be interrupted",
      "Reconciliation compares previous and next element trees, deciding which nodes can be reused and which need updates",
      "Commit phase applies DOM mutations, runs effects, and updates refs — happens synchronously after render completes",
      "Fiber is React's internal unit of work — a tree of fiber nodes allowing pausing, prioritizing, and resuming renders",
      "React 18 enables time-slicing: long renders can be split across frames, keeping UI responsive to user input",
      "Priority lanes schedule different types of updates: synchronous (user input), normal (data fetches), deferred (non-urgent)",
    ],
    whyItMatters:
      "This model is the foundation for performance tuning, concurrency, and bug debugging. Understanding Fiber explains why you can't rely on render order, how useLayoutEffect differs from useEffect, and why stale closures happen in effects.",
    commonPitfalls: [
      "Running side effects during render instead of inside useEffect or event handlers — renders can be abandoned mid-way",
      "Assuming every render means every DOM node updates — reconciliation skips unchanged subtrees",
      "Confusing re-render with remount; forgetting that keys preserve component identity and state across reorders",
      "Optimizing before profiling; memoization adds overhead that only pays off for expensive renders",
      "Not understanding that render can run multiple times before commit — pure render functions must handle this gracefully",
    ],
    examples: [
      {
        title: "Fiber Architecture: Render → Reconciliation → Commit",
        description: "The three-phase pipeline that powers React updates.",
        code: `// PHASE 1: RENDER (pure, can be paused/interrupted)
// React walks the component tree, calling each function to get JSX.
// Builds a new tree of Fiber nodes representing the next UI state.

function MyComponent({ count }) {
  // This function runs during render phase
  const doubled = count * 2; // ✅ Pure computation
  return <div>{doubled}</div>;
}

// PHASE 2: RECONCILIATION (compare trees)
// React diffs the new Fiber tree against the previous one.
// Marks nodes with Placement, Update, or Deletion work.

// Prev tree:  <div key="a">Item 1</div> <div key="b">Item 2</div>
// Next tree: <div key="b">Item 2</div> <div key="a">Item 1</div>
// Result: Reorder these nodes (no DOM nodes destroyed/recreated)

// PHASE 3: COMMIT (apply to DOM, run effects)
// React applies marked changes to the DOM.
// Then runs useLayoutEffect, useEffect, cleanup functions.
// This phase is NOT interruptible.

useEffect(() => {
  // Runs AFTER commit, safe for side effects
  console.log('DOM is now updated');
}, [count]);`,
        language: "jsx",
      },
      {
        title: "Why Render Must Be Pure",
        description: "Multiple renders before commit mean side effects must be deferred.",
        code: `// ❌ WRONG: Side effect in render
function Component({ userId }) {
  // React might call this multiple times before committing!
  const [user, setUser] = useState(null);
  fetch(\`/api/user/\${userId}\`); // Fires multiple times, wasteful!
  return <div>{user?.name}</div>;
}

// ✅ RIGHT: Side effect in useEffect
function Component({ userId }) {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Guaranteed to run once per dependency change, after commit
    fetch(\`/api/user/\${userId}\`)
      .then(r => r.json())
      .then(setUser);
  }, [userId]);
  
  return <div>{user?.name}</div>;
}`,
        language: "jsx",
      },
      {
        title: "Time-Slicing: Rendering Across Frames",
        description: "React 18 splits long renders into chunks, preserving responsiveness.",
        code: `// Scenario: Render a huge list (expensive render phase)

function HugeList({ items }) {
  // React 18: This render can be split across multiple frames
  // If user types in an input, React pauses this render and prioritizes the input
  return (
    <ul>
      {items.map(item => (
        <li key={item.id} style={{ height: 100 }}>
          {item.data}
        </li>
      ))}
    </ul>
  );
}

// With startTransition (explicit deferred update)
function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value); // High priority: input feels instant
    
    startTransition(() => {
      // Low priority: search results render can be paused
      setResults(expensiveSearch(value));
    });
  };
  
  return (
    <>
      <input value={query} onChange={handleSearch} />
      {results.length > 0 && <HugeList items={results} />}
    </>
  );
}`,
        language: "jsx",
      },
      {
        title: "Render vs Commit: useEffect vs useLayoutEffect",
        description: "Where each hook runs in the pipeline affects timing and batching.",
        code: `import { useEffect, useLayoutEffect, useState } from 'react';

function Tooltip() {
  const [show, setShow] = useState(false);
  
  // Runs AFTER commit + browser paint (safe, non-blocking)
  useEffect(() => {
    console.log('useEffect: DOM is painted, safe for analytics/logging');
  }, [show]);
  
  // Runs AFTER commit but BEFORE browser paint (blocks paint)
  useLayoutEffect(() => {
    console.log('useLayoutEffect: DOM is updated, not yet painted');
    // Use this only for layout measurements/adjustments
  }, [show]);
  
  return (
    <>
      <button onClick={() => setShow(!show)}>Toggle</button>
      {show && <div>Tooltip content</div>}
    </>
  );
}

// Timeline:
// 1. Render phase: compute JSX
// 2. Reconciliation: diff trees
// 3. Commit phase: apply DOM mutations
// 4. useLayoutEffect cleanup & run
// 5. Browser paints
// 6. useEffect cleanup & run`,
        language: "jsx",
      },
      {
        title: "Keys: Preserving Fiber Identity Across Renders",
        description: "Without stable keys, reorders cause state loss.",
        code: `// ❌ NO KEYS or index keys: State is lost on reorder
function ItemList({ items }) {
  return items.map(item => (
    <Item item={item} key={item.id} /> // ✅ Stable key
  ));
}

// If items reorder, React's reconciliation still knows which Fiber to update
// because each Fiber is matched by key, not by position.

// ❌ BAD: Using index as key (position-based, breaks on reorder)
function ItemList({ items }) {
  return items.map((item, index) => (
    <Item item={item} key={index} /> // ❌ Position changes → Fiber lost
  ));
}

// Timeline without stable keys:
// Before: [Item(A, key=0), Item(B, key=1)]
// After:  [Item(B, ???), Item(A, ???)]
// Problem: If Item has internal state (controlled input), state attaches to fiber,
//          so reordering causes state to move with the Fiber, not the item!`,
        language: "jsx",
      },
    ],
  },
};
