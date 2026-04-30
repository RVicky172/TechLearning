import type { Technology } from "@/data/types";

const react: Technology = {
  id: "react",
  name: "React",
  description: "Modern UI library for building composable, reactive web and native interfaces.",
  color: "bg-blue-500",
  iconName: "Layout",
  deviconClass: "devicon-react-original colored",
  tree: [
    {
      id: "react-basics",
      title: "Basics of React",
      iconName: "BookOpen",
      theory: "React applications are built from isolated pieces of UI called components. This section covers the foundational knowledge required to build React apps from scratch.",
      theoryDetail: {
        keyConcepts: [
          "React apps are trees of composable function components",
          "The virtual DOM diffs updates before touching the real DOM",
          "Data flows one-way — from parent to child via props",
        ],
        whyItMatters:
          "React's component model scales from a single button to enterprise apps with hundreds of developers. The predictable data flow and virtual DOM make apps both performant and maintainable.",
        commonPitfalls: [
          "Building large, monolithic components — keep them small and focused",
          "Mutating data directly instead of returning new values",
          "Skipping the React DevTools — they're essential for understanding component trees",
        ],
      },
      children: [
        {
          id: "react-components",
          title: "Components & JSX",
          iconName: "Layers",
          link: "https://react.dev/learn/your-first-component",
          theory: "Components are the foundation of any React app. JSX lets you write HTML-like markup inside JavaScript, making UI code more readable and expressive.",
          theoryDetail: {
            keyConcepts: [
              "JSX compiles to React.createElement() calls, not actual HTML",
              "Component names must start with an uppercase letter",
              "Return a single root element — use <> fragments to wrap without adding DOM nodes",
            ],
            whyItMatters:
              "Components are the fundamental unit of React. Everything — buttons, forms, pages — is a component, making UIs composable and independently testable.",
            commonPitfalls: [
              "Using lowercase names (React renders them as DOM tags instead of components)",
              "Returning multiple sibling elements without a wrapper or fragment",
              "Embedding complex logic directly in JSX — extract to variables or helper functions",
            ],
          },
        },
        {
          id: "react-props",
          title: "Props & Data Flow",
          iconName: "ArrowRightLeft",
          link: "https://react.dev/learn/passing-props-to-a-component",
          theory: "Props pass information from parent to child components. React enforces a one-way data flow to make your application predictable and easier to debug.",
          theoryDetail: {
            keyConcepts: [
              "Props are read-only — a component never modifies its own props",
              "Destructure props in the function signature for clarity",
              "children is a built-in prop for passing nested JSX content",
            ],
            whyItMatters:
              "One-way data flow makes bugs easier to trace — you always know where state comes from and which component controls it.",
            commonPitfalls: [
              "Prop drilling more than 2–3 levels deep — switch to Context",
              "Passing new object/array literals as props defeating React.memo optimizations",
              "Using props for values that should be local state",
            ],
          },
        },
        {
          id: "react-state",
          title: "State & Hooks",
          iconName: "RefreshCw",
          link: "https://react.dev/learn/state-a-components-memory",
          theory: "State is a component's memory. useState lets you track values that change over time, triggering re-renders when updated.",
          theoryDetail: {
            keyConcepts: [
              "useState returns [currentValue, setter] — call the setter to trigger a re-render",
              "State updates are batched and asynchronous inside event handlers",
              "Each component instance has its own isolated state",
            ],
            whyItMatters:
              "State is what turns a static HTML mockup into an interactive app. Every user interaction that changes the UI should update some piece of state.",
            commonPitfalls: [
              "Calling array.push() or mutating objects directly — always return a new value",
              "Reading state immediately after setting it — updates are asynchronous",
              "Storing redundant or derived values in state instead of computing them on render",
            ],
          },
        },
        {
          id: "react-events",
          title: "Event Handling",
          iconName: "MousePointerClick",
          link: "https://react.dev/learn/responding-to-events",
          theory: "React lets you add event handlers to JSX. Event handlers are functions defined inside your components that respond to user interactions.",
          theoryDetail: {
            keyConcepts: [
              "Pass event handlers as props: onClick={handleClick}, not onClick={handleClick()}",
              "Synthetic events wrap native events for cross-browser consistency",
              "e.preventDefault() stops default actions like form submission or link navigation",
            ],
            whyItMatters:
              "Event handling connects your component logic to user interactions. React's unified synthetic event system means the same code works reliably across all browsers.",
            commonPitfalls: [
              "Calling the handler immediately by adding () — always pass the function reference",
              "Forgetting e.preventDefault() on form submissions causing full page reloads",
              "Not cleaning up manually added addEventListener calls causing memory leaks",
            ],
          },
        },
      ],
    },
    {
      id: "react-advanced",
      title: "Advanced Concepts",
      iconName: "Zap",
      theory: "Once you understand components and state, dive into React's advanced patterns that power production-grade applications.",
      theoryDetail: {
        keyConcepts: [
          "Context propagates data without explicit prop threading at every level",
          "Effects synchronize components with external systems after render",
          "Memoization trades memory for skipped renders — profile before applying",
        ],
        whyItMatters:
          "Advanced React patterns are what separate maintainable, scalable apps from ones that become impossible to modify. Mastering them is required for senior-level front-end work.",
        commonPitfalls: [
          "Over-using Context for every piece of state — it re-renders all consumers on change",
          "Adding useEffect without understanding the dependency array — the most common source of bugs",
          "Premature memoization before profiling — it adds complexity without guaranteed benefit",
        ],
      },
      children: [
        {
          id: "react-context",
          title: "Context API",
          iconName: "Share2",
          link: "https://react.dev/learn/passing-data-deeply-with-context",
          theory: "Context lets you pass data through the component tree without passing props at every level — ideal for global state like themes or auth.",
          theoryDetail: {
            keyConcepts: [
              "createContext() creates a Context with a Provider and Consumer",
              "useContext(MyContext) reads the nearest Provider's value up the tree",
              "Context updates re-render all consumers — memoize context values with useMemo",
            ],
            whyItMatters:
              "Context eliminates prop drilling for cross-cutting state like authentication, theme, and locale — without requiring a full external state management library.",
            commonPitfalls: [
              "Putting too much data in one Context — split by concern for better performance",
              "Not memoizing the context value object causing all consumers to re-render on every parent render",
              "Using Context for local state that could simply be lifted one level",
            ],
          },
        },
        {
          id: "react-effects",
          title: "useEffect & Side Effects",
          iconName: "GitBranch",
          link: "https://react.dev/learn/synchronizing-with-effects",
          theory: "Effects let you run code after React has updated the DOM. Use them to synchronize your component with external systems.",
          theoryDetail: {
            keyConcepts: [
              "useEffect(fn, [deps]) runs fn after render whenever deps change",
              "Return a cleanup function to unsubscribe, cancel timers, or abort fetches",
              "An empty dependency array [] runs the effect only once after the first render",
            ],
            whyItMatters:
              "Effects are how React syncs with the outside world — APIs, timers, browser APIs. Without proper cleanup, you get memory leaks and stale state updates on unmounted components.",
            commonPitfalls: [
              "Missing dependencies causing stale closure bugs that are hard to track down",
              "Updating state in an effect without a guard causing an infinite render loop",
              "Fetching data without an AbortController leading to state updates after unmount",
            ],
          },
        },
        {
          id: "react-performance",
          title: "Performance Optimization",
          iconName: "Gauge",
          link: "https://react.dev/learn/render-and-commit",
          theory: "React re-renders when state changes. Learn useMemo, useCallback, and React.memo to skip unnecessary renders and keep your app fast.",
          theoryDetail: {
            keyConcepts: [
              "React.memo wraps a component to skip re-renders when props haven't changed",
              "useMemo(fn, [deps]) caches an expensive computed value between renders",
              "useCallback(fn, [deps]) returns a stable function reference across renders",
            ],
            whyItMatters:
              "At scale, unnecessary renders compound. A well-memoized component tree keeps interactions instant even with deeply nested state changes.",
            commonPitfalls: [
              "Memoizing everything preemptively — profile with React DevTools Profiler first",
              "Passing new object/array literals as props defeating React.memo's comparison",
              "Omitting dependencies from useCallback causing the memoized function to go stale",
            ],
          },
        },
        {
          id: "react-patterns",
          title: "Component Patterns",
          iconName: "PuzzlePiece",
          link: "https://react.dev/learn/reusing-logic-with-custom-hooks",
          theory: "Custom hooks, compound components, and render props are advanced patterns for sharing logic and building flexible, reusable UI.",
          theoryDetail: {
            keyConcepts: [
              "Custom hooks are functions starting with 'use' that encapsulate reusable stateful logic",
              "Compound components share implicit state via Context for flexible composition",
              "The 'as' prop pattern lets consumers control the rendered HTML element",
            ],
            whyItMatters:
              "Patterns enable sharing behavior across components without duplicating code. Custom hooks in particular replaced higher-order components as React's primary reuse mechanism.",
            commonPitfalls: [
              "Creating hook abstractions too early — duplicate first, then extract when the pattern is clear",
              "Compound components that are too rigid — expose escape hatches for customization",
              "Mixing render logic into custom hooks making them harder to test in isolation",
            ],
          },
        },
      ],
    },
    {
      id: "react-ecosystem",
      title: "React Ecosystem",
      iconName: "Globe",
      theory: "React pairs with a rich ecosystem of libraries for routing, data fetching, and state management.",
      theoryDetail: {
        keyConcepts: [
          "Next.js adds file-based routing, SSR, and React Server Components on top of React",
          "TanStack Query manages server state — caching, refetching, and synchronization",
          "The ecosystem also includes Zustand, Jotai, and Redux for complex client state",
        ],
        whyItMatters:
          "React itself only handles the view layer. Knowing the ecosystem means knowing which tool to reach for — routing, data fetching, and state each have best-in-class solutions.",
        commonPitfalls: [
          "Re-implementing what ecosystem libraries already solve (caching, routing, forms)",
          "Mixing server state (TanStack Query) and client state (useState/Zustand) without a clear boundary",
          "Adopting too many libraries before understanding what problems they actually solve",
        ],
      },
      children: [
        {
          id: "react-router",
          title: "Routing with Next.js",
          iconName: "Navigation",
          link: "https://nextjs.org/docs/app/building-your-application/routing",
          theory: "The App Router in Next.js uses file-based routing with React Server Components, offering nested layouts, loading states, and error handling out of the box.",
          theoryDetail: {
            keyConcepts: [
              "Folders in app/ become URL segments; page.tsx is the route entry point",
              "layout.tsx wraps child routes with persistent UI like headers and sidebars",
              "Server Components fetch data directly without useEffect or client-side loading states",
            ],
            whyItMatters:
              "The App Router unifies routing and data fetching. Shared layouts persist across navigations so headers and sidebars never unnecessarily unmount and remount.",
            commonPitfalls: [
              "Forgetting 'use client' when using hooks or browser APIs in Server Components",
              "Fetching the same data in a layout and a child page — hoist or rely on caching",
              "Using dynamic segments ([id]) without generateStaticParams for static site generation",
            ],
          },
        },
        {
          id: "react-query",
          title: "Data Fetching & Caching",
          iconName: "Database",
          link: "https://tanstack.com/query/latest",
          theory: "TanStack Query handles server state — caching, background refetching, and synchronization — so you don't have to manage it manually.",
          theoryDetail: {
            keyConcepts: [
              "useQuery({ queryKey, queryFn }) fetches, caches, and auto-refetches data",
              "Query keys are the cache ID — use arrays for parameterized queries: ['user', id]",
              "useMutation handles writes and lets you invalidate related queries on success",
            ],
            whyItMatters:
              "Server state has a different lifecycle than UI state. TanStack Query manages loading, error, stale, and refetching states with almost no boilerplate.",
            commonPitfalls: [
              "Using the same queryKey for different data — keys must uniquely identify the data",
              "Not setting staleTime causing over-fetching on every component mount",
              "Invalidating too broadly after mutations causing unrelated queries to refetch",
            ],
          },
        },
      ],
    },
  ],
};

export default react;
