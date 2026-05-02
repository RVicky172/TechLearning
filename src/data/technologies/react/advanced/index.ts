import type { TopicNode } from "@/data/types";
import { context } from "./context";
import { stateStrategy } from "./stateStrategy";
import { effects } from "./effects";
import { performance } from "./performance";
import { virtualization } from "./virtualization";
import { patterns } from "./patterns";

export const reactAdvanced: TopicNode = {
  id: "react-advanced",
  title: "Advanced Concepts",
  iconName: "Zap",
  theory:
    "Once you understand components, props, and state, React's advanced patterns enable you to build production-grade applications that scale across large teams. These include managing global state, synchronizing with external systems, optimizing performance, and sharing logic across components.",
  theoryDetail: {
    keyConcepts: [
      "Context API propagates data through the component tree without explicit prop threading at every level",
      "Effects (useEffect) synchronize components with external systems like APIs, timers, and browser APIs",
      "Memoization (React.memo, useMemo, useCallback) trades memory for skipped renders — profile before applying",
      "Custom hooks encapsulate reusable stateful logic without duplicating code across components",
    ],
    whyItMatters:
      "Advanced patterns separate maintainable, scalable applications from those that become impossible to modify. Mastering them is required for senior-level front-end work and building systems that teams can confidently modify without fear of bugs.",
    commonPitfalls: [
      "Over-using Context for every piece of state — Context re-renders all consumers on change, which can hurt performance",
      "Adding useEffect without understanding the dependency array — the most common source of subtle bugs",
      "Premature optimization with memoization before profiling — it adds complexity without guaranteed benefit",
      "Creating too many custom hooks too early — let the pattern emerge naturally before abstracting",
    ],
  },
  children: [context, stateStrategy, effects, performance, virtualization, patterns],
};
