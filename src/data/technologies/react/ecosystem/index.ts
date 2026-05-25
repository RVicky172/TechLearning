import type { TopicNode } from "@/data/types";
import { routing } from "./routing";
import { reactRouter } from "./reactRouter";
import { serverClientBoundaries } from "./serverClientBoundaries";
import { query } from "./query";
import { stateManagement } from "./stateManagement";
import { reduxToolkit } from "./reduxToolkit";
import { formPatterns } from "./formPatterns";
import { reactTestingLibrary } from "./reactTestingLibrary";
import { stylingStrategies } from "./stylingStrategies";
import { deploymentProduction } from "./deploymentProduction";
import { framerMotion } from "./framerMotion";

export const reactEcosystem: TopicNode = {
  id: "react-ecosystem",
  title: "React Ecosystem",
  iconName: "Globe",
  theory:
    "React itself only handles the view layer. The broader ecosystem provides solutions for routing, data fetching, state management, forms, styling, testing, and deployment. Understanding which tool to use for which problem is essential for modern web development.",
  theoryDetail: {
    keyConcepts: [
      "Styling Strategies: Tailwind for utility-first, CSS Modules for scoping, or Headless UI for accessible unstyled components",
      "Next.js adds file-based routing, server-side rendering, and React Server Components on top of React",
      "TanStack Query manages server state — caching, background refetching, and synchronization",
      "For client state: Zustand (lightweight), Jotai (atoms), or Redux Toolkit (enterprise) depending on complexity",
      "Redux Toolkit standardizes Redux with createSlice, configureStore, and RTK Query for data fetching",
      "React Testing Library tests user-visible behavior — query by role, label, and text instead of implementation details",
      "React Hook Form handles complex forms with minimal re-renders; React 19 adds native form actions",
      "Framer Motion handles declarative animations, layout transitions, and physics-driven micro-interactions",
      "Deployment ranges from static CDN hosting to serverless platforms (Vercel, Netlify) with CI/CD pipelines",
    ],
    whyItMatters:
      "React only handles rendering. Knowing the ecosystem means knowing which tool to reach for — routing, data fetching, state management, styling, testing, forms, and production deployment each have best-in-class solutions that eliminate boilerplate.",
    commonPitfalls: [
      "Re-implementing what ecosystem libraries already solve (caching, routing, forms validation)",
      "Mixing server state (TanStack Query, SSR data) and client state (useState, Zustand) without a clear boundary",
      "Adopting too many libraries too early before understanding what problems they actually solve",
      "Using the wrong tool — Redux for simple state, TanStack Query for local state instead of server state",
      "Testing implementation details instead of user-visible behavior — makes tests fragile to refactoring",
    ],
  },
  children: [reactRouter, routing, serverClientBoundaries, query, stateManagement, reduxToolkit, formPatterns, stylingStrategies, framerMotion, reactTestingLibrary, deploymentProduction],
};

