"use client";

import { useState, memo, useCallback } from "react";
import { DemoCard, RenderBadge } from "../ui";
import { useRenderCount } from "../hooks";

// ── Conditional Rendering Demo ──
export function ConditionalRenderingDemo() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<"admin" | "viewer">("viewer");
  const [count, setCount] = useState(3);

  return (
    <DemoCard title="Conditional Rendering">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setIsLoggedIn((v) => !v)}
            className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
          >
            {isLoggedIn ? "🔓 Log out" : "🔐 Log in"}
          </button>
          <button
            onClick={() => setRole((r) => (r === "admin" ? "viewer" : "admin"))}
            className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
          >
            Role: {role}
          </button>
          <button
            onClick={() => setCount((c) => c - 1)}
            className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
          >
            Items: {count} (click to remove)
          </button>
        </div>

        {/* if/else pattern */}
        <div className="rounded-lg bg-(--bg-code) p-3">
          {isLoggedIn ? (
            <p className="text-green-400">✅ Welcome back! You are logged in.</p>
          ) : (
            <p className="text-red-400">🚫 Please log in to continue.</p>
          )}
        </div>

        {/* && short-circuit */}
        {isLoggedIn && role === "admin" && (
          <div className="rounded-lg bg-amber-950/30 border border-amber-800/40 p-3">
            <p className="text-amber-400">🛡️ Admin panel visible (short-circuit: isLoggedIn &amp;&amp; role === admin)</p>
          </div>
        )}

        {/* count > 0 guard */}
        {count <= 0 && (
          <p className="text-(--text-3) italic">No items left — empty state shown when count ≤ 0</p>
        )}
      </div>
    </DemoCard>
  );
}

// ── Events Demo ──
export function ReactEventsDemo() {
  const [log, setLog] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");

  const addLog = (msg: string) =>
    setLog((prev) => [`${new Date().toLocaleTimeString()}: ${msg}`, ...prev].slice(0, 6));

  return (
    <DemoCard title="React Events">
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => addLog("onClick fired")}
            onDoubleClick={() => addLog("onDoubleClick fired")}
            className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
          >
            Click / Double-click me
          </button>
          <button
            onMouseEnter={() => addLog("onMouseEnter")}
            onMouseLeave={() => addLog("onMouseLeave")}
            className="rounded-lg border border-(--border) px-3 py-1.5 text-(--text-1) hover:bg-(--bg-elevated)"
          >
            Hover me
          </button>
        </div>
        <input
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            addLog(`onChange: "${e.target.value}"`);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") addLog("Enter key pressed");
          }}
          placeholder="Type here (watch events)..."
          className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1)"
        />
        <div className="rounded-lg bg-(--bg-code) p-3 font-mono text-xs space-y-1 min-h-[80px]">
          {log.length === 0 && <p className="text-(--text-3)">Event log will appear here...</p>}
          {log.map((l, i) => <div key={i} className="text-(--text-2)">{l}</div>)}
        </div>
        <button onClick={() => setLog([])} className="text-xs text-(--text-3) underline">Clear log</button>
      </div>
    </DemoCard>
  );
}

// ── Forms Demo ──
export function ReactFormsDemo() {
  const [form, setForm] = useState({ name: "", email: "", role: "developer", agree: false });
  const [submitted, setSubmitted] = useState<typeof form | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (!form.agree) e.agree = "You must agree";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setSubmitted(form);
  };

  return (
    <DemoCard title="Controlled Forms">
      {submitted ? (
        <div className="rounded-lg bg-(--bg-code) p-4 space-y-1">
          <p className="text-green-400 font-medium">✅ Form submitted!</p>
          <pre className="text-xs text-(--text-2)">{JSON.stringify(submitted, null, 2)}</pre>
          <button onClick={() => setSubmitted(null)} className="text-xs underline text-(--text-3)">Reset</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              value={form.name} onChange={(e) => update("name", e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1) text-sm"
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <input
              value={form.email} onChange={(e) => update("email", e.target.value)}
              placeholder="Email address"
              className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1) text-sm"
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>
          <select
            value={form.role} onChange={(e) => update("role", e.target.value)}
            className="w-full rounded-lg border border-(--border) bg-(--bg-code) px-3 py-2 text-(--text-1) text-sm"
          >
            <option value="developer">Developer</option>
            <option value="designer">Designer</option>
            <option value="manager">Manager</option>
          </select>
          <div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.agree} onChange={(e) => update("agree", e.target.checked)} />
              I agree to the terms
            </label>
            {errors.agree && <p className="text-red-400 text-xs mt-1">{errors.agree}</p>}
          </div>
          <button type="submit" className="w-full rounded-lg bg-(--accent) px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Submit
          </button>
        </form>
      )}
    </DemoCard>
  );
}

// ── Lists & Keys Demo ──
export function ReactListsDemo() {
  const [items, setItems] = useState([
    { id: 1, text: "Learn React" },
    { id: 2, text: "Build something" },
    { id: 3, text: "Ship it" },
  ]);
  const [newItem, setNewItem] = useState("");
  const nextId = Math.max(...items.map((i) => i.id), 0) + 1;

  const addItem = () => {
    if (!newItem.trim()) return;
    setItems((prev) => [...prev, { id: nextId, text: newItem.trim() }]);
    setNewItem("");
  };
  const removeItem = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setItems((prev) => {
      const arr = [...prev];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };

  return (
    <DemoCard title="Lists & Keys">
      <p className="text-xs text-(--text-3) mb-2">Each item has a stable <code>key=&#123;item.id&#125;</code> — React tracks identity through add/remove/reorder.</p>
      <div className="flex gap-2 mb-3">
        <input
          value={newItem} onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addItem()}
          placeholder="New item..."
          className="flex-1 rounded-lg border border-(--border) bg-(--bg-code) px-3 py-1.5 text-sm text-(--text-1)"
        />
        <button onClick={addItem} className="rounded-lg border border-(--border) px-3 py-1.5 text-sm text-(--text-1) hover:bg-(--bg-elevated)">Add</button>
      </div>
      <ul className="space-y-1">
        {items.map((item, idx) => (
          <li key={item.id} className="flex items-center gap-2 rounded-lg bg-(--bg-code) px-3 py-2 text-sm">
            <span className="text-(--text-3) w-5">{idx + 1}.</span>
            <span className="flex-1 text-(--text-1)">{item.text}</span>
            <span className="font-mono text-xs text-(--text-3)">key={item.id}</span>
            <button onClick={() => moveUp(idx)} className="text-(--text-3) hover:text-(--text-1) px-1" title="Move up">↑</button>
            <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 px-1">✕</button>
          </li>
        ))}
      </ul>
    </DemoCard>
  );
}

// ── Props Demo ──
const childBtnClass = "rounded-lg border border-(--border) px-3 py-1.5 text-sm text-(--text-1) hover:bg-(--bg-elevated)";

function UserCard({ name, role, isOnline, onMessage }: { name: string; role: string; isOnline: boolean; onMessage: () => void }) {
  return (
    <div className="rounded-lg bg-(--bg-code) p-4 flex items-center gap-4">
      <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-400" : "bg-gray-500"}`} />
      <div className="flex-1">
        <p className="font-medium text-(--text-1)">{name}</p>
        <p className="text-xs text-(--text-3)">{role}</p>
      </div>
      <button onClick={onMessage} className={childBtnClass}>Message</button>
    </div>
  );
}

export function ReactPropsDemo() {
  const [lastMsg, setLastMsg] = useState("");
  const [isAliceOnline, setIsAliceOnline] = useState(true);

  return (
    <DemoCard title="Props">
      <p className="text-xs text-(--text-3)">Props flow from parent → child. The parent owns the data; the child renders it.</p>
      <div className="space-y-2">
        <UserCard name="Alice" role="Senior Engineer" isOnline={isAliceOnline} onMessage={() => setLastMsg("Messaged Alice!")} />
        <UserCard name="Bob" role="Designer" isOnline={false} onMessage={() => setLastMsg("Messaged Bob!")} />
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={() => setIsAliceOnline((v) => !v)} className={childBtnClass}>
          Toggle Alice: {isAliceOnline ? "Online" : "Offline"}
        </button>
      </div>
      {lastMsg && <p className="text-green-400 text-sm">{lastMsg}</p>}
    </DemoCard>
  );
}

// ── Prop Drilling Demo ──
const drillBtnClass = "rounded-lg border border-(--border) px-2 py-1 text-xs text-(--text-1) hover:bg-(--bg-elevated)";

function DeepChild({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return (
    <div className="rounded-lg border border-(--border) p-3">
      <p className="text-xs text-(--text-3) mb-1">DeepChild (3 levels down)</p>
      <p className="text-sm text-(--text-1)">Theme: <strong>{theme}</strong></p>
      <button onClick={onToggle} className={drillBtnClass}>Toggle theme</button>
    </div>
  );
}
function Middle({ theme, onToggle }: { theme: string; onToggle: () => void }) {
  return (
    <div className="rounded-lg border border-dashed border-(--border) p-3">
      <p className="text-xs text-(--text-3) mb-2">Middle (doesn&apos;t use theme, just passes it)</p>
      <DeepChild theme={theme} onToggle={onToggle} />
    </div>
  );
}
export function PropDrillingDemo() {
  const [theme, setTheme] = useState("dark");
  return (
    <DemoCard title="Prop Drilling">
      <p className="text-xs text-(--text-3)">
        The parent owns <code>theme</code>. Middle must accept &amp; pass it even though it doesn&apos;t use it — this is the prop drilling problem. Solution: Context or state management.
      </p>
      <div className="rounded-lg border border-(--border) p-3">
        <p className="text-xs text-(--text-3) mb-2">Parent (owns state)</p>
        <Middle theme={theme} onToggle={() => setTheme((t) => (t === "dark" ? "light" : "dark"))} />
      </div>
    </DemoCard>
  );
}
