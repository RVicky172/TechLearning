import type { TopicNode } from "@/data/types";

export const listsAndKeys: TopicNode = {
  id: "react-lists-keys",
  title: "Lists & Keys",
  iconName: "List",
  link: "https://react.dev/learn/rendering-lists",
  theory:
    "Rendering a list in React means mapping over an array and returning JSX for each item. React requires each item in a list to have a unique key prop so it can efficiently identify what changed, was added, or was removed when the list updates.",
  theoryDetail: {
    keyConcepts: [
      "The key prop must be unique among siblings — not globally unique, just within the same array render",
      "Use stable, unique IDs (database IDs, UUIDs) as keys — never use array index as key when the list can reorder or filter",
      "Keys are not passed to the component as props — they are purely for React's reconciler",
      "Fragments with keys: <React.Fragment key={id}> — useful when the list item renders multiple root elements",
    ],
    whyItMatters:
      "Without keys, React can't tell which list item changed — it falls back to re-rendering the whole list. Correct keys enable surgical DOM updates, preserve focus/selection inside list items, and prevent subtle bugs where state from one item bleeds into another after reordering.",
    commonPitfalls: [
      "Using array index as key when the list can reorder — React associates state with the index, not the item, causing state to swap between items",
      "Using Math.random() or Date.now() as keys — new keys every render force React to unmount and remount all items",
      "Forgetting the key on the outermost element returned by map — the key goes on the element, not a wrapper",
      "Duplicated keys in the same list — React silently uses the first match, dropping the second",
    ],
    examples: [
      {
        title: "Rendering a list with stable keys",
        description: "Map over data and supply a unique id as the key.",
        code: `function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        // ✅ Stable database id as key
        <li key={todo.id}>
          <span>{todo.text}</span>
          <span>{todo.done ? '✓' : '○'}</span>
        </li>
      ))}
    </ul>
  );
}`,
        language: "jsx",
      },
      {
        title: "Why index keys break state",
        description: "Demonstrate the subtle bug caused by using index as key on a reorderable list.",
        code: `// ❌ BAD — index as key: when the list reorders, React thinks
//    the first <input> is still the same element and keeps its value
function BadList({ items }) {
  return items.map((item, index) => (
    <div key={index}>
      <span>{item.label}</span>
      <input defaultValue={item.label} />
    </div>
  ));
}

// ✅ GOOD — stable id: React correctly moves DOM nodes when sorting
function GoodList({ items }) {
  return items.map(item => (
    <div key={item.id}>
      <span>{item.label}</span>
      <input defaultValue={item.label} />
    </div>
  ));
}`,
        language: "jsx",
      },
      {
        title: "Fragment with key — multiple roots per item",
        description: "Return two sibling elements per list item without adding a wrapper div.",
        code: `import { Fragment } from 'react';

function DefinitionList({ terms }) {
  return (
    <dl>
      {terms.map(term => (
        // Fragment can carry a key when multiple elements share a logical slot
        <Fragment key={term.id}>
          <dt>{term.word}</dt>
          <dd>{term.definition}</dd>
        </Fragment>
      ))}
    </dl>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
