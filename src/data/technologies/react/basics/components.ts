import type { TopicNode } from "@/data/types";

export const components: TopicNode = {
  id: "react-components",
  title: "Components & JSX",
  iconName: "Layers",
  link: "https://react.dev/learn/your-first-component",
  theory:
    "Components are JavaScript functions that return JSX — a syntax extension that looks like HTML but compiles to React.createElement() calls. JSX makes component code more readable and closely mirrors the HTML you're describing. React treats component names as special: uppercase names are components, lowercase names are HTML elements.",
  theoryDetail: {
    keyConcepts: [
      "JSX compiles to React.createElement(Component, props, children) — the HTML-like syntax is just sugar",
      "Component names must be PascalCase (uppercase first letter); lowercase names are treated as HTML tags",
      "Return a single root element — use fragments <> to wrap multiple children without adding an extra DOM node",
      "JSX is evaluated as expressions, so you can use them inside arrays, conditionals, and variables",
    ],
    whyItMatters:
      "Components are the fundamental building block of React. JSX's HTML-like syntax makes your code intuitive even for non-programmers. Treating components as reusable functions lets you compose complex UIs from simple pieces and test them independently.",
    commonPitfalls: [
      "Using lowercase for component names — React will render them as HTML tags and ignore them as components",
      "Returning multiple sibling elements without a wrapper; React needs a single root (use <> fragments)",
      "Embedding complex logic or state management directly in JSX — extract to variables or custom hooks",
      "Creating components inside other components — this causes them to be redefined on every render, losing state",
    ],
    examples: [
      {
        title: "Basic Component with JSX",
        description: "A simple component returning JSX markup.",
        code: `function Button() {
  return <button className="px-4 py-2 bg-blue-500 text-white rounded">
    Click me
  </button>;
}`,
        language: "jsx",
      },
      {
        title: "JSX with Expressions",
        description: "Using curly braces to embed JavaScript expressions inside JSX.",
        code: `function Greeting({ name, age }) {
  const isAdult = age >= 18;
  
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old</p>
      <p>Status: {isAdult ? "Adult" : "Minor"}</p>
      <p>Random: {Math.random()}</p>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Fragments to Avoid Extra DOM Nodes",
        description: "Use <> to wrap multiple elements without adding a wrapper div.",
        code: `function List() {
  return (
    <>
      <h2>Items:</h2>
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </>
  );
}

// This avoids creating an unnecessary <div> wrapper`,
        language: "jsx",
      },
    ],
  },
};
