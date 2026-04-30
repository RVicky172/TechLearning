export type TopicNode = {
  id: string;
  title: string;
  theory?: string;
  completed?: boolean;
  children?: TopicNode[];
  link?: string;
};

export type Technology = {
  id: string;
  name: string;
  description: string;
  color: string;
  iconName: string;
  tree: TopicNode[];
};

export const technologies: Technology[] = [
  {
    id: "react",
    name: "React",
    description: "Modern UI library for building composable, reactive web and native interfaces.",
    color: "bg-blue-500",
    iconName: "Layout",
    tree: [
      {
        id: "react-basics",
        title: "Basics of React",
        theory: "React applications are built from isolated pieces of UI called components. This section covers the foundational knowledge required to build React apps from scratch.",
        children: [
          {
            id: "react-components",
            title: "Components & JSX",
            link: "https://react.dev/learn/your-first-component",
            theory: "Components are the foundation of any React app. JSX lets you write HTML-like markup inside JavaScript, making UI code more readable and expressive."
          },
          {
            id: "react-props",
            title: "Props & Data Flow",
            link: "https://react.dev/learn/passing-props-to-a-component",
            theory: "Props pass information from parent to child components. React enforces a one-way data flow to make your application predictable and easier to debug."
          },
          {
            id: "react-state",
            title: "State & Hooks",
            link: "https://react.dev/learn/state-a-components-memory",
            theory: "State is a component's memory. useState lets you track values that change over time, triggering re-renders when updated."
          },
          {
            id: "react-events",
            title: "Event Handling",
            link: "https://react.dev/learn/responding-to-events",
            theory: "React lets you add event handlers to JSX. Event handlers are functions defined inside your components that respond to user interactions."
          }
        ]
      },
      {
        id: "react-advanced",
        title: "Advanced Concepts",
        theory: "Once you understand components and state, dive into React's advanced patterns that power production-grade applications.",
        children: [
          {
            id: "react-context",
            title: "Context API",
            link: "https://react.dev/learn/passing-data-deeply-with-context",
            theory: "Context lets you pass data through the component tree without passing props at every level — ideal for global state like themes or auth."
          },
          {
            id: "react-effects",
            title: "useEffect & Side Effects",
            link: "https://react.dev/learn/synchronizing-with-effects",
            theory: "Effects let you run code after React has updated the DOM. Use them to synchronize your component with external systems."
          },
          {
            id: "react-performance",
            title: "Performance Optimization",
            link: "https://react.dev/learn/render-and-commit",
            theory: "React re-renders when state changes. Learn useMemo, useCallback, and React.memo to skip unnecessary renders and keep your app fast."
          },
          {
            id: "react-patterns",
            title: "Component Patterns",
            link: "https://react.dev/learn/reusing-logic-with-custom-hooks",
            theory: "Custom hooks, compound components, and render props are advanced patterns for sharing logic and building flexible, reusable UI."
          }
        ]
      },
      {
        id: "react-ecosystem",
        title: "React Ecosystem",
        theory: "React pairs with a rich ecosystem of libraries for routing, data fetching, and state management.",
        children: [
          {
            id: "react-router",
            title: "Routing with Next.js",
            link: "https://nextjs.org/docs/app/building-your-application/routing",
            theory: "The App Router in Next.js uses file-based routing with React Server Components, offering nested layouts, loading states, and error handling out of the box."
          },
          {
            id: "react-query",
            title: "Data Fetching & Caching",
            link: "https://tanstack.com/query/latest",
            theory: "TanStack Query handles server state — caching, background refetching, and synchronization — so you don't have to manage it manually."
          }
        ]
      }
    ]
  },
  {
    id: "typescript",
    name: "TypeScript",
    description: "Strongly typed superset of JavaScript that catches bugs at compile time and improves IDE support.",
    color: "bg-blue-700",
    iconName: "FileCode2",
    tree: [
      {
        id: "ts-basics",
        title: "TypeScript Fundamentals",
        theory: "TypeScript adds optional static types to JavaScript. Start here to understand how type annotations work and why they make your code more maintainable.",
        children: [
          {
            id: "ts-types",
            title: "Basic Types",
            link: "https://www.typescriptlang.org/docs/handbook/2/basic-types.html",
            theory: "TypeScript supports primitives like string, number, boolean, arrays, tuples, and special types like any, unknown, and never."
          },
          {
            id: "ts-interfaces",
            title: "Interfaces & Type Aliases",
            link: "https://www.typescriptlang.org/docs/handbook/2/objects.html",
            theory: "Interfaces describe the shape of objects. Type aliases let you name any type. Both are key tools for modeling your domain."
          },
          {
            id: "ts-narrowing",
            title: "Type Narrowing",
            link: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html",
            theory: "TypeScript narrows types based on control flow. Use typeof, instanceof, and 'in' guards to work safely with union types."
          }
        ]
      },
      {
        id: "ts-advanced",
        title: "Advanced Patterns",
        theory: "Master TypeScript's most powerful features to write fully type-safe APIs, utilities, and libraries.",
        children: [
          {
            id: "ts-generics",
            title: "Generics",
            link: "https://www.typescriptlang.org/docs/handbook/2/generics.html",
            theory: "Generics let you write reusable functions and types that work with any type while preserving type safety."
          },
          {
            id: "ts-utility",
            title: "Utility Types",
            link: "https://www.typescriptlang.org/docs/handbook/utility-types.html",
            theory: "Partial, Required, Pick, Omit, Record and more — TypeScript ships built-in generic utilities for transforming existing types."
          },
          {
            id: "ts-conditional",
            title: "Conditional & Mapped Types",
            link: "https://www.typescriptlang.org/docs/handbook/2/conditional-types.html",
            theory: "Conditional types choose between types based on a condition. Mapped types transform every property of an existing type."
          }
        ]
      }
    ]
  },
  {
    id: "nodejs",
    name: "Node.js",
    description: "Event-driven JavaScript runtime built on Chrome's V8 engine for scalable server-side applications.",
    color: "bg-green-600",
    iconName: "Server",
    tree: [
      {
        id: "node-basics",
        title: "Node.js Fundamentals",
        theory: "Node.js lets JavaScript run on the server. Learn how its non-blocking I/O and event loop work to handle thousands of concurrent requests efficiently.",
        children: [
          {
            id: "node-modules",
            title: "Modules & CommonJS",
            link: "https://nodejs.org/en/docs/guides/",
            theory: "Node uses CommonJS modules (require/exports) and ESM (import/export). Understanding module resolution is key to structuring Node projects."
          },
          {
            id: "node-fs",
            title: "File System & Streams",
            link: "https://nodejs.org/api/fs.html",
            theory: "The fs module provides both synchronous and asynchronous file operations. Streams let you process large data without loading it all into memory."
          },
          {
            id: "node-http",
            title: "HTTP Module & APIs",
            link: "https://nodejs.org/api/http.html",
            theory: "Node's built-in http module creates web servers. Most projects use Express or Fastify on top of it for routing and middleware."
          }
        ]
      },
      {
        id: "node-async",
        title: "Async Programming",
        theory: "Node's power comes from asynchronous code. Master callbacks, Promises, and async/await to avoid blocking the event loop.",
        children: [
          {
            id: "node-promises",
            title: "Promises & async/await",
            link: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises",
            theory: "Promises represent future values. async/await is syntactic sugar that makes asynchronous code read like synchronous code."
          },
          {
            id: "node-eventloop",
            title: "The Event Loop",
            link: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick",
            theory: "The event loop is how Node handles non-blocking I/O. Understanding phases like timers, poll, and check helps you write performant code."
          }
        ]
      }
    ]
  }
];
