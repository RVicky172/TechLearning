import type { TopicNode } from "@/data/types";

export const state: TopicNode = {
  id: "react-state",
  title: "State & Hooks",
  iconName: "RefreshCw",
  link: "https://react.dev/learn/state-a-components-memory",
  theory:
    "State is a component's memory — data that persists between renders and causes the UI to update when it changes. useState is the foundational hook: it returns the current value and a setter that triggers a re-render. Unlike a regular variable (which resets on every render), state survives re-renders and is isolated per component instance.",
  theoryDetail: {
    keyConcepts: [
      "useState returns [currentValue, setter] — calling setter schedules a re-render with the new value",
      "State updates are asynchronous and batched — reading state immediately after the setter still shows the old value",
      "Each component instance gets its own isolated state — rendering <Counter /> twice gives two independent counters",
      "Functional updates (setState(prev => prev + 1)) are safe in async contexts where closures over state can go stale",
      "For objects, always spread the old state — React won't merge partial updates like this.setState() did in class components",
      "Lazy initialization: pass a function to useState(() => compute()) to avoid re-running expensive setup on every render",
    ],
    whyItMatters:
      "State is what makes React interactive. Every feature a user interacts with — forms, modals, filters, shopping carts — involves updating some piece of state. The subtle rules around batching, functional updates, and stale closures are the #1 source of bugs for React developers at every level.",
    commonPitfalls: [
      "Stale closure trap: handlers calling setX(x + 1) instead of setX(prev => prev + 1) silently drop updates when multiple updates fire before a re-render",
      "Mutating state directly (array.push(), object.prop = value) — React uses reference equality to detect changes; in-place mutation hides the change",
      "Reading state immediately after calling the setter — the new value is only available on the next render",
      "Storing derived data (filteredList, total) in state — compute from existing state instead; dual state creates sync bugs",
      "Using one useState per form field in large forms — group into an object or switch to useReducer",
    ],
    examples: [
      {
        title: "Stale Closure Trap & Functional Updates",
        description:
          "Classic React bug: handlers close over a stale count snapshot. Use the functional form — setCount(prev => prev + 1) — to always work from the latest committed value.",
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  // ❌ Stale closure: all three calls see count = 0, result is count = 1
  const buggyTriple = () => {
    setCount(count + 1); // count is 0 here
    setCount(count + 1); // count is STILL 0 — same closure!
    setCount(count + 1); // count is STILL 0
  };

  // ✅ Functional update: each call receives the latest committed value
  const safeTriple = () => {
    setCount(prev => prev + 1); // 0 → 1
    setCount(prev => prev + 1); // 1 → 2
    setCount(prev => prev + 1); // 2 → 3
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={buggyTriple}>+3 (buggy — adds 1)</button>
      <button onClick={safeTriple}>+3 (correct)</button>
    </div>
  );
}`,
        language: "tsx",
      },
      {
        title: "Object State — Always Spread",
        description:
          "React doesn't deep-merge object state. Every update must spread the full previous shape or you'll silently delete unrelated fields.",
        code: `import { useState } from 'react';

interface UserProfile {
  name: string;
  email: string;
  preferences: { theme: 'light' | 'dark'; notifications: boolean };
}

function ProfileEditor() {
  const [user, setUser] = useState<UserProfile>({
    name: 'Alice',
    email: 'alice@example.com',
    preferences: { theme: 'light', notifications: true },
  });

  // ✅ Spread outer object — only override the changed field
  const updateName = (name: string) =>
    setUser(prev => ({ ...prev, name }));

  // ✅ Nested update: spread BOTH the outer and inner object
  const toggleTheme = () =>
    setUser(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme: prev.preferences.theme === 'light' ? 'dark' : 'light',
      },
    }));

  // ❌ Anti-pattern: this nukes email and preferences
  // setUser({ name: 'Bob' });

  return (
    <form>
      <input value={user.name} onChange={e => updateName(e.target.value)} />
      <button type="button" onClick={toggleTheme}>
        Theme: {user.preferences.theme}
      </button>
      <p>Email: {user.email}</p>
    </form>
  );
}`,
        language: "tsx",
      },
      {
        title: "Shopping Cart — Real-World Array State",
        description:
          "Add, update quantity, and remove — the three array operations every app needs. Extracted into a custom hook for reuse.",
        code: `import { useState } from 'react';

interface CartItem { id: string; name: string; price: number; qty: number }

function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (product: Omit<CartItem, 'qty'>) =>
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        // Item exists — increment quantity
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      // New item — append
      return [...prev, { ...product, qty: 1 }];
    });

  const updateQty = (id: string, qty: number) =>
    setItems(prev =>
      qty === 0
        ? prev.filter(i => i.id !== id)        // qty = 0 → remove
        : prev.map(i => i.id === id ? { ...i, qty } : i)
    );

  const removeItem = (id: string) =>
    setItems(prev => prev.filter(i => i.id !== id));

  // ✅ Derived values — NOT stored in state, computed each render
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return { items, addItem, removeItem, updateQty, total, count };
}`,
        language: "tsx",
      },
      {
        title: "Derived State Anti-pattern",
        description:
          "Never sync computed values into state. They create a second source of truth that drifts. Compute inline or with useMemo.",
        code: `import { useState, useMemo } from 'react';

// ❌ Anti-pattern: filtered is derived from products + search
//    but now you have TWO sources of truth that can diverge
function BadList({ products }) {
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState(products);

  const handleSearch = (q: string) => {
    setSearch(q);
    setFiltered(products.filter(p => p.name.includes(q)));
    // Bug waiting to happen: if products prop changes, filtered is stale
  };
  return null;
}

// ✅ Correct: one piece of state (search), derive everything else
function GoodList({ products }: { products: { id: number; name: string; price: number }[] }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name');

  // Runs every render — add useMemo only if product list is 1000+ items
  const displayed = products
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'name'
      ? a.name.localeCompare(b.name)
      : a.price - b.price
    );

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." />
      <select value={sortBy} onChange={e => setSortBy(e.target.value as 'name' | 'price')}>
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
      <p>{displayed.length} results</p>
    </div>
  );
}`,
        language: "tsx",
      },
    ],
  },
};
