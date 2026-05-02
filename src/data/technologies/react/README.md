# React Technology Data

This folder contains all learning content for the React technology. Content is split by section so each topic stays small, focused, and easy to maintain.

## Current Structure

```text
react/
├── index.ts
├── README.md
│
├── basics/
│   ├── index.ts
│   ├── components.ts
│   ├── props.ts
│   ├── state.ts
│   ├── virtualDom.ts
│   ├── diffing.ts
│   ├── renderPipeline.ts
│   ├── hydration.ts
│   ├── events.ts
│   ├── conditionalRendering.ts
│   ├── listsAndKeys.ts
│   ├── forms.ts
│   ├── propsDrilling.ts
│   └── lifecycleMethods.ts
│
├── hooks/
│   ├── index.ts
│   ├── useState.ts
│   ├── useReducer.ts
│   ├── useRef.ts
│   ├── useMemoCallback.ts
│   ├── useContext.ts
│   ├── useEffect.ts
│   ├── effectAlternatives.ts
│   ├── useLayoutEffect.ts
│   ├── useTransition.ts
│   └── custom.ts
│
├── advanced/
│   ├── index.ts
│   ├── context.ts
│   ├── stateStrategy.ts
│   ├── effects.ts
│   ├── performance.ts
│   ├── virtualization.ts
│   └── patterns.ts
│
├── patterns/
│   ├── index.ts
│   ├── errorBoundaries.ts
│   ├── testing.ts
│   ├── forwardRef.ts
│   ├── hoc.ts
│   ├── lazyLoading.ts
│   ├── portals.ts
│   └── renderProps.ts
│
└── ecosystem/
    ├── index.ts
    ├── routing.ts
    ├── serverClientBoundaries.ts
    └── query.ts
```

## Section Inventory

Top-level order in `react/index.ts`:

1. Basics of React
2. React Hooks
3. Advanced Concepts
4. Patterns & Techniques
5. React Ecosystem

### Basics of React

- Components & JSX
- Props & Data Flow
- State & Hooks
- Virtual DOM
- Diffing & Reconciliation
- Render, Reconciliation, Commit
- Hydration
- Event Handling
- Conditional Rendering
- Lists & Keys
- Forms & Controlled Inputs
- Props Drilling
- Lifecycle Methods (Class Components)

### React Hooks

- useState
- useReducer
- useRef
- useMemo & useCallback
- useContext
- useEffect
- You Might Not Need an Effect
- useLayoutEffect
- useTransition & useDeferredValue
- Custom Hooks

### Advanced Concepts

- Context API
- State Management Strategy
- useEffect & Side Effects
- Performance Optimization
- List Virtualization
- Component Patterns

### Patterns & Techniques

- Error Boundaries
- forwardRef
- Higher-Order Components
- Lazy Loading & Suspense
- Testing React Behavior
- Portals
- Render Props

### React Ecosystem

- Routing with Next.js
- Server vs Client Components
- Data Fetching & Caching

## How It Works

- Each topic file exports one named `TopicNode`.
- Each section `index.ts` assembles a parent `TopicNode` with a `children` array.
- `react/index.ts` assembles the final `Technology` object consumed by the app.

## Adding a New Topic

1. Create a topic file in the correct section folder.
2. Export a named `TopicNode` from that file.
3. Import it in the section `index.ts`.
4. Add it to the section `children` array in the intended order.
5. Update this README section inventory.

## Types Reference

Types are defined in `src/data/types.ts`.

- `Technology`: top-level object for a technology.
- `TopicNode`: a node in the learning tree.
- `TheoryDetail`: key concepts, why it matters, pitfalls, and examples.
