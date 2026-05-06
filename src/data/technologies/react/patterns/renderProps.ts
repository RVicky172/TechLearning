import type { TopicNode } from "@/data/types";

export const renderProps: TopicNode = {
  id: "react-render-props",
  title: "Render Props",
  iconName: "FunctionSquare",
  demoComponentKey: "renderPropsDemo",
  link: "https://react.dev/reference/react/cloneElement#passing-data-with-a-render-prop",
  theory:
    "The render props pattern shares stateful logic between components by passing a function as a prop (or as children). The function receives data or state from the wrapper and returns JSX. The parent component handles 'what' data to manage; the passed function decides 'how' to render it.",
  theoryDetail: {
    keyConcepts: [
      "A render prop is any prop whose value is a function that returns JSX: render={(data) => <UI data={data} />}",
      "children-as-function is the most common form: {children(data)} instead of a named render prop",
      "The pattern separates logic from presentation — the wrapper owns state, the consumer owns rendering",
      "Custom hooks often replace render props today, but render props remain useful when JSX structure itself needs to vary",
    ],
    whyItMatters:
      "Render props solved the code-reuse problem before hooks — many popular libraries (React Router, Formik, Downshift) still expose render-prop APIs. Understanding the pattern lets you work with those APIs and recognise when to apply the same principle yourself.",
    commonPitfalls: [
      "Defining the render function inline in JSX — creates a new function reference every render, bypassing PureComponent/React.memo",
      "Nesting multiple render prop components creating 'callback hell' — custom hooks compose better for deeply nested logic",
      "Forgetting to pass through extra props to the rendered element — the wrapper should spread unknown props",
    ],
    examples: [
      {
        title: "Mouse tracker — render prop",
        description: "Track the mouse position and let any consumer decide how to display it.",
        code: `import { useState } from 'react';

function MouseTracker({ render }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      style={{ height: '200px', border: '1px solid #ccc' }}
      onMouseMove={e => setPos({ x: e.clientX, y: e.clientY })}
    >
      {render(pos)}
    </div>
  );
}

// Usage — consumer decides what to show
function App() {
  return (
    <MouseTracker
      render={({ x, y }) => (
        <p>Mouse at ({x}, {y})</p>
      )}
    />
  );
}`,
        language: "jsx",
      },
      {
        title: "Children as a function",
        description: "The same pattern using children instead of a named render prop.",
        code: `import { useState } from 'react';

function Toggle({ children }) {
  const [on, setOn] = useState(false);
  return <>{children({ on, toggle: () => setOn(o => !o })}</>;
}

// Usage
function App() {
  return (
    <Toggle>
      {({ on, toggle }) => (
        <div>
          <button onClick={toggle}>{on ? 'Hide' : 'Show'}</button>
          {on && <p>Now you see me!</p>}
        </div>
      )}
    </Toggle>
  );
}`,
        language: "jsx",
      },
      {
        title: "Modern hook equivalent",
        description: "The same Toggle logic as a hook — no extra component in the tree.",
        code: `import { useState } from 'react';

function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn(o => !o);
  return { on, toggle };
}

function App() {
  const { on, toggle } = useToggle();
  return (
    <div>
      <button onClick={toggle}>{on ? 'Hide' : 'Show'}</button>
      {on && <p>Now you see me!</p>}
    </div>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
