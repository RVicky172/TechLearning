import type { TopicNode } from "@/data/types";

export const diffing: TopicNode = {
  id: "react-diffing-reconciliation",
  title: "Diffing & Reconciliation",
  iconName: "GitCompareArrows",
  link: "https://legacy.reactjs.org/docs/reconciliation.html",
  theory:
    "Reconciliation is React's process for comparing previous and next element trees to decide what updates. Its diffing strategy uses heuristics — element type matching, keys, and subtree position — to perform updates efficiently. Without stable keys, list reorders cause state loss and bugs. Understanding reconciliation explains why components remount, why keys prevent state bugs, and how to optimize renders.",
  theoryDetail: {
    keyConcepts: [
      "Reconciliation compares element trees level-by-level, never moving nodes across levels",
      "If element types differ (div → span), React replaces the entire subtree, destroying all nested state",
      "If element types match, React updates props and recursively compares children",
      "Keys tell React how to match list items across renders — identity is preserved across reorders, inserts, deletions",
      "Without keys or with unstable keys (index, Math.random()), React falls back to position-based matching, causing state drift",
      "The reconciliation algorithm is O(n) heuristic-based, not optimal (optimal diff is exponential) — tradeoff for practical performance",
    ],
    whyItMatters:
      "Diffing behavior directly affects correctness and performance. Choosing stable keys avoids UI bugs like form state jumping between rows. Understanding reconciliation explains why (key={index}) breaks on reorder, why <Fragment> avoids unnecessary DOM nodes, and when components remount vs update.",
    commonPitfalls: [
      "Using array indexes as keys in dynamic/reordered/filtered lists — on reorder, keys don't match items anymore",
      "Using random keys (Math.random(), uuid()) that force remounts every render — the component unmounts/remounts constantly",
      "Changing element type (button → link) — entire subtree is destroyed and recreated, state is lost",
      "Depending on position-based matching — if list is filtered/sorted, state attaches to the wrong item",
      "Assuming shallow changes in props cause shallow changes in subtree — reconciliation is recursive and thorough",
      "Not understanding that key changes force remount — changing key intentionally is a way to reset component state",
    ],
    examples: [
      {
        title: "Reconciliation Algorithm: Position + Type + Key Matching",
        description: "How React matches elements and decides to reuse or replace.",
        code: `// SCENARIO 1: Type match, props update
// Before: <div className="old">
// After:  <div className="new">
// Result: Same div Fiber, update className prop ✅

// SCENARIO 2: Type mismatch, replace
// Before: <div>
// After:  <span>
// Result: Old div destroyed, new span created ❌ (subtree lost)

// SCENARIO 3: Type match, children differ
// Before: <ul><li key="a">A</li><li key="b">B</li></ul>
// After:  <ul><li key="b">B</li><li key="a">A</li></ul>
// Result: Li fibers reordered via key, state preserved ✅

// SCENARIO 4: No keys (position-based)
// Before: <ul><li>A</li><li>B</li></ul>  // user state: { text: 'A-input', ...}
// After:  <ul><li>B</li><li>A</li></ul>
// Result: React matches by position (index 0 → 0, index 1 → 1)
//         Li[0] component state (text: 'A-input') now displays with 'B' ❌

// The bug: the controlled input still has the old state value!`,
        language: "javascript",
      },
      {
        title: "Key Strategies: Stable vs Unstable",
        description: "Why stable keys are critical for list correctness.",
        code: `// ✅ GOOD: Database IDs (stable across renders, reorders, filters)
function TodoList({ todos }) {
  return todos.map(todo => (
    <TodoItem key={todo.id} todo={todo} />
  ));
}

// ❌ BAD: Index key (position breaks with reorder)
function BadTodos({ todos }) {
  // If todos is sorted/reordered: todos[0].id changes every render
  // Component state attaches to Fiber index, not to the todo item
  return todos.map((todo, index) => (
    <TodoItem key={index} todo={todo} />
  ));
}

// ❌ BAD: Random key (forces remount every render)
function WorseTodos({ todos }) {
  return todos.map(todo => (
    <TodoItem key={Math.random()} todo={todo} /> // remounts every render!
  ));
}

// ⚠️  EDGE CASE: uuid() on render (unstable, but at least non-sequential)
import { v4 as uuid } from 'uuid';
function WeirdTodos({ todos }) {
  // Generate new UUIDs every render — still wrong, but looks intentional
  const itemIds = useMemo(() => todos.map(() => uuid()), [todos.length]);
  return todos.map((todo, index) => (
    <TodoItem key={itemIds[index]} todo={todo} />
  ));
}`,
        language: "jsx",
      },
      {
        title: "Controlled Inputs + Bad Keys = State Jump Bug",
        description: "The #1 real-world bug from unstable keys.",
        code: `// ❌ BUGGY: Reorder causes input state to jump
function FilteredList({ items, filter }) {
  const filtered = items.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <ul>
      {filtered.map((item, index) => (
        <li key={index}> {/* ❌ Position-based, unstable */}
          <input
            type="text"
            value={item.notes} // from parent state
            onChange={(e) => updateNotes(item.id, e.target.value)}
          />
        </li>
      ))}
    </ul>
  );
}

// Scenario:
// Items: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }]
// Filter: none, keys are [0, 1]
// User types in item 1's input: "my notes"
// Filter changes, items reorder: [{ id: 2, name: 'Bob' }, { id: 1, name: 'Alice' }]
// keys are now [0, 1] again, but item.id has changed!
// Result: input still shows "my notes" but it's now in the wrong row ❌

// ✅ FIX: Use stable key
function FixedList({ items, filter }) {
  const filtered = items.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <ul>
      {filtered.map((item) => (
        <li key={item.id}> {/* ✅ Stable, tied to data */}
          <input
            type="text"
            value={item.notes}
            onChange={(e) => updateNotes(item.id, e.target.value)}
          />
        </li>
      ))}
    </ul>
  );
}`,
        language: "jsx",
      },
      {
        title: "Forcing Remount by Changing Key",
        description: "Key changes force React to destroy old Fiber and create new one — used intentionally to reset state.",
        code: `function Modal({ userId, isOpen }) {
  // When userId changes, modal should reset form state
  return (
    isOpen && (
      <FormModal 
        key={userId} {/* Changing key = unmount + remount */}
        userId={userId} 
      />
    )
  );
}

function FormModal({ userId }) {
  const [formData, setFormData] = useState({ email: '', message: '' });
  
  useEffect(() => {
    // Fetch user-specific form data
    fetch(\`/api/user/\${userId}/form\`).then(r => r.json()).then(setFormData);
  }, [userId]);
  
  return (
    <form>
      <input 
        value={formData.email} 
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
      />
      <textarea 
        value={formData.message} 
        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
      />
    </form>
  );
}

// Without key={userId}:
// - userId changes but FormModal mounts once
// - formData state persists from old userId
// - useEffect runs and updates it, but there's a flicker

// With key={userId}:
// - userId changes, entire FormModal tree is destroyed
// - New FormModal is created, formData starts fresh
// - useEffect runs once, data is correct from the start`,
        language: "jsx",
      },
      {
        title: "When Reconciliation Fails: Element Type Changes",
        description: "Switching element types destroys state — sometimes intentional, often a bug.",
        code: `// ❌ BUGGY: Dynamic element type based on condition
function Badge({ variant, count }) {
  // If variant changes, element type changes → entire subtree destroyed
  if (variant === 'button') {
    return (
      <button>
        Count: {count}
        <InnerCounter /> {/* Lost on type switch! */}
      </button>
    );
  }
  
  return (
    <span>
      Count: {count}
      <InnerCounter /> {/* This remounts when variant changes */}
    </span>
  );
}

// ✅ FIXED: Keep element type stable, use className
function Badge({ variant, count }) {
  const Element = variant === 'button' ? 'button' : 'span';
  
  return (
    <Element className={variant}>
      Count: {count}
      <InnerCounter /> {/* Preserved across variant changes */}
    </Element>
  );
  
  // Better: if truly different behavior, separate components
  //  return variant === 'button' ? <ButtonBadge /> : <SpanBadge />;
}`,
        language: "jsx",
      },
    ],
  },
};
