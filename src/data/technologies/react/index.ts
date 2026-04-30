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
      children: [
        {
          id: "react-components",
          title: "Components & JSX",
          iconName: "Layers",
          link: "https://react.dev/learn/your-first-component",
          theory: "Components are the foundation of any React app. JSX lets you write HTML-like markup inside JavaScript, making UI code more readable and expressive."
        },
        {
          id: "react-props",
          title: "Props & Data Flow",
          iconName: "ArrowRightLeft",
          link: "https://react.dev/learn/passing-props-to-a-component",
          theory: "Props pass information from parent to child components. React enforces a one-way data flow to make your application predictable and easier to debug."
        },
        {
          id: "react-state",
          title: "State & Hooks",
          iconName: "RefreshCw",
          link: "https://react.dev/learn/state-a-components-memory",
          theory: "State is a component's memory. useState lets you track values that change over time, triggering re-renders when updated."
        },
        {
          id: "react-events",
          title: "Event Handling",
          iconName: "MousePointerClick",
          link: "https://react.dev/learn/responding-to-events",
          theory: "React lets you add event handlers to JSX. Event handlers are functions defined inside your components that respond to user interactions."
        }
      ]
    },
    {
      id: "react-advanced",
      title: "Advanced Concepts",
      iconName: "Zap",
      theory: "Once you understand components and state, dive into React's advanced patterns that power production-grade applications.",
      children: [
        {
          id: "react-context",
          title: "Context API",
          iconName: "Share2",
          link: "https://react.dev/learn/passing-data-deeply-with-context",
          theory: "Context lets you pass data through the component tree without passing props at every level — ideal for global state like themes or auth."
        },
        {
          id: "react-effects",
          title: "useEffect & Side Effects",
          iconName: "GitBranch",
          link: "https://react.dev/learn/synchronizing-with-effects",
          theory: "Effects let you run code after React has updated the DOM. Use them to synchronize your component with external systems."
        },
        {
          id: "react-performance",
          title: "Performance Optimization",
          iconName: "Gauge",
          link: "https://react.dev/learn/render-and-commit",
          theory: "React re-renders when state changes. Learn useMemo, useCallback, and React.memo to skip unnecessary renders and keep your app fast."
        },
        {
          id: "react-patterns",
          title: "Component Patterns",
          iconName: "PuzzlePiece",
          link: "https://react.dev/learn/reusing-logic-with-custom-hooks",
          theory: "Custom hooks, compound components, and render props are advanced patterns for sharing logic and building flexible, reusable UI."
        }
      ]
    },
    {
      id: "react-ecosystem",
      title: "React Ecosystem",
      iconName: "Globe",
      theory: "React pairs with a rich ecosystem of libraries for routing, data fetching, and state management.",
      children: [
        {
          id: "react-router",
          title: "Routing with Next.js",
          iconName: "Navigation",
          link: "https://nextjs.org/docs/app/building-your-application/routing",
          theory: "The App Router in Next.js uses file-based routing with React Server Components, offering nested layouts, loading states, and error handling out of the box."
        },
        {
          id: "react-query",
          title: "Data Fetching & Caching",
          iconName: "Database",
          link: "https://tanstack.com/query/latest",
          theory: "TanStack Query handles server state — caching, background refetching, and synchronization — so you don't have to manage it manually."
        }
      ]
    }
  ]
};

export default react;
