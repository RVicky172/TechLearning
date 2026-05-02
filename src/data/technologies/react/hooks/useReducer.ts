import type { TopicNode } from "@/data/types";

export const hookUseReducer: TopicNode = {
  id: "hook-usereducer",
  title: "useReducer",
  iconName: "GitMerge",
  link: "https://react.dev/reference/react/useReducer",
  theory:
    "useReducer is an alternative to useState for managing complex state logic. You describe every possible state change as an action object, and a pure reducer function handles each case — identical to the Redux pattern, built into React.",
  theoryDetail: {
    keyConcepts: [
      "useReducer(reducer, initialState) returns [state, dispatch] — dispatch sends action objects to the reducer",
      "The reducer must be a pure function: (state, action) => newState — never mutate state inside it",
      "Prefer useReducer over useState when next state depends on previous in multiple ways, or when several sub-values update together",
      "Actions are plain objects with a type field by convention — the type string describes what happened",
    ],
    whyItMatters:
      "useReducer centralises state transitions into one predictable function, making complex state flows easy to read, test in isolation, and debug. It's the right tool when useState requires multiple interdependent setters or when state logic starts spreading across event handlers.",
    commonPitfalls: [
      "Mutating the state object inside the reducer — always return a new object/array",
      "Putting async logic inside the reducer — dispatch is synchronous; handle async outside then dispatch the result",
      "Over-using useReducer for simple boolean flags — useState is simpler and more readable for single values",
      "Forgetting to handle unknown action types — add a default case that returns state unchanged",
    ],
    examples: [
      {
        title: "Shopping cart reducer",
        description: "Add, remove and clear items from a cart using typed actions.",
        code: `import { useReducer } from 'react';

const initialState = { items: [], total: 0 };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        items: [...state.items, action.item],
        total: state.total + action.item.price,
      };
    case 'REMOVE_ITEM':
      const removed = state.items.find(i => i.id === action.id);
      return {
        items: state.items.filter(i => i.id !== action.id),
        total: state.total - (removed?.price ?? 0),
      };
    case 'CLEAR':
      return initialState;
    default:
      return state;
  }
}

function Cart() {
  const [cart, dispatch] = useReducer(cartReducer, initialState);

  return (
    <div>
      <p>Items: {cart.items.length} — Total: \${cart.total}</p>
      <button onClick={() => dispatch({ type: 'ADD_ITEM',
          item: { id: 1, name: 'Book', price: 12 } })}>
        Add Book
      </button>
      <button onClick={() => dispatch({ type: 'CLEAR' })}>
        Clear cart
      </button>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Form validation state",
        description: "Manage a multi-field form with validation errors as a reducer.",
        code: `import { useReducer } from 'react';

const init = { values: { email: '', password: '' }, errors: {}, submitted: false };

function formReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, values: { ...state.values, [action.field]: action.value },
               errors: { ...state.errors, [action.field]: '' } };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.field]: action.message } };
    case 'SUBMIT':
      return { ...state, submitted: true };
    default:
      return state;
  }
}

function SignupForm() {
  const [form, dispatch] = useReducer(formReducer, init);

  const submit = (e) => {
    e.preventDefault();
    if (!form.values.email.includes('@'))
      return dispatch({ type: 'SET_ERROR', field: 'email', message: 'Invalid email' });
    dispatch({ type: 'SUBMIT' });
  };

  return (
    <form onSubmit={submit}>
      <input value={form.values.email}
             onChange={e => dispatch({ type: 'SET_FIELD', field: 'email', value: e.target.value })}
             placeholder="Email" />
      {form.errors.email && <span>{form.errors.email}</span>}
      <button type="submit">Sign up</button>
    </form>
  );
}`,
        language: "jsx",
      },
    ],
  },
};
