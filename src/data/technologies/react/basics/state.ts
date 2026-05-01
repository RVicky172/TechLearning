import type { TopicNode } from "@/data/types";

export const state: TopicNode = {
  id: "react-state",
  title: "State & Hooks",
  iconName: "RefreshCw",
  link: "https://react.dev/learn/state-a-components-memory",
  theory:
    "State is a component's memory. The useState hook lets you add state to function components, tracking values that persist between renders and triggering re-renders when updated. State is local to each component instance — each component gets its own independent state.",
  theoryDetail: {
    keyConcepts: [
      "useState returns an array: [currentValue, setValue] — the setter updates the value and triggers a re-render",
      "State updates are asynchronous and batched — multiple state updates in an event handler are combined into a single re-render",
      "Each component instance has its own isolated state — state doesn't get shared between multiple instances of the same component",
      "State initializer functions run only on the first render — pass a function to useState for expensive computations",
    ],
    whyItMatters:
      "State is what transforms static HTML into interactive applications. Every user interaction that changes the UI involves updating some piece of state. Understanding how state works is essential to building React applications.",
    commonPitfalls: [
      "Mutating state directly (array.push(), object.prop = value) — always return a new value with setState",
      "Reading state immediately after calling the setter — updates are asynchronous, the old value is still current",
      "Storing derived or computed values in state — compute them on render instead, or cache with useMemo",
      "Creating unnecessary state — if a value can be computed or comes from props, don't make it state",
    ],
    examples: [
      {
        title: "Counter Component",
        description: "Simple example of state changing based on user interaction.",
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Form Input State",
        description: "Track multiple form inputs in state.",
        code: `import { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}`,
        language: "jsx",
      },
      {
        title: "Array State Operations",
        description: "Correctly update array state by creating new arrays.",
        code: `import { useState } from 'react';

function TodoList() {
  const [todos, setTodos] = useState([]);
  
  const addTodo = (text) => {
    // ✅ Correct: create a new array
    setTodos([...todos, { id: Date.now(), text }]);
  };
  
  const removeTodo = (id) => {
    // ✅ Correct: filter to create new array
    setTodos(todos.filter(t => t.id !== id));
  };
  
  const updateTodo = (id, newText) => {
    // ✅ Correct: map to create new array
    setTodos(todos.map(t =>
      t.id === id ? { ...t, text: newText } : t
    ));
  };
  
  return <div>{todos.map(t => <p key={t.id}>{t.text}</p>)}</div>;
}`,
        language: "jsx",
      },
      {
        title: "Lazy Initialization",
        description: "Use function form of useState for expensive calculations.",
        code: `import { useState } from 'react';

function ExpensiveComponent({ initialData }) {
  // The function runs only on first render
  const [data, setData] = useState(() => {
    console.log('Computing initial state...');
    return processLargeDataset(initialData);
  });
  
  return <div>{data}</div>;
}`,
        language: "jsx",
      },
    ],
  },
};
