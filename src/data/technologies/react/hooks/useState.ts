import type { TopicNode } from "@/data/types";

export const hookUseState: TopicNode = {
  id: "hook-usestate",
  title: "useState",
  iconName: "ToggleLeft",
  link: "https://react.dev/reference/react/useState",
  theory:
    "useState is the fundamental hook for adding local, reactive memory to a function component. Every call returns a stable [value, setter] pair — calling the setter schedules a re-render with the new value.",
  theoryDetail: {
    keyConcepts: [
      "useState(initialValue) — initialValue is only used on the first render; pass a function for lazy initialisation",
      "The setter can take a new value OR an updater function (prev => next) — always use the function form when the next value depends on the previous one",
      "State updates inside event handlers are batched in React 18+ — multiple setters cause only one re-render",
      "State is local and isolated — two instances of the same component each have their own independent state",
    ],
    whyItMatters:
      "State is what turns a static template into an interactive UI. Every click, input change, or async result that needs to appear on screen must be reflected in state. Getting useState right is the foundation for every other hook.",
    commonPitfalls: [
      "Mutating state directly (arr.push(), obj.key = val) — React won't detect the change; always return a new reference",
      "Reading state immediately after calling the setter — the new value isn't available until the next render",
      "Using the stale non-functional form: setCount(count + 1) inside async callbacks — use setCount(c => c + 1) instead",
      "Storing derived data in state — compute on render or memoize with useMemo instead",
    ],
    examples: [
      {
        title: "Counter — basic update",
        description: "Increment, decrement and reset using the setter with an updater function.",
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(c => c - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Object state — always spread",
        description: "When state is an object, spread the previous value to avoid wiping unrelated fields.",
        code: `import { useState } from 'react';

function ProfileForm() {
  const [profile, setProfile] = useState({ name: '', bio: '', age: 0 });

  const update = (field, value) =>
    setProfile(prev => ({ ...prev, [field]: value }));

  return (
    <>
      <input value={profile.name}
             onChange={e => update('name', e.target.value)}
             placeholder="Name" />
      <textarea value={profile.bio}
                onChange={e => update('bio', e.target.value)}
                placeholder="Bio" />
      <input type="number" value={profile.age}
             onChange={e => update('age', +e.target.value)} />
    </>
  );
}`,
        language: "jsx",
      },
      {
        title: "Lazy initialisation",
        description: "Pass a function to useState to avoid running expensive work on every render.",
        code: `import { useState } from 'react';

function DataTable({ rawRows }) {
  // processRows runs ONCE on mount, not on every re-render
  const [rows, setRows] = useState(() => processRows(rawRows));

  return <table>{rows.map(r => <tr key={r.id}><td>{r.name}</td></tr>)}</table>;
}`,
        language: "jsx",
      },
    ],
  },
};
