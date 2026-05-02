import type { TopicNode } from "@/data/types";

export const events: TopicNode = {
  id: "react-events",
  title: "Event Handling",
  iconName: "MousePointerClick",
  link: "https://react.dev/learn/responding-to-events",
  theory:
    "React event handlers are functions that respond to user interactions like clicks, form submissions, and keyboard input. React uses a unified synthetic event system that wraps native browser events, ensuring consistent behavior across all browsers. Always pass event handlers as function references (not invoked with parentheses).",
  theoryDetail: {
    keyConcepts: [
      "Pass event handlers as props: onClick={handleClick}, not onClick={handleClick()} — the latter calls immediately",
      "Event handler names are conventionally camelCase: onClick, onChange, onSubmit, onKeyDown, etc.",
      "e.preventDefault() stops default browser actions like form submission or link navigation",
      "e.stopPropagation() prevents the event from bubbling up to parent handlers",
    ],
    whyItMatters:
      "Event handling connects your component logic to user interactions. React's unified synthetic event system means the same code works reliably across all browsers, eliminating cross-browser compatibility headaches.",
    commonPitfalls: [
      "Calling the handler immediately by adding (): onClick={handleClick()} creates a new function on every render",
      "Forgetting e.preventDefault() on form submissions causing unexpected full page reloads",
      "Not passing the event object when you need it: onClick={(e) => handleClick(e)}, not onClick={handleClick}",
      "Manually adding addEventListener instead of using React props — these cause memory leaks when not cleaned up",
    ],
    examples: [
      {
        title: "Button with loading state — async event handler",
        description: "A realistic click handler that disables the button during an async operation and handles errors.",
        code: `function SaveButton({ onSave }) {
  const [status, setStatus] = useState('idle'); // 'idle' | 'saving' | 'error'

  const handleClick = async () => {
    setStatus('saving');
    try {
      await onSave();
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  };

  return (
    <button onClick={handleClick} disabled={status === 'saving'}>
      {status === 'saving' ? 'Saving\u2026' : status === 'error' ? 'Retry' : 'Save'}
    </button>
  );
}`,
        language: "jsx",
      },
      {
        title: "Passing Arguments to Handlers",
        description: "Use arrow functions to pass data to event handlers.",
        code: `function TodoItem({ id, text, onDelete }) {
  const handleDelete = () => {
    onDelete(id);
  };
  
  // Or inline with arrow function:
  return (
    <li>
      {text}
      <button onClick={() => onDelete(id)}>Delete</button>
    </li>
  );
}`,
        language: "jsx",
      },
      {
        title: "Form Submission",
        description: "Prevent default form behavior and handle submission.",
        code: `function Form() {
  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent page reload
    const formData = new FormData(e.target);
    console.log('Form data:', Object.fromEntries(formData));
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" />
      <input type="email" name="email" placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
}`,
        language: "jsx",
      },
      {
        title: "Keyboard events — onKeyDown",
        description: "Handle keyboard shortcuts and navigate lists accessibly with onKeyDown.",
        code: `function SearchInput({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch(query);
    }
    if (e.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <input
      type="search"
      value={query}
      placeholder="Press Enter to search, Esc to clear"
      onChange={e => setQuery(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  );
}`,
        language: "jsx",
      },
      {
        title: "Stopping propagation",
        description: "Use e.stopPropagation() to prevent a child event from triggering a parent handler.",
        code: `function SelectableCard({ id, onSelect, children }) {
  return (
    <div className="card" onClick={() => onSelect(id)}>
      {children}

      {/* Without stopPropagation, clicking Delete would also fire onSelect */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(id);
        }}
      >
        Delete
      </button>
    </div>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
