import type { TopicNode } from "@/data/types";

export const duplicateKeys: TopicNode = {
  id: "react-duplicate-keys",
  title: "Duplicate Key Warning",
  iconName: "AlertCircle",
  link: "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
  theory:
    "React's reconciler uses the key prop to identify each child in a list across renders. When two siblings share the same key, React cannot distinguish them — it silently keeps the first and may drop or duplicate the second, producing UI bugs that are hard to trace. The warning 'Encountered two children with the same key' is React telling you its diffing algorithm is broken for that list.",
  theoryDetail: {
    keyConcepts: [
      "Keys must be unique among siblings in the same list — not globally, but within each array render call",
      "Non-unique keys break reconciliation: React re-uses the wrong DOM node, causing state, focus, and animation to bleed between items",
      "The most common sources of duplicates: merged arrays with overlapping IDs, the same component rendered twice with the same key, or two separate data sources sharing an ID space",
      "Keys are consumed by React and never appear in the rendered DOM — they do not become HTML attributes",
    ],
    whyItMatters:
      "Duplicate keys are silent bugs in production — the console warning only appears in development mode. The real damage shows up as wrong data displayed in the wrong row, form inputs retaining stale values after a list update, or animations running on the wrong element. Understanding why React requires unique keys makes you build correct list rendering from the start.",
    commonPitfalls: [
      "Concatenating two arrays from different endpoints where both start IDs from 1 — prefix keys with the source: `user-${id}` vs `org-${id}`",
      "Using Math.random() or Date.now() as a 'unique' key — it generates a new key every render, forcing unmount/remount of every item",
      "Wrapping a list in a component and returning siblings without a key on the outer Fragment",
      "Assuming the warning 'disappears' means the bug is gone — in production, warnings are silenced but the broken behavior remains",
    ],
    examples: [
      {
        title: "Why duplicate keys break rendering",
        description:
          "When two items share a key, React treats them as the same element. The second is effectively ignored — or worse, the wrong item updates.",
        code: `// ❌ Bug: two items share key "1"
const items = [
  { id: 1, label: 'Apple' },
  { id: 1, label: 'Banana' },  // same id as Apple!
  { id: 2, label: 'Cherry' },
];

function BadList() {
  return (
    <ul>
      {items.map(item => (
        // React sees two <li key="1"> — behavior is undefined
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
}
// Console: "Encountered two children with the same key, '1'."
// Rendered result: React may show 'Apple' twice or skip 'Banana' entirely`,
        language: "jsx",
      },
      {
        title: "Merging arrays from two sources — namespace the key",
        description:
          "When combining data from two endpoints that independently auto-increment IDs, prefix the key with the source to guarantee uniqueness.",
        code: `// Two API endpoints both return items with id: 1, 2, 3 ...
const employees    = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
const contractors  = [{ id: 1, name: 'Carol' }, { id: 2, name: 'Dave' }];

// ❌ Duplicate keys — employees id=1 and contractors id=1 clash
const bad = [...employees, ...contractors].map(p => (
  <li key={p.id}>{p.name}</li>
));

// ✅ Prefix with source type to keep keys unique across the merged list
const good = [
  ...employees.map(p   => <li key={\`employee-\${p.id}\`}>{p.name}</li>),
  ...contractors.map(p => <li key={\`contractor-\${p.id}\`}>{p.name}</li>),
];`,
        language: "jsx",
      },
      {
        title: "Tab / multi-section rendering with shared key space",
        description:
          "Rendering the same component type for multiple categories in one list — namespace keys by category.",
        code: `const categories = ['fruits', 'vegetables'];
const data = {
  fruits:     [{ id: 1, name: 'Apple' }, { id: 2, name: 'Mango' }],
  vegetables: [{ id: 1, name: 'Carrot' }, { id: 2, name: 'Broccoli' }],
};

// ❌ id is unique within each category but collides across categories
categories.flatMap(cat =>
  data[cat].map(item => <ProductCard key={item.id} item={item} />)
);

// ✅ Compound key: category + id is always unique
categories.flatMap(cat =>
  data[cat].map(item => (
    <ProductCard key={\`\${cat}-\${item.id}\`} item={item} />
  ))
);`,
        language: "jsx",
      },
      {
        title: "Keyed Fragments for multi-element list items",
        description:
          "When a list item renders multiple root elements, use <Fragment key={...}> so the key is on the right element and siblings are kept together.",
        code: `import { Fragment } from 'react';

const rows = [
  { id: 'a1', label: 'Row A', detail: 'Detail for A' },
  { id: 'b2', label: 'Row B', detail: 'Detail for B' },
];

function DefinitionList() {
  return (
    <dl>
      {rows.map(row => (
        // Key on the Fragment, not on dt or dd individually
        <Fragment key={row.id}>
          <dt>{row.label}</dt>
          <dd>{row.detail}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

// ❌ Wrong — key on the inner element means the outer Fragment has no key
// rows.map(row => <Fragment><dt key={row.id}>{row.label}</dt><dd>...</dd></Fragment>)`,
        language: "jsx",
      },
      {
        title: "Intentional key reset — force component remount",
        description:
          "Changing a key deliberately tells React to unmount the old component and mount a fresh one. Use this to reset internal state when the identity of the data changes.",
        code: `// Scenario: an edit form whose inputs should reset when you switch to a different user
function UserEditForm({ userId }) {
  const [name, setName] = useState('');

  // ❌ Without key — switching userId keeps the same component instance;
  //    the old user's typed name stays in the input until cleared manually.

  return <input value={name} onChange={e => setName(e.target.value)} />;
}

// ✅ key={userId} — when userId changes React unmounts the old form
//    and mounts a brand-new one with clean state. No manual reset needed.
function Page({ userId }) {
  return <UserEditForm key={userId} userId={userId} />;
}`,
        language: "jsx",
      },
    ],
  },
};
