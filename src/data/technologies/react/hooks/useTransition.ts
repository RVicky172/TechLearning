import type { TopicNode } from "@/data/types";

export const hookUseTransition: TopicNode = {
  id: "hook-usetransition",
  title: "useTransition & useDeferredValue",
  iconName: "Timer",
  demoComponentKey: "useTransitionDeferred",
  link: "https://react.dev/reference/react/useTransition",
  theory:
    "React 18 introduced concurrent rendering — the ability to interrupt, pause and resume renders. useTransition and useDeferredValue are the two hooks that let you mark state updates as low-priority (non-urgent) so React can keep the UI responsive while the expensive update is in progress.",
  theoryDetail: {
    keyConcepts: [
      "useTransition() returns [isPending, startTransition] — wrap slow state updates in startTransition to mark them non-urgent",
      "useDeferredValue(value) returns a version of the value that lags behind during high-priority updates, useful for derived expensive renders",
      "While a transition is pending, the old UI stays visible — React renders the new state in the background",
      "startTransition cannot wrap async code — it must be synchronous; useTransition is for state updates you control",
    ],
    whyItMatters:
      "Before React 18, every state update was treated equally — a slow render would block typing, clicking, and scrolling. useTransition lets you tell React 'this update can wait' so interaction stays smooth even when re-rendering a huge list or complex chart.",
    commonPitfalls: [
      "Wrapping async fetches in startTransition — it only works with synchronous state updates; combine with Suspense for async",
      "Using transitions for every update — reserve them for genuinely slow renders; they add complexity otherwise",
      "Expecting isPending to show while the transition renders on screen — it only covers the time until React starts committing",
    ],
    examples: [
      {
        title: "UseTransitionDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseTransitionDemo.tsx",
        code: `import { useState, useTransition } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseTransitionDemo() {
  const renderCount = useRenderCount()
  const [view, setView] = useState<'stats' | 'preview'>('stats')
  const [isPending, startTransition] = useTransition()

  return (
    <article>
      <h2>useTransition</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Marks view switches as low-priority updates.</p>
      <div className="row">
        <button type="button" onClick={() => startTransition(() => setView('stats'))}>
          Stats
        </button>
        <button type="button" onClick={() => startTransition(() => setView('preview'))}>
          Preview
        </button>
      </div>
      <p className="muted">{isPending ? 'Transitioning...' : \`Current: \${view}\`}</p>
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
