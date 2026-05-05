import type { TopicNode } from "@/data/types";

export const hookUseState: TopicNode = {
  id: "hook-usestate",
  title: "useState",
  iconName: "ToggleLeft",
  demoComponentKey: "useState",
  link: "https://react.dev/reference/react/useState",
  theory:
    "useState is the fundamental hook for adding local, reactive memory to a function component. Every call returns a stable [value, setter] pair — calling the setter schedules a re-render with the new value.",
  theoryDetail: {
    keyConcepts: [
      "useState(initialValue) — initialValue is only used on the first render; pass a function for lazy initialisation",
      "The setter can take a new value OR an updater function (prev => next) — always use the function form when the next value depends on the previous one",
      "State updates inside event handlers are batched in React 18+ — multiple setters cause only one re-render",
      "State is local and isolated — two instances of the same component each have their own independent state",
    ],
    whyItMatters:
      "State is what turns a static template into an interactive UI. Every click, input change, or async result that needs to appear on screen must be reflected in state. Getting useState right is the foundation for every other hook.",
    commonPitfalls: [
      "Mutating state directly (arr.push(), obj.key = val) — React won't detect the change; always return a new reference",
      "Reading state immediately after calling the setter — the new value isn't available until the next render",
      "Using the stale non-functional form: setCount(count + 1) inside async callbacks — use setCount(c => c + 1) instead",
      "Storing derived data in state — compute on render or memoize with useMemo instead",
    ],
    examples: [
      {
        title: "UseStateDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseStateDemo.tsx",
        code: `import { useState } from 'react'
import { useLocalStorageState } from '../../hooks/useLocalStorageState'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseStateDemo() {
  const renderCount = useRenderCount()
  const [count, setCount] = useState(0)
  const [note, setNote] = useLocalStorageState('hooks-note', 'Persistent note from custom hook')

  return (
    <article>
      <h2>useState</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Basic local state updates and reset.</p>
      <div className="row">
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Clicked: {count}
        </button>
        <button type="button" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
      <input value={note} onChange={(event) => setNote(event.target.value)} />
      <p className="muted">Saved by custom hook: useLocalStorageState</p>
    </article>
  )
}`,
        language: "tsx",
      },
      {
        title: "useLocalStorageState.ts",
        description: "Exact source from react/src/hooks/useLocalStorageState.ts",
        code: `import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'

export function useLocalStorageState<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const raw = localStorage.getItem(key)
    if (!raw) {
      return initialValue
    }
    try {
      return JSON.parse(raw) as T
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
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
