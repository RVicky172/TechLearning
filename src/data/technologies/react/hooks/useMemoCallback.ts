import type { TopicNode } from "@/data/types";

export const hookUseMemoCallback: TopicNode = {
  id: "hook-usememo-usecallback",
  title: "useMemo & useCallback",
  iconName: "Cpu",
  demoComponentKey: "useMemoCallback",
  link: "https://react.dev/reference/react/useMemo",
  theory:
    "useMemo caches the result of an expensive computation between renders. useCallback caches a function reference between renders. Both accept a dependency array — the cached value is reused as long as none of the dependencies change. They exist to prevent unnecessary work and preserve referential equality.",
  theoryDetail: {
    keyConcepts: [
      "useMemo(() => compute(a, b), [a, b]) — recalculates only when a or b change",
      "useCallback(fn, [deps]) is syntactic sugar for useMemo(() => fn, [deps]) — returns a stable function reference",
      "Referential equality matters for React.memo — if a prop is a new function/object each render, memoisation is bypassed",
      "Both have a cost (memory + comparison) — only apply after measuring a real performance problem",
    ],
    whyItMatters:
      "Without memoisation, every re-render creates new object/function references, defeating React.memo and causing all children to re-render regardless of whether their props changed. useCallback and useMemo let you opt specific values out of the re-render cascade.",
    commonPitfalls: [
      "Memoising everything by default — the overhead of useMemo/useCallback is often larger than the computation it avoids",
      "Missing a dependency in the array — the cached value goes stale silently; use the eslint-plugin-react-hooks lint rule",
      "Using useMemo for side effects — it's for computed values only; use useEffect for side effects",
      "Expecting useMemo to always skip the computation — React may choose to discard the cache under memory pressure",
    ],
    examples: [
      {
        title: "UseMemoDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseMemoDemo.tsx",
        code: `import { useMemo, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

const bigList = Array.from({ length: 1600 }, (_, index) => \`Item \${index + 1}\`)

export function UseMemoDemo() {
  const renderCount = useRenderCount()
  const [query, setQuery] = useState('1')
  const filtered = useMemo(() => {
    const normalized = query.trim()
    if (!normalized) {
      return bigList.slice(0, 20)
    }
    return bigList.filter((item) => item.includes(normalized)).slice(0, 20)
  }, [query])

  return (
    <article>
      <h2>useMemo</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Caches expensive list filtering.</p>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter" />
      <ul>
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}`,
        language: "tsx",
      },
      {
        title: "UseCallbackDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseCallbackDemo.tsx",
        code: `import { memo, useCallback, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

const SaveButton = memo(function SaveButton({ onSave }: { onSave: () => void }) {
  return (
    <button type="button" onClick={onSave}>
      Save note
    </button>
  )
})

export function UseCallbackDemo() {
  const renderCount = useRenderCount()
  const [note, setNote] = useState('Memoize callbacks passed to children')

  const onSave = useCallback(() => {
    localStorage.setItem('use-callback-note', note)
    alert('Saved callback payload.')
  }, [note])

  return (
    <article>
      <h2>useCallback</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Memoizes callback identity for memoized children.</p>
      <input value={note} onChange={(event) => setNote(event.target.value)} />
      <SaveButton onSave={onSave} />
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
