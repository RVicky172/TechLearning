import type { TopicNode } from "@/data/types";
import { routing } from "./routing";
import { reactRouter } from "./reactRouter";
import { serverClientBoundaries } from "./serverClientBoundaries";
import { query } from "./query";

export const reactEcosystem: TopicNode = {
  id: "react-ecosystem",
  title: "React Ecosystem",
  iconName: "Globe",
  theory:
    "React itself only handles the view layer. The broader ecosystem provides solutions for routing, data fetching, state management, and deployment. Understanding which tool to use for which problem is essential for modern web development.",
  theoryDetail: {
    keyConcepts: [
      "Next.js adds file-based routing, server-side rendering, and React Server Components on top of React",
      "TanStack Query manages server state — caching, background refetching, and synchronization",
      "For client state: Zustand (lightweight), Jotai (atoms), or Redux (enterprise) depending on complexity",
      "The ecosystem also includes tools for forms (React Hook Form), HTTP (axios, fetch), and styling (Tailwind, CSS-in-JS)",
    ],
    whyItMatters:
      "React only handles rendering. Knowing the ecosystem means knowing which tool to reach for — routing, data fetching, state management, and forms each have best-in-class solutions that eliminate boilerplate.",
    commonPitfalls: [
      "Re-implementing what ecosystem libraries already solve (caching, routing, forms validation)",
      "Mixing server state (TanStack Query, SSR data) and client state (useState, Zustand) without a clear boundary",
      "Adopting too many libraries too early before understanding what problems they actually solve",
      "Using the wrong tool — Redux for simple state, TanStack Query for local state instead of server state",
    ],
  },
  children: [reactRouter, routing, serverClientBoundaries, query],
};
