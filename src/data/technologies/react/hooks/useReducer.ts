import type { TopicNode } from "@/data/types";

export const hookUseReducer: TopicNode = {
  id: "hook-usereducer",
  title: "useReducer",
  iconName: "GitMerge",
  demoComponentKey: "useReducer",
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
        title: "UseReducerDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseReducerDemo.tsx",
        code: `import { useReducer, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

type Todo = { id: number; text: string; done: boolean }
type Action =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }

function reducer(state: Todo[], action: Action): Todo[] {
  switch (action.type) {
    case 'add':
      return [...state, { id: Date.now(), text: action.text, done: false }]
    case 'toggle':
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, done: !todo.done } : todo,
      )
    case 'remove':
      return state.filter((todo) => todo.id !== action.id)
    default:
      return state
  }
}

export function UseReducerDemo() {
  const renderCount = useRenderCount()
  const [input, setInput] = useState('')
  const [todos, dispatch] = useReducer(reducer, [
    { id: 1, text: 'Build reducer demo', done: true },
    { id: 2, text: 'Dispatch actions', done: false },
  ])

  return (
    <article>
      <h2>useReducer</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Actions manage list updates in one reducer.</p>
      <div className="row">
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Add task" />
        <button
          type="button"
          onClick={() => {
            if (!input.trim()) {
              return
            }
            dispatch({ type: 'add', text: input.trim() })
            setInput('')
          }}
        >
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => dispatch({ type: 'toggle', id: todo.id })}
              />
              <span>{todo.text}</span>
            </label>
            <button type="button" onClick={() => dispatch({ type: 'remove', id: todo.id })}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </article>
  )
}`,
        language: "tsx",
      },
      {
        title: "useRenderCount.ts",
        description: "Exact source from react/src/hooks/useRenderCount.ts",
        code: `import { useEffect, useId } from 'react'

const renderCountStore = new Map<string, number>()

export function useRenderCount() {
  const id = useId()
  const nextCount = (renderCountStore.get(id) ?? 0) + 1
  renderCountStore.set(id, nextCount)

  useEffect(() => {
    return () => {
      renderCountStore.delete(id)
    }
  }, [id])

  return nextCount
}`,
        language: "ts",
      },
    ],
  },
};
