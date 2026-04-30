---
description: "Use when adding technologies, topics, components, pages, or UI features to TechLearning. Covers data structure, file conventions, design system, layout patterns, and animation standards."
---

# TechLearning Codebase Instructions

## Project Overview

A personalized learning website built with Next.js 15 App Router, TypeScript, Tailwind CSS, Framer Motion, and Lucide React. The UI follows a VS Code documentation-style layout: sticky top bar, fixed left sidebar, content fills the remaining canvas.

---

## File & Folder Conventions

| Purpose | Location |
|---|---|
| Pages / Routes | `src/app/` (App Router) |
| Dynamic tech routes | `src/app/tech/[id]/page.tsx` |
| Reusable UI components | `src/components/PascalCase.tsx` |
| Data & types | `src/data/technologies.ts` |

- **Components**: PascalCase filenames, named exports (`export function Header()`)
- **Pages**: default export required by Next.js (`export default function Page()`)
- **Data files**: lowercase filenames, all types exported from the same file as the data
- **Path aliases**: always use `@/*` (maps to `src/*`), never use relative `../../` imports

---

## Data Structure

All learning data lives in `src/data/technologies.ts`. **Never scatter data in component files.**

```typescript
// Extend or modify these types — never duplicate them elsewhere
export type TopicNode = {
  id: string;          // unique slug
  title: string;
  theory?: string;     // inline explanation text shown beneath the title
  link?: string;       // external study resource URL
  completed?: boolean; // per-topic completion flag
  children?: TopicNode[]; // recursive sub-topics
};

export type Technology = {
  id: string;          // URL slug (lowercase, no spaces)
  name: string;        // display name
  description: string; // one-liner shown on the landing card
  color: string;       // Tailwind bg class for theming (e.g. "bg-blue-500")
  iconName: string;    // exact Lucide React icon name (e.g. "FileCode2")
  tree: TopicNode[];   // top-level topic nodes
};
```

### Adding a New Technology

Append to the `technologies` array. All fields are required except `theory`, `link`, `completed`, and `children` on `TopicNode`.

```typescript
{
  id: "python",            // must be lowercase, URL-safe
  name: "Python",
  description: "Readable, general-purpose language for scripting, data, and AI.",
  color: "bg-yellow-500",
  iconName: "Braces",      // verify name exists in lucide-react
  tree: [ ... ]
}
```

---

## Design System

### Color Tokens

Always use these specific values — do not introduce new background colors without updating this guide.

| Role | Value |
|---|---|
| Root background | `bg-[#0a0a0a]` |
| Card / panel background | `bg-[#0f111a]` |
| Hover state (cards) | `bg-[#1a1c23]` |
| Code block background | `bg-[#1e1e1e]` |
| Border (default) | `border-neutral-800` |
| Border (hover) | `border-neutral-500` or `border-neutral-700` |
| Primary accent | `text-blue-400` / `bg-blue-600` |
| Success / completion | `text-emerald-500` |
| Body text | `text-neutral-100` |
| Secondary text | `text-neutral-300` |
| Muted text / labels | `text-neutral-400` / `text-neutral-500` |

### Typography

- Section headings: `text-2xl md:text-3xl font-bold tracking-tight`
- Card titles: `text-lg font-semibold text-neutral-100`
- Body/description: `text-sm text-neutral-400 leading-relaxed`
- Section labels (sidebar, etc.): `text-xs font-semibold text-neutral-500 uppercase tracking-wider`

---

## Layout Architecture

The global layout is defined in `src/app/layout.tsx` and **must not be altered per-page**:

```
<Header />              ← sticky top bar, z-50, height h-14
<div class="flex flex-1">
  <Sidebar />           ← fixed left, w-64, top-14, hidden on mobile
  <main class="flex-1 md:ml-64">
    {children}          ← page content goes here
  </main>
</div>
```

- **Page wrappers**: use `<main className="min-h-screen px-6 py-12 md:px-12 lg:px-20 max-w-6xl">`, no extra layout nesting
- **Mobile**: Sidebar is `hidden md:block`; Header shows a `Menu` icon for mobile

---

## Component Patterns

### "use client" Rule

| Component type | Directive |
|---|---|
| Pages with animations or hooks | `"use client"` at top |
| Root `layout.tsx` | No directive (Server Component) |
| `Header`, `Sidebar`, any interactive component | `"use client"` |

### Animations (Framer Motion)

All motion must use `framer-motion`. Never use raw CSS transitions for entrance animations.

```tsx
// Entrance: fade + translate
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, delay: index * 0.1 }}
>

// Scroll reveal (for tree nodes)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: "-50px" }}
  transition={{ duration: 0.5 }}
>

// Hover (cards only)
whileHover={{ scale: 1.03, y: -5 }}
```

- Stagger list items with `delay: index * 0.1`
- Never wrap animations in `useEffect` guards — use `"use client"` instead

### Icons (Lucide React)

```tsx
import * as Icons from "lucide-react";

// Static import (preferred when icon name is known at compile time)
import { ArrowLeft, ExternalLink } from "lucide-react";

// Dynamic lookup (use for data-driven icons like tech cards)
const IconComponent = (Icons as any)[tech.iconName] || Icons.Code;
```

- Always provide a fallback (`|| Icons.Code`)
- Verify icon names at https://lucide.dev before adding to data

### Navigation

- Internal links: always `<Link href="...">` from `next/link`
- External links: `<a href="..." target="_blank" rel="noopener noreferrer">`
- Never use `<a>` for internal navigation

---

## Tech Page Tree

The tree is rendered recursively via `TreeNodeComponent` in `src/app/tech/[id]/page.tsx`.

- Root nodes (`level === 0`): full-width cards, no connector line
- Child nodes (`level > 0`): indented `ml-8 md:ml-12`, vertical connector line on left
- Each node shows: **title** → **theory** (muted text below title) → **link** (blue anchor)
- Keep `TreeNodeComponent` in the same file as the tech page — do not extract unless reused elsewhere

---

## README-manage.md

Update `README-manage.md` when:
- A new field is added to `TopicNode` or `Technology`
- A new page route or section is introduced
- Running or build instructions change

Do **not** create additional markdown documentation files for individual features.
