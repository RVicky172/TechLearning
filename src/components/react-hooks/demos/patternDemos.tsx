"use client";

import { useState, createContext, useContext, type ReactNode } from "react";
import { DemoCard } from "../ui";

// ── Compound Components Demo (Tabs) ──
const TabsCtx = createContext<{ active: string; setActive: (v: string) => void } | null>(null);

function Tabs({ defaultValue, children }: { defaultValue: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  return <TabsCtx.Provider value={{ active, setActive }}>{children}</TabsCtx.Provider>;
}
function TabsList({ children }: { children: ReactNode }) {
  return <div className="flex gap-1 border-b border-(--border) pb-0 mb-3">{children}</div>;
}
function TabsTrigger({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  const isActive = ctx.active === value;
  return (
    <button
      onClick={() => ctx.setActive(value)}
      className={`px-4 py-2 text-sm rounded-t transition-colors ${isActive ? "border-b-2 border-(--accent) text-(--accent-fg) font-medium" : "text-(--text-3) hover:text-(--text-2)"}`}
    >
      {children}
    </button>
  );
}
function TabsPanel({ value, children }: { value: string; children: ReactNode }) {
  const ctx = useContext(TabsCtx)!;
  if (ctx.active !== value) return null;
  return <div className="rounded-lg bg-(--bg-code) p-4 text-sm text-(--text-2)">{children}</div>;
}
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Panel = TabsPanel;

export function CompoundComponentsDemo() {
  return (
    <DemoCard title="Compound Components — Tabs">
      <p className="text-xs text-(--text-3) mb-3">
        Child components share state implicitly via Context. You compose them freely — the parent doesn&apos;t need to pass active state as props.
      </p>
      <Tabs defaultValue="overview">
        <Tabs.List>
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="code">Source Code</Tabs.Trigger>
          <Tabs.Trigger value="props">API</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <p>The <strong>Overview</strong> panel — rendered when &quot;Overview&quot; tab is active.</p>
          <p className="mt-2 text-xs text-(--text-3)">Click other tabs — the active panel swaps without prop drilling.</p>
        </Tabs.Panel>
        <Tabs.Panel value="code">
          <pre className="text-xs overflow-x-auto">{`<Tabs defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="code">Source Code</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Panel value="overview">Overview content</Tabs.Panel>
  <Tabs.Panel value="code">Code content</Tabs.Panel>
</Tabs>`}</pre>
        </Tabs.Panel>
        <Tabs.Panel value="props">
          <div className="space-y-1 text-xs font-mono">
            <p><span className="text-(--accent-fg)">Tabs</span> — defaultValue: string</p>
            <p><span className="text-(--accent-fg)">Tabs.Trigger</span> — value: string</p>
            <p><span className="text-(--accent-fg)">Tabs.Panel</span> — value: string</p>
          </div>
        </Tabs.Panel>
      </Tabs>
    </DemoCard>
  );
}

// ── HOC Demo ──
function withLogger<P extends object>(WrappedComponent: React.ComponentType<P>, name: string) {
  return function WithLogger(props: P) {
    return (
      <div className="rounded-lg border border-dashed border-blue-700/40 p-3">
        <p className="text-xs text-blue-400 mb-2">🔵 HOC wrapper: withLogger({name})</p>
        <WrappedComponent {...props} />
      </div>
    );
  };
}

function BaseButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-lg border border-(--border) px-3 py-1.5 text-sm text-(--text-1) hover:bg-(--bg-elevated)">
      {label}
    </button>
  );
}
const LoggedButton = withLogger(BaseButton, "BaseButton");

export function HOCDemo() {
  const [log, setLog] = useState<string[]>([]);
  return (
    <DemoCard title="Higher-Order Components (HOC)">
      <p className="text-xs text-(--text-3)">
        <code>withLogger</code> wraps <code>BaseButton</code> — adding behaviour without modifying the original component. The dashed border is injected by the HOC.
      </p>
      <LoggedButton label="Click me" onClick={() => setLog((p) => [`[${new Date().toLocaleTimeString()}] Button clicked`, ...p].slice(0, 4))} />
      <div className="rounded-lg bg-(--bg-code) p-2 font-mono text-xs space-y-1 min-h-[60px]">
        {log.map((l, i) => <p key={i} className="text-(--text-2)">{l}</p>)}
        {log.length === 0 && <p className="text-(--text-3)">Click the button...</p>}
      </div>
    </DemoCard>
  );
}

// ── Render Props Demo ──
function MouseTracker({ render }: { render: (pos: { x: number; y: number }) => ReactNode }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({ x: Math.round(e.clientX - rect.left), y: Math.round(e.clientY - rect.top) });
      }}
      className="rounded-lg border border-(--border) bg-(--bg-code) p-4 h-32 flex items-center justify-center cursor-crosshair"
    >
      {render(pos)}
    </div>
  );
}

export function RenderPropsDemo() {
  return (
    <DemoCard title="Render Props">
      <p className="text-xs text-(--text-3)">
        <code>MouseTracker</code> tracks the cursor position and shares it via a render prop. The consumer decides how to display it.
      </p>
      <p className="text-xs text-(--text-3) mb-2">Usage 1: Show coordinates as text</p>
      <MouseTracker render={({ x, y }) => (
        <p className="font-mono text-sm text-(--text-1)">x: {x}, y: {y}</p>
      )} />
      <p className="text-xs text-(--text-3) mt-3 mb-2">Usage 2: Same hook, different display (dot follows cursor)</p>
      <MouseTracker render={({ x, y }) => (
        <div className="relative w-full h-full">
          <div
            className="absolute w-4 h-4 rounded-full bg-(--accent) opacity-80 pointer-events-none transition-none"
            style={{ left: Math.max(0, x - 8), top: Math.max(0, y - 8) }}
          />
          <p className="absolute bottom-0 right-0 font-mono text-xs text-(--text-3)">{x},{y}</p>
        </div>
      )} />
    </DemoCard>
  );
}

// ── Custom Hooks Real-World Demo ──
import { useState as useS, useEffect as useE, useRef as useR } from "react";

function useLocalStorageDemo<T>(key: string, initial: T) {
  const [val, setVal] = useS<T>(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  useE(() => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val]);
  return [val, setVal] as const;
}

function useDebounceDemo<T>(value: T, delay: number) {
  const [deb, setDeb] = useS(value);
  useE(() => { const t = setTimeout(() => setDeb(value), delay); return () => clearTimeout(t); }, [value, delay]);
  return deb;
}

function usePreviousDemo<T>(value: T) {
  const ref = useR<T | undefined>(undefined);
  useE(() => { ref.current = value; });
  return ref.current;
}

export function CustomHooksRealDemo() {
  const [theme, setTheme] = useLocalStorageDemo<"dark" | "light">("demo-theme", "dark");
  const [query, setQuery] = useS("");
  const debounced = useDebounceDemo(query, 400);
  const prevQuery = usePreviousDemo(debounced);
  const [keystrokes, setKeystrokes] = useS(0);
  const [apiCalls, setApiCalls] = useS(0);

  useE(() => {
    if (debounced) setApiCalls((c) => c + 1);
  }, [debounced]);

  return (
    <DemoCard title="Real-World Custom Hooks">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase text-(--text-3) mb-1">useLocalStorage — persists across refresh</p>
          <button
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
            className="rounded-lg border border-(--border) px-3 py-1.5 text-sm text-(--text-1) hover:bg-(--bg-elevated)"
          >
            Stored theme: <strong className="text-(--accent-fg)">{theme}</strong> (refresh the page — it persists!)
          </button>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-(--text-3) mb-1">useDebounce + usePrevious</p>
          <input
            value={query} onChange={(e) => { setQuery(e.target.value); setKeystrokes((k) => k + 1); }}
            placeholder="Type to search..."
            className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-sm text-(--text-1)"
          />
          <div className="flex flex-wrap gap-4 text-xs mt-2 text-(--text-2)">
            <span>Keystrokes: <strong>{keystrokes}</strong></span>
            <span>API calls: <strong className="text-(--accent-fg)">{apiCalls}</strong></span>
            <span>Debounced: <strong>&quot;{debounced}&quot;</strong></span>
            <span>Previous: <strong>&quot;{prevQuery ?? "—"}&quot;</strong></span>
          </div>
        </div>
      </div>
    </DemoCard>
  );
}
