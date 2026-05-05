import type { TopicNode } from "@/data/types";

export const hookUseContext: TopicNode = {
  id: "hook-usecontext",
  title: "useContext",
  iconName: "Share2",
  demoComponentKey: "useContext",
  link: "https://react.dev/reference/react/useContext",
  theory:
    "useContext reads the current value of a React Context without needing to pass it down as a prop at every level. Any component in the tree below the Provider can call useContext(MyContext) to subscribe — it re-renders whenever the context value changes.",
  theoryDetail: {
    keyConcepts: [
      "createContext(defaultValue) creates a context object — the default is only used when there is no matching Provider above",
      "<MyContext.Provider value={...}> wraps the subtree that should have access",
      "useContext(MyContext) returns the current value — components using it re-render when value changes",
      "Wrap the Provider value in useMemo to avoid re-rendering all consumers when the parent re-renders for unrelated reasons",
    ],
    whyItMatters:
      "Prop drilling — passing data through many layers of components that don't need it — is a common pain point in large trees. Context eliminates this for genuinely global or widely-shared data like theme, locale, auth state, or feature flags.",
    commonPitfalls: [
      "Using Context for every shared state — Context re-renders ALL consumers; consider Zustand/Jotai for frequently changing values",
      "Placing the Provider too high in the tree — it forces large subtrees to re-render on each update",
      "Forgetting to memoize the context value object — a new object reference on every render re-renders every consumer",
      "Consuming context outside a Provider — the default value is returned, which is often null/undefined and crashes",
    ],
    examples: [
      {
        title: "UseContextDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseContextDemo.tsx",
        code: `import { useThemeContext } from '../../context/ThemeContext'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseContextDemo() {
  const renderCount = useRenderCount()
  const { theme, setTheme } = useThemeContext()

  return (
    <article>
      <h2>useContext</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Reads and updates global theme context.</p>
      <div className="row">
        <button
          type="button"
          onClick={() => setTheme((current) => (current === 'sunrise' ? 'mint' : 'sunrise'))}
        >
          Toggle Theme ({theme})
        </button>
      </div>
    </article>
  )
}`,
        language: "tsx",
      },
      {
        title: "ThemeContext.tsx",
        description: "Exact source from react/src/context/ThemeContext.tsx",
        code: `import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

export type Theme = 'sunrise' | 'mint'

type ThemeContextValue = {
  theme: Theme
  setTheme: Dispatch<SetStateAction<Theme>>
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('sunrise')

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('ThemeContext is missing. Wrap with ThemeProvider.')
  }
  return context
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
