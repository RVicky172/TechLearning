import type { TopicNode } from "@/data/types";

export const reduxFundamentals: TopicNode = {
  id: "redux-fundamentals",
  title: "Fundamentals",
  iconName: "BookOpen",
  children: [
    {
      id: "redux-core-concepts",
      title: "Core Concepts",
      theory:
        "Redux is a predictable state container built on three principles: single source of truth, state is read-only, and changes are made with pure functions.",
      theoryDetail: {
        keyConcepts: [
          "Store — the single object holding the entire application state tree",
          "State — a plain JavaScript object describing the app at a given moment",
          "Action — a plain object with a required `type` field describing what happened",
          "Reducer — a pure function `(state, action) => newState` that computes the next state",
          "Dispatch — the only way to trigger a state change; sends an action to the store",
          "Selector — a function that reads or derives data from the current state",
        ],
        whyItMatters:
          "Centralising all state into a single predictable store makes every change traceable and reproducible. Redux DevTools' time-travel debugger lets you step forwards and backwards through the full action history.",
        commonPitfalls: [
          "Mutating state directly inside reducers instead of returning a new object",
          "Storing derived data (e.g. filtered lists) in the store instead of computing it in selectors",
          "Putting non-serialisable values (class instances, promises, functions) in the store",
        ],
        examples: [
          {
            title: "Vanilla Redux store",
            description: "Creating a store with a reducer, dispatching actions, and reading state.",
            code: `import { createStore } from "redux";

function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "counter/increment":
      return { count: state.count + 1 };
    case "counter/decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const store = createStore(counterReducer);

store.dispatch({ type: "counter/increment" });
store.dispatch({ type: "counter/increment" });
console.log(store.getState()); // { count: 2 }`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "redux-data-flow",
      title: "Unidirectional Data Flow",
      theory:
        "Redux enforces a strict one-way data flow: UI dispatches an action → middleware processes it → reducer computes new state → store notifies subscribers → UI re-renders.",
      theoryDetail: {
        keyConcepts: [
          "Action creators — factory functions that return action objects",
          "Middleware sits between dispatch and the reducer, enabling side-effects and async logic",
          "Subscribers (e.g. React-Redux) are notified synchronously after every dispatch",
        ],
        whyItMatters:
          "One-way flow makes the sequence of state changes completely predictable and easy to reproduce, a cornerstone of maintainable large-scale applications.",
        commonPitfalls: [
          "Dispatching actions inside reducers — causes infinite loops",
          "Triggering side effects (API calls, timers) directly inside reducers",
        ],
        comparisons: [
          {
            title: "Redux vs Context API",
            points: [
              "Redux provides DevTools with time-travel debugging; Context API has no equivalent",
              "Redux re-renders only components that read changed state via selectors; Context re-renders every consumer on any change",
              "Redux scales better for frequently-updated global state shared across many components",
              "Context API is the right choice for low-frequency updates such as theme or locale",
            ],
          },
        ],
      },
    },
    {
      id: "redux-immutability",
      title: "Immutability in Reducers",
      theory:
        "Reducers must never mutate the existing state object — always return a new one. Redux Toolkit's createSlice uses Immer internally so you can write apparent mutations safely.",
      theoryDetail: {
        keyConcepts: [
          "Structural sharing — unchanged branches of the state tree are reused by reference",
          "Immer — a library that lets you write mutating-style code while producing immutable updates",
          "Spread operator and array methods (map, filter, slice) for manual immutable updates",
        ],
        commonPitfalls: [
          "Calling `state.items.push()` in a vanilla reducer without Immer",
          "Returning `undefined` instead of `state` in the default switch case",
        ],
        examples: [
          {
            title: "Immutable update patterns",
            description: "Incorrect mutation vs correct spread vs Immer-powered RTK slice.",
            code: `// ❌ Mutation — Redux won't detect the change, UI won't update
function badReducer(state, action) {
  state.user.name = action.payload;
  return state;
}

// ✅ Spread — creates a new object at every level
function goodReducer(state, action) {
  return {
    ...state,
    user: { ...state.user, name: action.payload },
  };
}

// ✅ Immer (automatic with Redux Toolkit createSlice)
const userSlice = createSlice({
  name: "user",
  initialState: { user: { name: "" } },
  reducers: {
    setName(state, action) {
      state.user.name = action.payload; // safe — Immer intercepts this
    },
  },
});`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
