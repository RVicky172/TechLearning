import type { TopicNode } from "@/data/types";

export const forwardRef: TopicNode = {
  id: "react-forwardref",
  title: "forwardRef",
  iconName: "Unplug",
  link: "https://react.dev/reference/react/forwardRef",
  theory:
    "By default, refs don't pass through function components — you can't put ref={myRef} on a custom component and expect it to attach to a DOM node inside. React.forwardRef() wraps a component to explicitly forward an incoming ref to an internal element, enabling parent components to directly access a child's DOM node.",
  theoryDetail: {
    keyConcepts: [
      "forwardRef((props, ref) => JSX) — the second argument is the ref forwarded from the parent",
      "Attach the forwarded ref to any DOM element or another forwardRef component",
      "useImperativeHandle(ref, () => ({ method }), [deps]) — expose a custom object instead of the raw DOM node",
      "Without forwardRef, placing ref on a custom component logs a warning and ref.current stays null",
    ],
    whyItMatters:
      "Design system components (Input, Select, Dialog) need to accept refs so consumers can programmatically focus, scroll, or measure them. Without forwardRef, library users can't control your components — they're forced to wrap them in a DOM element, adding unnecessary markup.",
    commonPitfalls: [
      "Forgetting to forward the ref in a HOC wrapping a forwardRef component — the HOC intercepts the ref",
      "Exposing the entire DOM node via useImperativeHandle when only focus() is needed — leaks implementation details",
      "Using forwardRef when a callback prop would be simpler — only use it when ref semantics (DOM access) are genuinely needed",
    ],
    examples: [
      {
        title: "Basic forwardRef input",
        description: "A custom Input component that lets parents focus it via a ref.",
        code: `import { forwardRef, useRef } from 'react';

// The component receives ref as the second argument
const Input = forwardRef(function Input({ label, ...props }, ref) {
  return (
    <label>
      {label}
      <input ref={ref} {...props} />
    </label>
  );
});

// Parent can now focus the input directly
function Form() {
  const inputRef = useRef(null);

  return (
    <>
      <Input ref={inputRef} label="Email" type="email" />
      <button onClick={() => inputRef.current?.focus()}>
        Focus Email
      </button>
    </>
  );
}`,
        language: "jsx",
      },
      {
        title: "useImperativeHandle — expose a custom API",
        description: "Expose only specific methods rather than the raw DOM node.",
        code: `import { forwardRef, useImperativeHandle, useRef } from 'react';

const FancyInput = forwardRef(function FancyInput(props, ref) {
  const innerRef = useRef(null);

  // Expose a controlled API instead of the raw DOM node
  useImperativeHandle(ref, () => ({
    focus: () => innerRef.current?.focus(),
    clear: () => { if (innerRef.current) innerRef.current.value = ''; },
  }), []);

  return <input ref={innerRef} className="fancy-input" {...props} />;
});

function Parent() {
  const fancyRef = useRef(null);

  return (
    <>
      <FancyInput ref={fancyRef} placeholder="Type here" />
      <button onClick={() => fancyRef.current.focus()}>Focus</button>
      <button onClick={() => fancyRef.current.clear()}>Clear</button>
    </>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
