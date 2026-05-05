import type { TopicNode } from "@/data/types";

function example(title: string, description: string, code: string, language: "ts" | "tsx" = "tsx") {
  return {
    title,
    description,
    code,
    language,
  };
}

const useRenderCountExample = example(
  "useRenderCount.ts",
  "Exact source from react/src/hooks/useRenderCount.ts",
  `import { useEffect, useId } from 'react'

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
  "ts",
);

const themeContextExample = example(
  "ThemeContext.tsx",
  "Exact source from react/src/context/ThemeContext.tsx",
  `import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

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
  "tsx",
);

function withRenderCount(primary: ReturnType<typeof example>) {
  return {
    examples: [primary, useRenderCountExample],
  };
}

export const hookUseId: TopicNode = {
  id: "hook-useid",
  title: "useId",
  iconName: "Fingerprint",
  demoComponentKey: "useId",
  link: "https://react.dev/reference/react/useId",
  theory:
    "useId generates stable, unique IDs for accessibility attributes like htmlFor and aria-* without mismatches between server and client renders.",
  theoryDetail: withRenderCount(example(
    "UseIdDemo.tsx",
    "Exact source from react/src/components/hooks/UseIdDemo.tsx",
    `import { useId } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseIdDemo() {
  const renderCount = useRenderCount()
  const fieldId = useId()

  return (
    <article>
      <h2>useId</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Generates stable ids for accessible forms.</p>
      <label htmlFor={\`\${fieldId}-name\`}>Name</label>
      <input id={\`\${fieldId}-name\`} placeholder="Accessible input" />
    </article>
  )
}`
  )),
};

export const hookUseImperativeHandle: TopicNode = {
  id: "hook-useimperativehandle",
  title: "useImperativeHandle",
  iconName: "Hand",
  demoComponentKey: "useImperativeHandle",
  link: "https://react.dev/reference/react/useImperativeHandle",
  theory:
    "useImperativeHandle lets a child component expose a controlled imperative API through refs instead of leaking internal DOM details.",
  theoryDetail: withRenderCount(example(
    "UseImperativeHandleDemo.tsx",
    "Exact source from react/src/components/hooks/UseImperativeHandleDemo.tsx",
    `import { forwardRef, memo, useImperativeHandle, useRef, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

type FocusApi = {
  focus: () => void
  clear: () => void
}

const FancyInput = memo(
  forwardRef<FocusApi, { value: string; onChange: (value: string) => void }>(
    function FancyInput({ value, onChange }, ref) {
      const innerRef = useRef<HTMLInputElement>(null)

      useImperativeHandle(
        ref,
        () => ({
          focus: () => innerRef.current?.focus(),
          clear: () => {
            onChange('')
            innerRef.current?.focus()
          },
        }),
        [onChange],
      )

      return (
        <input
          ref={innerRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Expose methods to parent"
        />
      )
    },
  ),
)

export function UseImperativeHandleDemo() {
  const renderCount = useRenderCount()
  const [value, setValue] = useState('Parent can focus or clear me')
  const apiRef = useRef<FocusApi>(null)

  return (
    <article>
      <h2>useImperativeHandle</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Child exposes a tiny imperative API.</p>
      <FancyInput ref={apiRef} value={value} onChange={setValue} />
      <div className="row">
        <button type="button" onClick={() => apiRef.current?.focus()}>
          Focus
        </button>
        <button type="button" onClick={() => apiRef.current?.clear()}>
          Clear
        </button>
      </div>
    </article>
  )
}`
  )),
};

export const hookUseDeferredValue: TopicNode = {
  id: "hook-usedeferredvalue",
  title: "useDeferredValue",
  iconName: "Gauge",
  demoComponentKey: "useDeferredValue",
  link: "https://react.dev/reference/react/useDeferredValue",
  theory:
    "useDeferredValue returns a lagging value for expensive derived rendering so urgent interactions like typing remain responsive.",
  theoryDetail: withRenderCount(example(
    "UseDeferredValueDemo.tsx",
    "Exact source from react/src/components/hooks/UseDeferredValueDemo.tsx",
    `import { useDeferredValue, useMemo, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

const dataset = Array.from({ length: 1800 }, (_, index) => \`Hook helper \${index + 1}\`)

export function UseDeferredValueDemo() {
  const renderCount = useRenderCount()
  const [search, setSearch] = useState('hook')
  const deferredSearch = useDeferredValue(search)

  const filtered = useMemo(() => {
    const query = deferredSearch.toLowerCase().trim()
    if (!query) {
      return dataset.slice(0, 20)
    }
    return dataset.filter((item) => item.toLowerCase().includes(query)).slice(0, 20)
  }, [deferredSearch])

  return (
    <article>
      <h2>useDeferredValue</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Keeps typing fast while expensive filtering lags behind.</p>
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" />
      <p className="muted">Deferred query: {deferredSearch}</p>
      <ul>
        {filtered.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </article>
  )
}`
  )),
};

export const hookUseSyncExternalStore: TopicNode = {
  id: "hook-usesyncexternalstore",
  title: "useSyncExternalStore",
  iconName: "Clock3",
  demoComponentKey: "useSyncExternalStore",
  link: "https://react.dev/reference/react/useSyncExternalStore",
  theory:
    "useSyncExternalStore is the official way to subscribe to external mutable stores with consistent snapshots in concurrent rendering.",
  theoryDetail: withRenderCount(example(
    "UseSyncExternalStoreDemo.tsx",
    "Exact source from react/src/components/hooks/UseSyncExternalStoreDemo.tsx",
    `import { useSyncExternalStore } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

function createClockStore() {
  let value = new Date().toLocaleTimeString()
  const listeners = new Set<() => void>()

  setInterval(() => {
    value = new Date().toLocaleTimeString()
    listeners.forEach((listener) => listener())
  }, 1000)

  return {
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    getSnapshot: () => value,
  }
}

const clockStore = createClockStore()

export function UseSyncExternalStoreDemo() {
  const renderCount = useRenderCount()
  const now = useSyncExternalStore(clockStore.subscribe, clockStore.getSnapshot, () => '00:00:00')

  return (
    <article>
      <h2>useSyncExternalStore</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Subscribes to an external clock store.</p>
      <p className="muted">Current time: {now}</p>
    </article>
  )
}`
  )),
};

export const hookUseDebugValue: TopicNode = {
  id: "hook-usedebugvalue",
  title: "useDebugValue",
  iconName: "Bug",
  demoComponentKey: "useDebugValue",
  link: "https://react.dev/reference/react/useDebugValue",
  theory:
    "useDebugValue annotates custom hooks in React DevTools so debugging stateful abstractions is clearer.",
  theoryDetail: {
    examples: [
      {
        title: "UseDebugValueDemo.tsx",
        description: "Exact source from react/src/components/hooks/UseDebugValueDemo.tsx",
        code: `import { useOnlineStatus } from '../../hooks/useOnlineStatus'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseDebugValueDemo() {
  const renderCount = useRenderCount()
  const online = useOnlineStatus()

  return (
    <article>
      <h2>useDebugValue</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Debug label is visible in React DevTools for the custom status hook.</p>
      <p className="muted">Network: {online ? 'Online' : 'Offline'}</p>
    </article>
  )
}`,
        language: "tsx",
      },
      {
        title: "useOnlineStatus.ts",
        description: "Exact source from react/src/hooks/useOnlineStatus.ts",
        code: `import { useDebugValue, useSyncExternalStore } from 'react'

export function useOnlineStatus() {
  const online = useSyncExternalStore(
    (notify) => {
      window.addEventListener('online', notify)
      window.addEventListener('offline', notify)
      return () => {
        window.removeEventListener('online', notify)
        window.removeEventListener('offline', notify)
      }
    },
    () => navigator.onLine,
    () => true,
  )

  useDebugValue(online ? 'Online' : 'Offline')
  return online
}`,
        language: "ts",
      },
      useRenderCountExample,
    ],
  },
};

export const hookUseInsertionEffect: TopicNode = {
  id: "hook-useinsertioneffect",
  title: "useInsertionEffect",
  iconName: "Paintbrush",
  demoComponentKey: "useInsertionEffect",
  link: "https://react.dev/reference/react/useInsertionEffect",
  theory:
    "useInsertionEffect runs before layout effects and is designed for CSS-in-JS style injection work that must happen very early.",
  theoryDetail: withRenderCount(example(
    "UseInsertionEffectDemo.tsx",
    "Exact source from react/src/components/hooks/UseInsertionEffectDemo.tsx",
    `import { useInsertionEffect, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseInsertionEffectDemo() {
  const renderCount = useRenderCount()
  const [tone, setTone] = useState<'warm' | 'cool'>('warm')

  useInsertionEffect(() => {
    const styleTag = document.createElement('style')
    styleTag.dataset.dynamicTone = 'true'
    styleTag.textContent =
      tone === 'warm'
        ? ':root { --dynamic-accent: #ce5a1f; --dynamic-soft: #ffe6c7; }'
        : ':root { --dynamic-accent: #006d5b; --dynamic-soft: #d7fff4; }'
    document.head.appendChild(styleTag)

    return () => styleTag.remove()
  }, [tone])

  return (
    <article>
      <h2>useInsertionEffect</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Injects dynamic CSS before layout effects run.</p>
      <button type="button" onClick={() => setTone((value) => (value === 'warm' ? 'cool' : 'warm'))}>
        Toggle tone ({tone})
      </button>
    </article>
  )
}`
  )),
};

export const hookUse: TopicNode = {
  id: "hook-use",
  title: "use()",
  iconName: "CirclePlay",
  demoComponentKey: "use",
  link: "https://react.dev/reference/react/use",
  theory:
    "use() can read context and unwrap thenables in render, enabling streamlined data and context consumption patterns.",
  theoryDetail: {
    examples: [
      example(
    "UseUseDemo.tsx",
    "Exact source from react/src/components/hooks/UseUseDemo.tsx",
    `import { use } from 'react'
import { ThemeContext } from '../../context/ThemeContext'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseUseDemo() {
  const renderCount = useRenderCount()
  const contextValue = use(ThemeContext)
  if (!contextValue) {
    throw new Error('ThemeContext is missing. Wrap with ThemeProvider.')
  }

  return (
    <article>
      <h2>use</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Reads context using use instead of useContext.</p>
      <p className="muted">Theme from context: {contextValue.theme}</p>
    </article>
  )
}`,
      ),
      themeContextExample,
      useRenderCountExample,
    ],
  },
};

export const hookUseActionState: TopicNode = {
  id: "hook-useactionstate",
  title: "useActionState",
  iconName: "Send",
  demoComponentKey: "useActionState",
  link: "https://react.dev/reference/react/useActionState",
  theory:
    "useActionState manages form action results and pending state, making async form flows declarative in React 19+.",
  theoryDetail: withRenderCount(example(
    "UseActionStateDemo.tsx",
    "Exact source from react/src/components/hooks/UseActionStateDemo.tsx",
    `import { useActionState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseActionStateDemo() {
  const renderCount = useRenderCount()
  const [status, submitForm, isPending] = useActionState(
    async (_prevState: string, formData: FormData) => {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const feedback = String(formData.get('feedback') ?? '').trim()
      if (!feedback) {
        return 'Please enter feedback first.'
      }
      return \`Saved: \${feedback}\`
    },
    'No feedback submitted yet.',
  )

  return (
    <article>
      <h2>useActionState</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Handles async form actions with pending state.</p>
      <form action={submitForm}>
        <label htmlFor="feedback">Feedback</label>
        <input id="feedback" name="feedback" placeholder="Share a note" />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit'}
        </button>
        <small>{status}</small>
      </form>
    </article>
  )
}`
  )),
};

export const hookUseOptimistic: TopicNode = {
  id: "hook-useoptimistic",
  title: "useOptimistic",
  iconName: "Sparkles",
  demoComponentKey: "useOptimistic",
  link: "https://react.dev/reference/react/useOptimistic",
  theory:
    "useOptimistic renders temporary optimistic UI while a mutation is in flight, then reconciles with confirmed server state.",
  theoryDetail: withRenderCount(example(
    "UseOptimisticDemo.tsx",
    "Exact source from react/src/components/hooks/UseOptimisticDemo.tsx",
    `import { useOptimistic, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseOptimisticDemo() {
  const renderCount = useRenderCount()
  const [likes, setLikes] = useState(5)
  const [optimisticLikes, addOptimisticLike] = useOptimistic(likes, (state, amount: number) => state + amount)

  return (
    <article>
      <h2>useOptimistic</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Shows immediate optimistic UI before server confirmation.</p>
      <div className="row">
        <button
          type="button"
          onClick={() => {
            addOptimisticLike(1)
            setTimeout(() => setLikes((value) => value + 1), 700)
          }}
        >
          Like ({optimisticLikes})
        </button>
        <small>Confirmed: {likes}</small>
      </div>
    </article>
  )
}`
  )),
};

export const hookUseEffectEvent: TopicNode = {
  id: "hook-useeffectevent",
  title: "useEffectEvent",
  iconName: "RadioTower",
  demoComponentKey: "useEffectEvent",
  link: "https://react.dev/reference/react/useEffectEvent",
  theory:
    "useEffectEvent lets effects call logic that always reads fresh props/state without re-subscribing the effect itself.",
  theoryDetail: withRenderCount(example(
    "UseEffectEventDemo.tsx",
    "Exact source from react/src/components/hooks/UseEffectEventDemo.tsx",
    `import { useEffect, useEffectEvent, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UseEffectEventDemo() {
  const renderCount = useRenderCount()
  const [count, setCount] = useState(0)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  const onVisit = useEffectEvent(() => {
    console.log(\`Visited count: \${count}, theme: \${theme}\`)
  })

  useEffect(() => {
    onVisit()
  }, [count, onVisit])

  return (
    <article>
      <h2>useEffectEvent</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Reads latest state inside an effect event without extra dependencies.</p>
      <div className="row">
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Trigger visit ({count})
        </button>
        <button type="button" onClick={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}>
          Theme ({theme})
        </button>
      </div>
      <p className="muted">Check console logs for effect event output.</p>
    </article>
  )
}`
  )),
};

export const hookUseStateEvent: TopicNode = {
  id: "hook-usestateevent",
  title: "useStateEvent pattern",
  iconName: "History",
  demoComponentKey: "useStateEvent",
  theory:
    "A state-event callback pattern keeps stable handler identity while still reading latest state to avoid stale closure bugs.",
  theoryDetail: withRenderCount(example(
    "UseStateEventDemo.tsx",
    "Exact source from react/src/components/hooks/UseStateEventDemo.tsx",
    `import { useCallback, useRef, useState } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

/**
 * useStateEvent — creates a stable callback that always reads the latest
 * state/props via a ref, so you never get stale closures in event handlers.
 * The returned function reference never changes between renders.
 */
function useStateEvent<T extends (...args: never[]) => unknown>(fn: T): T {
  const fnRef = useRef<T>(fn)
  fnRef.current = fn
  return useCallback((...args: Parameters<T>) => fnRef.current(...args), []) as T
}

export function UseStateEventDemo() {
  const renderCount = useRenderCount()
  const [count, setCount] = useState(0)
  const [log, setLog] = useState<string[]>([])

  // Without useStateEvent this would capture a stale 'count' inside the callback.
  // With useStateEvent the callback reference is stable but always reads fresh state.
  const logCount = useStateEvent(() => {
    setLog((prev) => [...prev, \`Snapshot at count = \${count}\`])
  })

  return (
    <article>
      <h2>useStateEvent</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>
        <code>useStateEvent</code> wraps a function in a ref so the stable callback always accesses
        the latest state — solving stale-closure problems without adding extra effect dependencies.
      </p>
      <div className="row">
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          Increment count ({count})
        </button>
        <button type="button" onClick={logCount}>
          Log current count
        </button>
        <button type="button" onClick={() => setLog([])}>
          Clear log
        </button>
      </div>
      {log.length > 0 && (
        <ul className="muted" style={{ marginTop: '0.75rem', paddingLeft: '1.25rem' }}>
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      )}
      <p className="muted" style={{ marginTop: '0.5rem' }}>
        Increment several times, then click "Log current count" — it always captures the real current
        value, not a stale one from when the handler was first created.
      </p>
    </article>
  )
}`
  )),
};

export const hookRefAsProp: TopicNode = {
  id: "react19-ref-as-prop",
  title: "ref as a prop",
  iconName: "Waypoint",
  demoComponentKey: "refAsProp",
  theory:
    "React 19 allows function components to receive ref as a prop in many cases, reducing forwardRef boilerplate.",
  theoryDetail: withRenderCount(example(
    "RefAsPropDemo.tsx",
    "Exact source from react/src/components/hooks/RefAsPropDemo.tsx",
    `import { useImperativeHandle, useRef, useState, type Ref } from 'react'
import { useRenderCount } from '../../hooks/useRenderCount'

type InputApi = {
  focus: () => void
  selectAll: () => void
}

function SmartInput({
  value,
  onChange,
  ref,
}: {
  value: string
  onChange: (value: string) => void
  ref: Ref<InputApi>
}) {
  const innerRef = useRef<HTMLInputElement>(null)

  useImperativeHandle(
    ref,
    () => ({
      focus: () => innerRef.current?.focus(),
      selectAll: () => innerRef.current?.select(),
    }),
    [],
  )

  return (
    <input
      ref={innerRef}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="React 19 lets ref come as a prop"
    />
  )
}

export function RefAsPropDemo() {
  const renderCount = useRenderCount()
  const [value, setValue] = useState('No forwardRef needed in React 19.')
  const apiRef = useRef<InputApi>(null)

  return (
    <article>
      <h2>ref as a prop</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>
        In React 19, function components can receive ref directly as a prop, so many cases no
        longer need forwardRef.
      </p>
      <SmartInput ref={apiRef} value={value} onChange={setValue} />
      <div className="row">
        <button type="button" onClick={() => apiRef.current?.focus()}>
          Focus
        </button>
        <button type="button" onClick={() => apiRef.current?.selectAll()}>
          Select all
        </button>
      </div>
      <p className="muted">This example uses ref as a prop and still exposes methods with useImperativeHandle.</p>
    </article>
  )
}`
  )),
};

export const hookPortal: TopicNode = {
  id: "react-create-portal",
  title: "createPortal",
  iconName: "AppWindow",
  demoComponentKey: "portal",
  link: "https://react.dev/reference/react-dom/createPortal",
  theory:
    "createPortal renders UI into a different DOM subtree (like document.body), useful for modals, popovers, and overlays.",
  theoryDetail: withRenderCount(example(
    "UsePortalDemo.tsx",
    "Exact source from react/src/components/hooks/UsePortalDemo.tsx",
    `import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useRenderCount } from '../../hooks/useRenderCount'

export function UsePortalDemo() {
  const renderCount = useRenderCount()
  const [open, setOpen] = useState(false)

  return (
    <article>
      <h2>Portal (createPortal)</h2>
      <p className="render-badge">Render count: {renderCount}</p>
      <p>Renders modal outside normal DOM tree.</p>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      {open &&
        createPortal(
          <div className="modal-backdrop" role="presentation" onClick={() => setOpen(false)}>
            <div className="modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
              <h3>Portal Modal</h3>
              <p>This is rendered in document.body using createPortal.</p>
              <button type="button" onClick={() => setOpen(false)}>
                Close
              </button>
            </div>
          </div>,
          document.body,
        )}
    </article>
  )
}`
  )),
};

export const modernHookTopics: TopicNode[] = [
  hookUseId,
  hookUseImperativeHandle,
  hookUseDeferredValue,
  hookUseSyncExternalStore,
  hookUseDebugValue,
  hookUseInsertionEffect,
  hookUse,
  hookUseActionState,
  hookUseOptimistic,
  hookUseEffectEvent,
  hookUseStateEvent,
  hookRefAsProp,
  hookPortal,
];
