import type { TopicNode } from "@/data/types";

export const patterns: TopicNode = {
  id: "react-patterns",
  title: "Component Patterns",
  iconName: "PuzzlePiece",
  link: "https://react.dev/learn/reusing-logic-with-custom-hooks",
  theory:
    "Advanced patterns for sharing logic and building flexible components. Custom hooks encapsulate stateful logic and make it reusable. Compound components use Context to share implicit state for flexible composition. The 'as' prop pattern lets consumers control which HTML element is rendered.",
  theoryDetail: {
    keyConcepts: [
      "Custom hooks are functions starting with 'use' that encapsulate reusable stateful logic — you can use other hooks inside them",
      "Compound components share implicit state via Context, providing flexibility for customization",
      "The 'as' prop pattern lets consumers control the rendered HTML element (button, a, div, etc.)",
      "These patterns reduce code duplication and make components more composable",
    ],
    whyItMatters:
      "Patterns enable sharing behavior across components without duplicating code. Custom hooks replaced higher-order components as React's primary reuse mechanism, and they're easier to reason about.",
    commonPitfalls: [
      "Creating hook abstractions too early — duplicate first, then extract when the pattern is clear",
      "Compound components that are too rigid — expose escape hatches and context for customization",
      "Mixing rendering logic into custom hooks making them harder to test in isolation",
      "Creating too many hooks — keep the number of abstractions manageable",
    ],
    examples: [
      {
        title: "Custom Hook Example",
        description: "Extract reusable stateful logic into a custom hook.",
        code: `import { useState, useCallback } from 'react';

function useFormInput(initialValue = '') {
  const [value, setValue] = useState(initialValue);
  
  const bind = {
    value,
    onChange: (e) => setValue(e.target.value),
  };
  
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);
  
  return [value, bind, reset];
}

// Usage in multiple components
function LoginForm() {
  const [email, emailBind, resetEmail] = useFormInput('');
  const [password, passBind, resetPass] = useFormInput('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email, password);
    resetEmail();
    resetPass();
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input {...emailBind} type="email" />
      <input {...passBind} type="password" />
      <button type="submit">Login</button>
    </form>
  );
}`,
        language: "jsx",
      },
      {
        title: "Compound Components",
        description: "Components that work together with shared implicit state.",
        code: `import { createContext, useContext, useState } from 'react';

const MenuContext = createContext();

function Menu({ children }) {
  const [open, setOpen] = useState(false);
  
  return (
    <MenuContext.Provider value={{ open, setOpen }}>
      <div>{children}</div>
    </MenuContext.Provider>
  );
}

function MenuTrigger({ children }) {
  const { setOpen } = useContext(MenuContext);
  return <button onClick={() => setOpen(o => !o)}>{children}</button>;
}

function MenuContent({ children }) {
  const { open } = useContext(MenuContext);
  return open ? <div>{children}</div> : null;
}

// Usage - very flexible
<Menu>
  <MenuTrigger>Options</MenuTrigger>
  <MenuContent>
    <p>Option 1</p>
    <p>Option 2</p>
  </MenuContent>
</Menu>`,
        language: "jsx",
      },
      {
        title: "The 'as' Prop Pattern",
        description: "Let consumers control the rendered HTML element.",
        code: `function Button({ as: Component = 'button', ...props }) {
  return <Component {...props} className="btn" />;
}

// Rendered as <button>Click</button>
<Button>Click</Button>

// Rendered as <a href="/">Link</a>
<Button as="a" href="/">Link</Button>

// Rendered as custom component <CustomButton>Text</CustomButton>
<Button as={CustomButton}>Custom</Button>`,
        language: "jsx",
      },
      {
        title: "useAsync Hook",
        description: "Encapsulate async data fetching logic in a reusable hook.",
        code: `import { useState, useEffect } from 'react';

function useAsync(fn, deps) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  
  useEffect(() => {
    let isMounted = true;
    
    (async () => {
      try {
        const data = await fn();
        if (isMounted) {
          setState({ loading: false, data, error: null });
        }
      } catch (error) {
        if (isMounted) {
          setState({ loading: false, data: null, error });
        }
      }
    })();
    
    return () => {
      isMounted = false;
    };
  }, deps);
  
  return state;
}

// Usage
function User({ id }) {
  const { loading, data: user, error } = useAsync(
    () => fetch(\`/api/users/\${id}\`).then(r => r.json()),
    [id]
  );
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <div>{user.name}</div>;
}`,
        language: "jsx",
      },
    ],
  },
};
