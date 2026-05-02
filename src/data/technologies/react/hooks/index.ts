import type { TopicNode } from "@/data/types";
import { hookUseState } from "./useState";
import { hookUseReducer } from "./useReducer";
import { hookUseRef } from "./useRef";
import { hookUseMemoCallback } from "./useMemoCallback";
import { hookUseContext } from "./useContext";
import { hookUseEffect } from "./useEffect";
import { effectAlternatives } from "./effectAlternatives";
import { hookUseLayoutEffect } from "./useLayoutEffect";
import { hookUseTransition } from "./useTransition";
import { hookCustom } from "./custom";

export const reactHooks: TopicNode = {
  id: "react-hooks",
  title: "React Hooks",
  iconName: "Webhook",
  theory:
    "Hooks are functions that let function components tap into React features — state, lifecycle, context, and more. Introduced in React 16.8, they replaced class lifecycle methods with a composable, reusable model. Every built-in hook solves a specific problem; custom hooks let you compose them into domain-specific abstractions.",
  theoryDetail: {
    keyConcepts: [
      "Hooks can only be called at the top level of a function component or another hook — never inside loops, conditions, or nested functions",
      "The order hooks are called must be the same on every render — React tracks hooks by call order, not by name",
      "Built-in hooks cover state (useState, useReducer), side effects (useEffect, useLayoutEffect), context (useContext), optimisation (useMemo, useCallback), DOM access (useRef), and concurrent features (useTransition, useDeferredValue)",
      "Custom hooks (functions starting with 'use') let you extract and reuse any combination of the above",
    ],
    whyItMatters:
      "Before hooks, stateful logic could only live in class components or be awkwardly shared through HOCs and render props. Hooks make every piece of stateful logic extractable into a plain function, enabling teams to share, test, and compose behaviour without changing the component hierarchy.",
    commonPitfalls: [
      "Calling hooks conditionally — always call them unconditionally at the top of your component",
      "Calling hooks outside React functions — only function components and custom hooks can use hooks",
      "Confusing useEffect and useLayoutEffect — start with useEffect and only switch when you see a visual flicker",
      "Overusing hooks for logic that doesn't need to be reactive — pure utility functions are simpler",
    ],
  },
  children: [
    hookUseState,
    hookUseReducer,
    hookUseRef,
    hookUseMemoCallback,
    hookUseContext,
    hookUseEffect,
    effectAlternatives,
    hookUseLayoutEffect,
    hookUseTransition,
    hookCustom,
  ],
};
