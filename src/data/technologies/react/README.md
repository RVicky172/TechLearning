# React Technology Data

This folder contains all learning content for the React technology. Content is split by section so each topic stays small, focused, and easy to maintain.

## Current Structure

```text
react/
├── index.ts
├── interviewQuestions.ts
├── performanceOptimization.ts
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
│   ├── duplicateKeys.ts
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
│   ├── custom.ts
│   ├── customHooksReal.ts
│   └── modern.ts
│   ├── effectAlternatives.ts
│   ├── useLayoutEffect.ts
│   ├── useTransition.ts
│   ├── accessibility.ts
│   ├── architecture.ts
│   ├── batching.ts
│   └── custom.ts
│   ├── optimisticUpdates.ts
│
├── advanced/
│   ├── index.ts
│   ├── reactCompiler.ts
│   ├── securityReact.ts
│   ├── serverComponents.ts
│   ├── suspenseStreaming.ts
│   ├── throttlingDebouncing.ts
│   ├── typescriptReact.ts
│   ├── urlState.ts
│   ├── context.ts
│   ├── stateStrategy.ts
│   ├── effects.ts
│   ├── performance.ts
│   ├── virtualization.ts
│   ├── componentDesign.ts
│   ├── compoundComponents.ts
│   └── patterns.ts
│   ├── testing.ts
│
├── patterns/
│   ├── index.ts
│   ├── errorBoundaries.ts
│   └── renderProps.ts
│   ├── forwardRef.ts
│   ├── hoc.ts
│   ├── lazyLoading.ts
    ├── deploymentProduction.ts
    ├── formPatterns.ts
    ├── reactTestingLibrary.ts
    ├── reduxToolkit.ts
│   ├── portals.ts
│   └── renderProps.ts
│
    ├── query.ts
    ├── stateManagement.ts
    └── stylingStrategies.ts
    ├── index.ts
    ├── reactRouter.ts
    ├── routing.ts
    ├── serverClientBoundaries.ts
    └── query.ts
```

## Section Inventory

Top-level order in `react/index.ts`:

1. Basics of React
2. React Hooks
3. React Performance & Optimization
4. Advanced Concepts
5. Patterns & Techniques
6. React Ecosystem
7. Interview Questions

### React Performance & Optimization

- Optimization Playbook
- Rendering and Memoization
- Lists, Virtualization, and Windowing
- Concurrency and Perceived Performance

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
- Duplicate Key Warning
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
- Custom Hooks in Real Applications
- Modern Hooks and newer React patterns

### Advanced Concepts

- Context API
- Accessibility in React
- Architecture for larger React apps
- Automatic batching
- Optimistic UI updates
- State Management Strategy
- useEffect & Side Effects
- Performance Optimization
- Debugging and DevTools
- React Compiler
- React security concerns
- Server Components
- Suspense & Streaming
- Throttling and Debouncing
- TypeScript with React
- URL state patterns
- List Virtualization
- Component Patterns

### Patterns & Techniques

- Component Design
- Compound Components
- Error Boundaries
- Testing patterns
- forwardRef
- Higher-Order Components
- Lazy Loading & Suspense
- Portals
- Render Props

### React Ecosystem

- Deployment & Production
- Form Patterns
- React Testing Library
- React Router
- Redux Toolkit
- Routing with Next.js
- Server vs Client Components
- Data Fetching & Caching
- State Management Libraries and patterns
- Styling Strategies

### Interview Questions

- Fundamentals Q&A
- Hooks & State Q&A
- Rendering & Lifecycle Q&A
- Performance Q&A
- Architecture Q&A
- System Design & Scenario Q&A

## How It Works

- Each topic file exports one named `TopicNode`.
- Each section `index.ts` assembles a parent `TopicNode` with a `children` array.
- `react/index.ts` assembles the final `Technology` object consumed by the app.
- Shared topic and technology types live in `src/data/types.ts`.

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

## Maintenance Notes

- Keep this README aligned with the actual folder structure when new React topics are added.
- Prefer current React guidance, including Server Components, modern hooks, React Compiler considerations, and production deployment topics where relevant.
