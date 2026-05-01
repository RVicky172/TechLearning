import type { TopicNode } from "@/data/types";

export const props: TopicNode = {
  id: "react-props",
  title: "Props & Data Flow",
  iconName: "ArrowRightLeft",
  link: "https://react.dev/learn/passing-props-to-a-component",
  theory:
    "Props are how you pass data from a parent component to a child component. They are immutable and flow in only one direction (downward). React enforces this constraint to make your data flow transparent — you always know where state comes from and how it gets updated.",
  theoryDetail: {
    keyConcepts: [
      "Props are read-only — a component should never modify its own props directly",
      "Destructure props in the function signature for clarity and to reference them by name",
      "children is a special built-in prop for passing nested JSX content between opening and closing tags",
      "Props can be any JavaScript value: strings, numbers, booleans, objects, functions, or React elements",
    ],
    whyItMatters:
      "Unidirectional data flow makes bugs easier to trace — you always know where state originates and how it propagates down the tree. This makes large applications easier to reason about and debug.",
    commonPitfalls: [
      "Prop drilling more than 2–3 levels deep — switch to Context API or state management for global state",
      "Passing new object/array literals as props (e.g., style={{}} or options={[...]}) defeating memoization optimizations",
      "Using props for values that should be local component state — props are for external data",
      "Assuming prop changes trigger updates without understanding that props are only checked on render",
    ],
    examples: [
      {
        title: "Basic Props Passing",
        description: "Pass data from parent to child via props.",
        code: `function Parent() {
  return <Child name="Alice" age={30} />;
}

function Child({ name, age }) {
  return <p>{name} is {age} years old</p>;
}`,
        language: "jsx",
      },
      {
        title: "Props with Default Values",
        description: "Use default parameters to provide fallback values.",
        code: `function UserCard({ name = "Guest", role = "User" }) {
  return (
    <div>
      <h3>{name}</h3>
      <p>Role: {role}</p>
    </div>
  );
}

// Call with some or all props
<UserCard />  // Uses defaults
<UserCard name="Bob" />  // name from props, role defaults`,
        language: "jsx",
      },
      {
        title: "Children Prop",
        description: "The children prop lets you pass JSX elements as content.",
        code: `function Container({ children, title }) {
  return (
    <div style={{border: '1px solid blue', padding: '10px'}}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}

// Usage
<Container title="My Content">
  <p>This paragraph is passed as children</p>
  <button>Click me</button>
</Container>`,
        language: "jsx",
      },
      {
        title: "Event Handler Props",
        description: "Pass functions as props to handle child events.",
        code: `function Parent() {
  const handleClick = () => console.log("Button clicked!");
  
  return <Child onButtonClick={handleClick} />;
}

function Child({ onButtonClick }) {
  return <button onClick={onButtonClick}>Click</button>;
}`,
        language: "jsx",
      },
    ],
  },
};
