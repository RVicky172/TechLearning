import type { TopicNode } from "@/data/types";

export const propsDrilling: TopicNode = {
  id: "react-props-drilling",
  title: "Props Drilling",
  iconName: "ArrowDownToLine",
  link: "https://react.dev/learn/passing-data-deeply-with-context",
  theory:
    "Props drilling is the practice of passing data through multiple layers of components that don't need it themselves, just to get it to a deeply nested child. It works but creates tight coupling — every intermediate component must forward a prop it doesn't use. Context, composition, or state managers solve the root problem.",
  theoryDetail: {
    keyConcepts: [
      "Props drilling is not a bug — it's a design trade-off. It's fine for 1–2 levels; it becomes a problem at 3+",
      "Context API eliminates drilling for truly global data (theme, auth, locale)",
      "Component composition (children or slot props) can also remove drilling without adding a context",
      "State colocation — moving state down closer to where it's used — reduces how far props need to travel upward",
    ],
    whyItMatters:
      "Drilled props make refactoring painful: renaming, adding, or removing a prop forces changes in every intermediary component even when they don't use it. Recognising the pattern and knowing the right solution for each case is a key step in writing maintainable React code.",
    commonPitfalls: [
      "Reaching for Context too early — if only one child needs the data, pass it as a prop; Context adds indirection",
      "Spreading all props blindly (...props) to pass them through — hides what a component actually needs",
      "Treating all shared state the same — frequently-changing values in Context re-render every consumer; use Zustand/Jotai for those",
      "Skipping colocation — before adding Context, check if the state can simply live closer to where it's needed",
    ],
    examples: [
      {
        title: "The problem — drilling theme 3 levels deep",
        description: "Theme lives at the top but must be threaded through every layer just to reach Button.",
        code: `// ❌ Every intermediate component must accept and forward theme
function App() {
  const [theme, setTheme] = useState('dark');
  return <Page theme={theme} />;
}

function Page({ theme }) {          // doesn't use theme itself
  return <Sidebar theme={theme} />;
}

function Sidebar({ theme }) {       // doesn't use theme itself
  return <Button theme={theme} />;
}

function Button({ theme }) {        // finally uses it
  return <button className={theme}>Click</button>;
}`,
        language: "jsx",
      },
      {
        title: "Solution 1 — Context API",
        description: "Put theme in Context so any descendant can read it without threading props.",
        code: `import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext('light');

function App() {
  const [theme, setTheme] = useState('dark');
  return (
    <ThemeContext.Provider value={theme}>
      <Page />   {/* no theme prop needed */}
    </ThemeContext.Provider>
  );
}

function Page()    { return <Sidebar />; }   // no theme prop
function Sidebar() { return <Button />;  }   // no theme prop

function Button() {
  const theme = useContext(ThemeContext);    // reads directly
  return <button className={theme}>Click</button>;
}`,
        language: "jsx",
      },
      {
        title: "Solution 2 — component composition",
        description: "Pass the fully-rendered Button as children so Page and Sidebar never see the theme.",
        code: `function App() {
  const [theme, setTheme] = useState('dark');

  // Compose the final element here — intermediate layers carry it as children
  return (
    <Page>
      <Sidebar>
        <Button theme={theme} />
      </Sidebar>
    </Page>
  );
}

function Page({ children })    { return <div className="page">{children}</div>; }
function Sidebar({ children }) { return <nav>{children}</nav>; }
function Button({ theme })     { return <button className={theme}>Click</button>; }`,
        language: "jsx",
      },
    ],
  },
};
