# React Technology Data

This folder contains all learning content for the **React** technology, organised into topic-scoped subfolders so each file stays small and focused.

## Folder Structure

```text
react/
├── index.ts              ← Entry point. Assembles the full Technology object.
│
├── basics/               ← "Basics of React" section
│   ├── index.ts          ← Assembles reactBasics TopicNode from child files
│   ├── components.ts     ← Components & JSX
│   ├── props.ts          ← Props & Data Flow
│   ├── state.ts          ← State & Hooks
│   └── events.ts         ← Event Handling
│
├── advanced/             ← "Advanced Concepts" section
│   ├── index.ts          ← Assembles reactAdvanced TopicNode from child files
│   ├── context.ts        ← Context API
│   ├── effects.ts        ← useEffect & Side Effects
│   ├── performance.ts    ← Performance Optimization
│   └── patterns.ts       ← Component Patterns
│
└── ecosystem/            ← "React Ecosystem" section
    ├── index.ts          ← Assembles reactEcosystem TopicNode from child files
    ├── routing.ts        ← Routing with Next.js
    └── query.ts          ← Data Fetching & Caching (TanStack Query)
```

## How It Works

Each **topic file** (e.g. `basics/state.ts`) exports a single named `TopicNode` constant:

```ts
import type { TopicNode } from "@/data/types";

export const state: TopicNode = {
  id: "react-state",
  title: "State & Hooks",
  // ...theory, theoryDetail, examples
};
```

Each **section assembler** (e.g. `basics/index.ts`) imports the topic files and wires them into a parent `TopicNode`:

```ts
import { components } from "./components";
import { props }      from "./props";
import { state }      from "./state";
import { events }     from "./events";

export const reactBasics: TopicNode = {
  id: "react-basics",
  title: "Basics of React",
  children: [components, props, state, events],
};
```

The top-level **`index.ts`** combines all three sections into the final `Technology` object consumed by the app.

## Adding a New Topic

1. Create a new file inside the relevant section folder, e.g. `basics/refs.ts`.
2. Export a named `TopicNode` constant from it.
3. Import it in the section's `index.ts` and add it to the `children` array.

## Types Reference

All types live in [`src/data/types.ts`](../../types.ts):

| Type            | Purpose                                         |
|-----------------|-------------------------------------------------|
| `Technology`    | Top-level object for a technology (React, TS…)  |
| `TopicNode`     | A single node in the learning tree              |
| `TheoryDetail`  | Rich detail: keyConcepts, pitfalls, examples    |
