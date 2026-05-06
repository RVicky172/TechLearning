import type { TopicNode } from "@/data/types";

export const forms: TopicNode = {
  id: "react-forms",
  title: "Forms & Controlled Inputs",
  iconName: "FormInput",
  demoComponentKey: "reactForms",
  link: "https://react.dev/learn/reacting-to-input-with-state",
  theory:
    "A controlled input is one whose value is driven by React state. The component owns the value, and every keystroke calls a handler that updates state, which flows back into the input. This makes the state the single source of truth, enabling validation, formatting, and programmatic clearing at any time.",
  theoryDetail: {
    keyConcepts: [
      "Controlled: value={state} + onChange={handler} — React state is the source of truth",
      "Uncontrolled: ref={inputRef} — DOM is the source of truth; read value imperatively via ref.current.value",
      "Always call e.preventDefault() on form onSubmit to stop the browser's native page reload",
      "For checkboxes and radio buttons use checked={state} instead of value={state}",
    ],
    whyItMatters:
      "Controlled inputs let you validate in real-time, format as the user types, enforce character limits, and reset programmatically. They're essential for any form that requires more than just reading a value on submit.",
    commonPitfalls: [
      "Setting value without an onChange handler — React makes the input read-only and logs a warning",
      "Using defaultValue when you meant value — defaultValue only sets the initial value and is then uncontrolled",
      "Not preventing default form submission — causes a full page reload that loses all React state",
      "Storing each field in separate useState calls — consider useReducer or a form library (React Hook Form) for large forms",
    ],
    examples: [
      {
        title: "Controlled text input",
        description: "State owns the value; every keystroke updates state, re-renders the input.",
        code: `import { useState } from 'react';

function NameInput() {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
      />
      <p>Hello, {name || 'stranger'}!</p>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Multi-field form with validation",
        description: "Track multiple fields and validate before submitting.",
        code: `import { useState } from 'react';

function SignupForm() {
  const [form,   setForm]   = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const update = field => e =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.email.includes('@'))    errs.email    = 'Invalid email';
    if (form.password.length < 8)     errs.password = 'Min 8 characters';
    return errs;
  };

  const submit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) return setErrors(errs);
    console.log('Submitted:', form);
  };

  return (
    <form onSubmit={submit}>
      <input value={form.email}    onChange={update('email')}    placeholder="Email" />
      {errors.email    && <span>{errors.email}</span>}
      <input value={form.password} onChange={update('password')} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password}</span>}
      <button type="submit">Sign up</button>
    </form>
  );
}`,
        language: "jsx",
      },
      {
        title: "Checkbox and select",
        description: "Use checked for checkboxes; handle select with value like any text input.",
        code: `import { useState } from 'react';

function Preferences() {
  const [agreed, setAgreed]   = useState(false);
  const [plan,   setPlan]     = useState('free');

  return (
    <form>
      <label>
        <input type="checkbox"
               checked={agreed}
               onChange={e => setAgreed(e.target.checked)} />
        I agree to the terms
      </label>

      <select value={plan} onChange={e => setPlan(e.target.value)}>
        <option value="free">Free</option>
        <option value="pro">Pro</option>
        <option value="enterprise">Enterprise</option>
      </select>

      <p>Plan: {plan} | Agreed: {agreed ? 'yes' : 'no'}</p>
    </form>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
