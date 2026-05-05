import type { TopicNode } from "@/data/types";

export const hookUseRef: TopicNode = {
  id: "hook-useref",
  title: "useRef",
  iconName: "Anchor",
  demoComponentKey: "useRef",
  link: "https://react.dev/reference/react/useRef",
  theory:
    "useRef returns a mutable container object { current: value } that persists across renders without causing re-renders when changed. It has two distinct uses: holding a reference to a DOM node, and storing any mutable value that should survive re-renders but doesn't need to trigger them.",
  theoryDetail: {
    keyConcepts: [
      "ref.current is the raw DOM node after the element mounts — available inside effects and event handlers",
      "Changing ref.current does NOT trigger a re-render — it's a plain JS object, not reactive state",
      "Pass ref={myRef} to any JSX element to attach it; React sets ref.current on mount and null on unmount",
      "Common use-cases: focus management, scroll control, storing previous values, caching timer IDs",
    ],
    whyItMatters:
      "Some DOM interactions (focus, scroll, measuring dimensions, playing media) require a direct reference to the element and can't be expressed declaratively. useRef also solves the stale-closure problem for mutable values that effects need but shouldn't react to.",
    commonPitfalls: [
      "Reading ref.current during render — refs are not reactive; the value may be null or stale before mount",
      "Using useRef for values that should cause re-renders — use useState or useReducer for those",
      "Forgetting that ref.current is null until after the first commit — always guard inside effects or handlers",
      "Storing JSX or computed values in refs instead of derived state or memoized values",
    ],
    examples: [
      {
        title: "UseRefDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseRefDemo.tsx",
        code: `import { useRef, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseRefDemo() {
  const renderCount = useRenderCount()
  const [draft, setDraft] = useState('React refs are useful for imperative DOM access.')
  const [lastRead, setLastRead] = useState('Nothing read yet.')
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <article>
      <h2>useRef</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Use state for reactive UI, and useRef when you need direct access to the input element.</p>
      <input
        ref={inputRef}
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Type here"
      />
      <div className="row">
        <button type="button" onClick={() => inputRef.current?.focus()}>
          Focus input
        </button>
        <button
          type="button"
          onClick={() => {
            if (!inputRef.current) {
              return
            }
            inputRef.current.value = draft.toUpperCase()
            inputRef.current.focus()
          }}
        >
          Modify with ref
        </button>
        <button
          type="button"
          onClick={() => {
            setLastRead(inputRef.current?.value ?? 'Input is not available.')
          }}
        >
          Read current value
        </button>
        <button
          type="button"
          onClick={() => {
            if (!inputRef.current) {
              return
            }
            setDraft(inputRef.current.value)
          }}
        >
          Sync ref to state
        </button>
      </div>
      <p className="muted">Last value read from ref: {lastRead}</p>
      <p className="muted">
        "Modify with ref" changes the DOM value directly. "Sync ref to state" copies that value back
        into React state.
      </p>
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
