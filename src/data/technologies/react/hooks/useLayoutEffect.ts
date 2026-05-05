import type { TopicNode } from "@/data/types";

export const hookUseLayoutEffect: TopicNode = {
  id: "hook-uselayouteffect",
  title: "useLayoutEffect",
  iconName: "Layout",
  demoComponentKey: "useLayoutEffect",
  link: "https://react.dev/reference/react/useLayoutEffect",
  theory:
    "useLayoutEffect fires synchronously after React updates the DOM but before the browser paints. It has the same signature as useEffect. Use it only when you need to measure DOM geometry or make synchronous DOM mutations that must happen before the user sees the screen — otherwise prefer useEffect.",
  theoryDetail: {
    keyConcepts: [
      "useLayoutEffect is synchronous — it blocks the browser from painting until it completes",
      "Safe to read layout properties (getBoundingClientRect, scrollHeight, offsetTop) here — the DOM is committed but not yet visible",
      "Has the same cleanup mechanism as useEffect — return a function to run before the next layout effect",
      "Runs on every render where deps change, just like useEffect",
    ],
    whyItMatters:
      "useEffect runs after paint, so visual corrections applied there cause a flicker — the user sees the wrong position for one frame. useLayoutEffect prevents that flicker by mutating the DOM before the browser has a chance to paint, giving the appearance of an instant correction.",
    commonPitfalls: [
      "Using useLayoutEffect for data fetching or subscriptions — it blocks painting, degrading perceived performance",
      "Forgetting it runs on the server during SSR (as useEffect in Next.js) — guard with typeof window !== 'undefined' when needed",
      "Long-running synchronous work inside it — delays first paint and hurts Core Web Vitals",
    ],
    examples: [
      {
        title: "UseLayoutEffectDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseLayoutEffectDemo.tsx",
        code: `import { useLayoutEffect, useRef, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseLayoutEffectDemo() {
  const renderCount = useRenderCount()
  const boxRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)

  useLayoutEffect(() => {
    if (!boxRef.current) {
      return
    }
    setWidth(Math.round(boxRef.current.getBoundingClientRect().width))
  }, [])

  return (
    <article>
      <h2>useLayoutEffect</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Reads layout right after DOM mutations.</p>
      <div ref={boxRef} className="preview-box">
        Measured width: {width}px
      </div>
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
