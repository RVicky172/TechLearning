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
        title: "Button Click Handler",
        description: "Respond to a click event.",
        code: `function Button() {
  const handleClick = () => {
    console.log('Button clicked!');
  };
  
  return <button onClick={handleClick}>Click me</button>;
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
        title: "Multiple Event Handlers",
        description: "Handle multiple events on the same element.",
        code: `function Input() {
  const handleChange = (e) => {
    console.log('Value changed:', e.target.value);
  };
  
  const handleFocus = () => {
    console.log('Input focused');
  };
  
  const handleBlur = () => {
    console.log('Input blurred');
  };
  
  return (
    <input
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}`,
        language: "jsx",
      },
      {
        title: "Event Delegation",
        description: "Handle events from multiple child elements.",
        code: `function List() {
  const handleItemClick = (e) => {
    // e.target is the clicked element
    if (e.target.dataset.id) {
      console.log('Clicked item:', e.target.dataset.id);
    }
  };
  
  return (
    <ul onClick={handleItemClick}>
      <li data-id="1">Item 1</li>
      <li data-id="2">Item 2</li>
      <li data-id="3">Item 3</li>
    </ul>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
