import type { TopicNode } from "@/data/types";

export const hookUseEffect: TopicNode = {
  id: "hook-useeffect",
  title: "useEffect",
  iconName: "Zap",
  demoComponentKey: "useEffect",
  link: "https://react.dev/reference/react/useEffect",
  theory:
    "useEffect synchronises a component with an external system — an API, a WebSocket, a timer, browser storage, or any other side effect. It runs after the browser has painted the screen, making it safe for DOM reads and async operations.",
  theoryDetail: {
    keyConcepts: [
      "useEffect(setup, [deps]) — runs setup after every render where at least one dep changed",
      "[] as deps → run once after mount; omitting deps → run after every render",
      "Return a cleanup function from setup to cancel subscriptions, clear timers, or abort fetches on unmount",
      "React 18 Strict Mode intentionally mounts → unmounts → remounts in dev to surface missing cleanups",
    ],
    whyItMatters:
      "Without effects, components are pure render functions that can't interact with the world outside React. Effects bridge that gap — data fetching, event listeners, third-party integrations all live here. Correct cleanup prevents memory leaks and ghost state updates.",
    commonPitfalls: [
      "Missing dependencies causing stale closure bugs — the effect captures old state and never updates",
      "Updating state unconditionally inside an effect causing an infinite loop",
      "Fetching without AbortController — response arrives after unmount and updates a stale component",
      "Object/function literals in the dependency array — new references each render cause the effect to re-run infinitely",
    ],
    examples: [
      {
        title: "UseEffectDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseEffectDemo.tsx",
        code: `import { useEffect, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseEffectDemo() {
  const renderCount = useRenderCount()
  const [clicks, setClicks] = useState(0)
  const [enabled, setEnabled] = useState(true)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    document.title = \`Hooks clicks: \${clicks}\`
  }, [clicks])

  useEffect(() => {
    if (!enabled) {
      return
    }

    const intervalId = window.setInterval(() => {
      setSeconds((value) => value + 1)
    }, 1000)

    // Cleanup runs before this effect runs again and when component unmounts.
    return () => {
      window.clearInterval(intervalId)
    }
  }, [enabled])

  return (
    <article>
      <h2>useEffect</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>One effect updates document title. Another effect starts and cleans an interval.</p>
      <div className="row">
        <button type="button" onClick={() => setClicks((value) => value + 1)}>
          Update title ({clicks})
        </button>
        <button type="button" onClick={() => setEnabled((value) => !value)}>
          {enabled ? 'Stop timer' : 'Start timer'}
        </button>
      </div>
      <p className="muted">Timer seconds: {seconds}</p>
      <p className="muted">Dependency array [enabled] means this timer effect runs only when enabled changes.</p>
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
