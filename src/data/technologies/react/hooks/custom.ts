import type { TopicNode } from "@/data/types";

export const hookCustom: TopicNode = {
  id: "hook-custom",
  title: "Custom Hooks",
  iconName: "Package",
  demoComponentKey: "createCustomHookGuide",
  link: "https://react.dev/learn/reusing-logic-with-custom-hooks",
  theory:
    "A custom hook is a plain JavaScript function whose name starts with 'use' and that calls one or more built-in hooks. They are the primary mechanism for extracting and sharing stateful logic between components — without adding components to the tree or changing component hierarchy.",
  theoryDetail: {
    keyConcepts: [
      "Name must start with 'use' — React's linter uses this convention to enforce rules of hooks",
      "Each component that calls the same custom hook gets its own isolated state — the hook is not a singleton",
      "Custom hooks can call other custom hooks — you can compose layers of abstraction",
      "They return whatever is useful: a value, a tuple, an object, or nothing — there is no forced API shape",
    ],
    whyItMatters:
      "Without custom hooks, stateful logic has to live directly in components or be duplicated. Custom hooks let you co-locate related state, effects, and handlers under a descriptive name, then reuse that bundle across many components — the same way utility functions share pure logic.",
    commonPitfalls: [
      "Putting custom hooks inside component bodies — they must be defined at module level, not inside another function",
      "Calling hooks conditionally inside the custom hook — all hooks must be called unconditionally on every render",
      "Returning unstable references (new objects/arrays each call) — memoize return values if consumers pass them to effects",
      "Making a custom hook too generic too early — extract only when duplication is clear and the abstraction boundary is obvious",
    ],
    examples: [
      {
        title: "CreateCustomHookGuide.tsx",
        description: "Exact source from react/src/components/hooks/CreateCustomHookGuide.tsx",
        code: `import { useCounter } from '../../hooks/useCounter'

export function CreateCustomHookGuide() {
  const likes = useCounter(10)

  return (
    <article>
      <h2>How To Create A Custom Hook</h2>
      <p className="render-badge">useRenderCount (inside useCounter): {likes.renderCount}</p>
      <p className="muted">This number is displayed in UI from the custom hook return value.</p>
      <p>Custom hooks are regular functions that start with use and can call other hooks.</p>
      <ol>
        <li>Create a function named with use prefix.</li>
        <li>Move repeated stateful logic into that function.</li>
        <li>Return data and actions to consuming components.</li>
        <li>Reuse it in multiple UI components.</li>
      </ol>

      <div className="row">
        <button type="button" onClick={likes.decrement}>
          -
        </button>
        <strong>{likes.count}</strong>
        <button type="button" onClick={likes.increment}>
          +
        </button>
        <button type="button" onClick={likes.reset}>
          Reset
        </button>
      </div>

      <p className="muted">This output uses the reusable useCounter custom hook.</p>
    </article>
  )
}`,
        language: "tsx",
      },
      {
        title: "useCounter.ts",
        description: "Exact source from react/src/hooks/useCounter.ts",
        code: `import { useCallback, useState } from 'react'
import { useRenderCount } from './useRenderCount'

export function useCounter(initialValue = 0) {
  const renderCount = useRenderCount()
  const [count, setCount] = useState(initialValue)

  const increment = useCallback(() => setCount((value) => value + 1), [])
  const decrement = useCallback(() => setCount((value) => value - 1), [])
  const reset = useCallback(() => setCount(initialValue), [initialValue])

  return {
    renderCount,
    count,
    increment,
    decrement,
    reset,
  }
}`,
        language: "ts",
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
