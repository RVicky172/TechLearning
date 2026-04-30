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
| Component CSS modules | `src/components/ComponentName.module.css` |
| Page CSS modules | `src/app/path/page.module.css` |

- **Components**: PascalCase filenames, named exports (`export function Header()`)
- **Pages**: default export required by Next.js (`export default function Page()`)
- **Data files**: lowercase filenames, all types exported from the same file as the data
- **Path aliases**: always use `@/*` (maps to `src/*`), never use relative `../../` imports

---

## CSS Convention

**No inline `style={}` attributes are allowed anywhere in the codebase.**

All styling follows this priority order:

1. **Tailwind utility classes** (`className="..."`) — use for all standard styling
2. **CSS Modules** (`ComponentName.module.css`) — use when a value cannot be expressed as a static Tailwind class (e.g. values computed from props at runtime)
3. **`globals.css`** — reserved for CSS resets and base `:root` custom properties only

### CSS Module rules

- One `.module.css` file per component or per page, co-located alongside it
- Filename matches the component/page: `Sidebar.module.css` lives next to `Sidebar.tsx`
- Use `data-*` attributes to drive state-dependent styles instead of inline `style={{}}`
- Never use `!important`, avoid deep nesting beyond two levels

```tsx
// ✅ correct — data attribute drives the CSS rule
<a className={styles.treeItem} data-depth={depth}>

// ✅ correct — use CSS variable tokens for all colors
<div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl p-5">

// ❌ forbidden — no inline style attributes, no hardcoded hex colors
<a style={{ paddingLeft: `${8 + depth * 14}px` }}>
```

```css
/* Sidebar.module.css — data-depth drives indentation without inline styles */
.treeItem { padding-right: 8px; }
.treeItem[data-depth="0"] { padding-left: 8px; }
.treeItem[data-depth="1"] { padding-left: 22px; }
```

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

### Theme System

The app uses a CSS custom property token system defined in `src/app/globals.css`. Two themes are supported — **dark** (default) and **light** — toggled by setting `data-theme="dark"|"light"` on `<html>`.

- `ThemeProvider` in `src/contexts/ThemeContext.tsx` manages state and persists to `localStorage`.
- A no-flash script in `layout.tsx` reads `localStorage` before hydration to prevent the flash of wrong theme.
- Use `useTheme()` hook from `@/contexts/ThemeContext` to read `theme` or call `toggle()`.

### Color Tokens

**Always use these CSS variables — never hardcode hex values or Tailwind neutral/color classes for structural UI.**

| Token | Role |
|---|---|
| `var(--bg-root)` | Page / outermost background |
| `var(--bg-surface)` | Card, panel, header background |
| `var(--bg-elevated)` | Hover state for cards, dropdown backgrounds |
| `var(--bg-code)` | Code block / monospace areas |
| `var(--border)` | Default border color |
| `var(--border-hover)` | Focused or hovered border |
| `var(--text-1)` | Primary body text |
| `var(--text-2)` | Secondary / description text |
| `var(--text-3)` | Muted labels, placeholders, icons |
| `var(--accent)` | Accent background (buttons, active states) |
| `var(--accent-hover)` | Hover state for accent buttons |
| `var(--accent-fg)` | Accent foreground text and icons |
| `var(--accent-subtle)` | Tinted accent background panels |
| `var(--success)` | Success / completion color |
| `var(--success-subtle)` | Tinted success background panels |
| `var(--warning)` | Warning color |
| `var(--warning-subtle)` | Tinted warning background panels |

Use Tailwind's arbitrary-value syntax to apply tokens: `bg-[var(--bg-surface)]`, `text-[var(--text-2)]`, `border-[var(--border)]`.

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
