import type { TopicNode } from "@/data/types";

export const serverComponents: TopicNode = {
  id: "react-server-components",
  title: "React Server Components",
  iconName: "Server",
  link: "https://react.dev/reference/rsc/server-components",
  theory:
    "React Server Components (RSC) run exclusively on the server. They can access databases, filesystems, and private APIs directly without shipping any JavaScript to the browser. Combined with Client Components, RSC gives you a split architecture: heavy data-fetching logic stays on the server while interactive UI runs on the client.",
  theoryDetail: {
    keyConcepts: [
      "'use client' marks the boundary where server rendering hands off to client-side React — everything imported below it becomes client code",
      "Server Components can directly `await` data from databases, filesystems, or microservices — no useEffect or fetch-in-component needed",
      "Server Components cannot use hooks (useState, useEffect, etc.) or browser APIs — those require 'use client'",
      "Props passed from Server → Client components must be serializable (no functions, classes, or Dates)",
      "Server Components reduce bundle size: their code and dependencies never reach the browser",
      "'use server' marks functions as Server Actions — callable from client components like regular async functions but execute on the server",
    ],
    whyItMatters:
      "RSC fundamentally changes how React apps fetch data. Instead of the waterfall pattern (render → useEffect → loading spinner → render again), data is resolved on the server before any HTML is sent. The result: smaller bundles, faster initial loads, direct database access, and no client-side loading spinners for initial data.",
    commonPitfalls: [
      "Marking everything 'use client' out of habit — defeats the purpose; keep components server-side by default",
      "Trying to use useState or useEffect in a Server Component — use 'use client' for interactive parts only",
      "Passing non-serializable props (functions, class instances) from Server → Client components",
      "Not understanding the composition model: a Server Component CAN render a Client Component, but a Client Component can only render Server Components via children props",
      "Over-fetching in Server Components — just because you CAN query the database directly doesn't mean you should in every component",
    ],
    examples: [
      {
        title: "Server Component — Direct Data Access",
        description:
          "Server Components can directly query databases without useEffect or API routes. This code runs on the server only — zero JS shipped to the client.",
        code: `// app/users/page.tsx — this is a Server Component by default
import { db } from '@/lib/database';

// ✅ Direct database access — no useEffect, no loading state
export default async function UsersPage() {
  const users = await db.query('SELECT id, name, email FROM users LIMIT 20');

  return (
    <section>
      <h1>Team Members</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// ❌ This would fail in a Server Component:
// const [users, setUsers] = useState([]);  // hooks not allowed
// useEffect(() => fetch(...), []);          // no browser APIs`,
        language: "tsx",
      },
      {
        title: "Server + Client Composition",
        description:
          "The key pattern: Server Components handle data, Client Components handle interactivity. Pass data down as serializable props.",
        code: `// app/dashboard/page.tsx — Server Component
import { db } from '@/lib/database';
import { DashboardChart } from './DashboardChart'; // Client Component

export default async function DashboardPage() {
  // Fetch on server — no loading spinner needed
  const metrics = await db.getMetrics();

  // Pass serializable data to the interactive client component
  return (
    <main>
      <h1>Dashboard</h1>
      {/* ✅ Server renders the data, Client makes it interactive */}
      <DashboardChart data={metrics} />
    </main>
  );
}

// ------------------------------------
// app/dashboard/DashboardChart.tsx — Client Component
'use client';

import { useState } from 'react';

export function DashboardChart({ data }: { data: Metric[] }) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const filtered = data.filter(m => m.range === timeRange);

  return (
    <div>
      <select value={timeRange} onChange={e => setTimeRange(e.target.value as any)}>
        <option value="day">Day</option>
        <option value="week">Week</option>
        <option value="month">Month</option>
      </select>
      {/* Render chart with filtered data */}
      <Chart data={filtered} />
    </div>
  );
}`,
        language: "tsx",
      },
      {
        title: "Server Actions — Mutations from Client",
        description:
          "'use server' functions are called from client components but execute on the server. They replace API routes for form submissions and mutations.",
        code: `// app/actions.ts
'use server';

import { db } from '@/lib/database';
import { revalidatePath } from 'next/cache';

// This function runs on the server when called from a client component
export async function createTodo(formData: FormData) {
  const title = formData.get('title') as string;

  if (!title || title.length < 2) {
    return { error: 'Title must be at least 2 characters' };
  }

  await db.insert('todos', { title, completed: false });

  // Revalidate the page to show the new todo
  revalidatePath('/todos');
  return { success: true };
}

// ------------------------------------
// app/todos/AddTodo.tsx
'use client';

import { useActionState } from 'react';
import { createTodo } from '../actions';

export function AddTodo() {
  const [state, formAction, isPending] = useActionState(createTodo, null);

  return (
    <form action={formAction}>
      <input name="title" placeholder="New todo..." disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Adding...' : 'Add'}
      </button>
      {state?.error && <p className="error">{state.error}</p>}
    </form>
  );
}`,
        language: "tsx",
      },
    ],
  },
};
