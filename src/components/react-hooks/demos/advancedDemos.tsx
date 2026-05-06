"use client";

import { useState, memo, useCallback, useContext, createContext, useReducer, Component, type ReactNode } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";

// ── Performance / memo Demo ──
let renderCount = 0;
const ExpensiveRow = memo(function ExpensiveRow({ name, onDelete }: { name: string; onDelete: (n: string) => void }) {
  renderCount++;
  return (
    <div className="flex items-center justify-between rounded bg-(--bg-code) px-3 py-1.5 text-sm">
      <span className="text-(--text-1)">{name}</span>
      <span className="text-xs text-(--text-3) mr-4">renders: {renderCount}</span>
      <button onClick={() => onDelete(name)} className="text-red-400 text-xs hover:text-red-300">Remove</button>
    </div>
  );
});

export function ReactPerformanceDemo() {
  const rc = useRenderCount();
  const [items, setItems] = useState(["Alice", "Bob", "Carol"]);
  const [other, setOther] = useState(0);
  renderCount = 0;

  const handleDelete = useCallback((name: string) => {
    setItems((prev) => prev.filter((i) => i !== name));
  }, []);

  return (
    <DemoCard title="Performance — React.memo + useCallback">
      <RenderBadge count={rc} />
      <p className="text-xs text-(--text-3)">
        Click <strong>"Other state"</strong> — parent re-renders but memo rows do NOT (check their render count).
        Removing an item causes only that row to disappear. <code>useCallback</code> keeps <code>onDelete</code> stable.
      </p>
      <button
        onClick={() => setOther((c) => c + 1)}
        className="rounded-lg border border-(--border) px-3 py-1.5 text-sm text-(--text-1) hover:bg-(--bg-elevated)"
      >
        Other state: {other} (triggers parent re-render)
      </button>
      <div className="space-y-1 mt-2">
        {items.map((name) => (
          <ExpensiveRow key={name} name={name} onDelete={handleDelete} />
        ))}
      </div>
      {items.length === 0 && <p className="text-(--text-3) text-sm italic">All items removed. Refresh to reset.</p>}
    </DemoCard>
  );
}

// ── Batching Demo ──
export function ReactBatchingDemo() {
  const rc = useRenderCount();
  const [count, setCount] = useState(0);
  const [text, setText] = useState("hello");
  const [renderLog, setRenderLog] = useState<string[]>([]);

  const batchedUpdate = () => {
    // React 18: both setters batched → 1 render
    setCount((c) => c + 1);
    setText((t) => (t === "hello" ? "world" : "hello"));
    setRenderLog((prev) => [...prev, `Render #${rc + 1} (batched: count+text)`].slice(-5));
  };

  const asyncUpdate = async () => {
    await new Promise((r) => setTimeout(r, 0));
    // React 18: still batched even in async!
    setCount((c) => c + 1);
    setText((t) => (t === "hello" ? "world" : "hello"));
    setRenderLog((prev) => [...prev, `Render #${rc + 1} (async — still batched!)`].slice(-5));
  };

  return (
    <DemoCard title="State Batching">
      <RenderBadge count={rc} />
      <p className="text-xs text-(--text-3)">
        Both buttons update 2 state variables. React 18 batches them into a single re-render even in async callbacks. Watch the render count — it only increments once per click.
      </p>
      <div className="flex flex-wrap gap-2">
        <button onClick={batchedUpdate} className="rounded-lg border border-(--border) px-3 py-1.5 text-sm text-(--text-1) hover:bg-(--bg-elevated)">
          Sync update (2 setters, 1 render)
        </button>
        <button onClick={asyncUpdate} className="rounded-lg border border-(--border) px-3 py-1.5 text-sm text-(--text-1) hover:bg-(--bg-elevated)">
          Async update (still batched!)
        </button>
      </div>
      <div className="flex gap-6 text-sm">
        <span>count: <strong className="text-(--accent-fg)">{count}</strong></span>
        <span>text: <strong className="text-(--accent-fg)">{text}</strong></span>
      </div>
      <div className="rounded-lg bg-(--bg-code) p-2 text-xs font-mono space-y-1">
        {renderLog.map((l, i) => <div key={i} className="text-(--text-2)">{l}</div>)}
        {renderLog.length === 0 && <p className="text-(--text-3)">Click a button to log renders...</p>}
      </div>
    </DemoCard>
  );
}

// ── Context Demo ──
const ThemeCtx = createContext<{ theme: string; toggle: () => void }>({ theme: "dark", toggle: () => {} });

function ThemedBox() {
  const { theme, toggle } = useContext(ThemeCtx);
  return (
    <div className={`rounded-lg p-4 border ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-gray-100 border-gray-300"}`}>
      <p className={`text-sm font-medium ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}>
        ThemedBox — reads theme from Context: <strong>{theme}</strong>
      </p>
      <button
        onClick={toggle}
        className={`mt-2 rounded px-3 py-1 text-xs ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-800"}`}
      >
        Toggle theme
      </button>
    </div>
  );
}

export function AdvancedContextDemo() {
  const [theme, setTheme] = useState("dark");
  const toggle = useCallback(() => setTheme((t) => (t === "dark" ? "light" : "dark")), []);

  return (
    <DemoCard title="Context API">
      <p className="text-xs text-(--text-3)">Context passes <code>theme</code> down without prop drilling. Any descendant can read it directly.</p>
      <ThemeCtx.Provider value={{ theme, toggle }}>
        <ThemedBox />
        <div className="rounded-lg border border-dashed border-(--border) p-3 mt-2">
          <p className="text-xs text-(--text-3) mb-2">Nested wrapper (doesn&apos;t receive theme as prop)</p>
          <ThemedBox />
        </div>
      </ThemeCtx.Provider>
    </DemoCard>
  );
}

// ── useReducer complex state Demo ──
type CartItem = { id: number; name: string; qty: number };
type CartAction =
  | { type: "add"; name: string }
  | { type: "increment"; id: number }
  | { type: "decrement"; id: number }
  | { type: "remove"; id: number };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const existing = state.find((i) => i.name === action.name);
      if (existing) return state.map((i) => i.name === action.name ? { ...i, qty: i.qty + 1 } : i);
      return [...state, { id: Date.now(), name: action.name, qty: 1 }];
    }
    case "increment": return state.map((i) => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
    case "decrement": return state.map((i) => i.id === action.id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i);
    case "remove": return state.filter((i) => i.id !== action.id);
    default: return state;
  }
}

const PRODUCTS = ["☕ Coffee", "🍕 Pizza", "🍎 Apple", "📚 Book"];

export function UseReducerCartDemo() {
  const rc = useRenderCount();
  const [cart, dispatch] = useReducer(cartReducer, []);
  const total = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <DemoCard title="useReducer — Shopping Cart">
      <RenderBadge count={rc} />
      <p className="text-xs text-(--text-3)">All state transitions are explicit actions through the reducer — easy to trace and test.</p>
      <div className="flex flex-wrap gap-2">
        {PRODUCTS.map((p) => (
          <button key={p} onClick={() => dispatch({ type: "add", name: p })} className="rounded-lg border border-(--border) px-3 py-1.5 text-sm text-(--text-1) hover:bg-(--bg-elevated)">
            + {p}
          </button>
        ))}
      </div>
      {cart.length === 0 ? (
        <p className="text-(--text-3) text-sm italic">Cart is empty. Add items above.</p>
      ) : (
        <div className="space-y-1 mt-1">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-lg bg-(--bg-code) px-3 py-2 text-sm">
              <span className="flex-1 text-(--text-1)">{item.name}</span>
              <button onClick={() => dispatch({ type: "decrement", id: item.id })} className="rounded px-2 py-0.5 border border-(--border) text-(--text-1) hover:bg-(--bg-elevated)">−</button>
              <span className="w-6 text-center font-medium text-(--accent-fg)">{item.qty}</span>
              <button onClick={() => dispatch({ type: "increment", id: item.id })} className="rounded px-2 py-0.5 border border-(--border) text-(--text-1) hover:bg-(--bg-elevated)">+</button>
              <button onClick={() => dispatch({ type: "remove", id: item.id })} className="text-red-400 hover:text-red-300 ml-1">✕</button>
            </div>
          ))}
          <p className="text-right text-sm font-semibold text-(--text-1)">Total items: {total}</p>
        </div>
      )}
    </DemoCard>
  );
}

// ── Optimistic Updates Demo ──
export function OptimisticUpdatesDemo() {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(142);
  const [isPending, setIsPending] = useState(false);
  const [status, setStatus] = useState("");
  const [shouldFail, setShouldFail] = useState(false);

  const toggleLike = async () => {
    if (isPending) return;
    const newLiked = !liked;
    // 1. Optimistic — update instantly
    setLiked(newLiked);
    setLikeCount((c) => c + (newLiked ? 1 : -1));
    setIsPending(true);
    setStatus("Saving...");
    await new Promise((r) => setTimeout(r, 1000));
    if (shouldFail) {
      // 2. Failure — revert
      setLiked(!newLiked);
      setLikeCount((c) => c + (newLiked ? -1 : 1));
      setStatus("❌ Failed — reverted");
    } else {
      setStatus("✅ Saved");
    }
    setIsPending(false);
  };

  return (
    <DemoCard title="Optimistic Updates">
      <p className="text-xs text-(--text-3)">
        Click the like button — the UI updates <em>immediately</em> while the fake API call takes 1 second. Toggle &quot;Simulate failure&quot; to see the rollback.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLike}
          disabled={isPending}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${liked ? "border-pink-500 text-pink-400 bg-pink-950/30" : "border-(--border) text-(--text-1)"} disabled:opacity-60`}
        >
          {liked ? "❤️" : "🤍"} {likeCount}
        </button>
        <span className="text-sm text-(--text-2)">{status}</span>
      </div>
      <label className="flex items-center gap-2 text-xs cursor-pointer text-(--text-3)">
        <input type="checkbox" checked={shouldFail} onChange={(e) => setShouldFail(e.target.checked)} />
        Simulate server failure (rollback after 1s)
      </label>
    </DemoCard>
  );
}

// ── Error Boundary Demo ──
class ErrorBoundaryWrapper extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null };
  static getDerivedStateFromError(e: Error) { return { error: e.message }; }
  render() {
    if (this.state.error) return (
      <div className="rounded-lg bg-red-950/30 border border-red-800/40 p-4">
        <p className="text-red-400 font-medium text-sm">💥 Caught by Error Boundary</p>
        <p className="text-red-300 text-xs mt-1">{this.state.error}</p>
        <button onClick={() => this.setState({ error: null })} className="mt-2 rounded border border-red-700 px-3 py-1 text-xs text-red-300 hover:bg-red-900/30">
          Retry
        </button>
      </div>
    );
    return this.props.children;
  }
}

function CrashButton({ label }: { label: string }) {
  const [crashed, setCrashed] = useState(false);
  if (crashed) throw new Error(`${label} component crashed!`);
  return (
    <button onClick={() => setCrashed(true)} className="rounded-lg border border-(--border) px-3 py-1.5 text-sm text-(--text-1) hover:bg-(--bg-elevated)">
      💣 Crash: {label}
    </button>
  );
}

export function ErrorBoundaryDemo() {
  const [key, setKey] = useState(0);
  return (
    <DemoCard title="Error Boundaries">
      <p className="text-xs text-(--text-3)">Each widget is isolated in its own boundary. Crashing one doesn&apos;t affect the others.</p>
      <div className="space-y-2">
        {["Widget A", "Widget B"].map((label) => (
          <ErrorBoundaryWrapper key={`${label}-${key}`}>
            <div className="rounded-lg bg-(--bg-code) p-3 flex items-center gap-3">
              <span className="flex-1 text-sm text-(--text-2)">{label} is healthy</span>
              <CrashButton label={label} />
            </div>
          </ErrorBoundaryWrapper>
        ))}
      </div>
      <button onClick={() => setKey((k) => k + 1)} className="text-xs underline text-(--text-3) mt-1">Reset all boundaries</button>
    </DemoCard>
  );
}
