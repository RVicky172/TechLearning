import type { Technology } from "@/data/types";
import { reactBasics } from "./basics/index";
import { reactAdvanced } from "./advanced/index";
import { reactEcosystem } from "./ecosystem/index";
import { reactHooks } from "./hooks/index";
import { reactPatterns } from "./patterns/index";
import { reactInterviewQuestions } from "./interviewQuestions";
import { reactPerformanceOptimization } from "./performanceOptimization";

const react: Technology = {
  id: "react",
  name: "React",
  description: "Modern UI library for building composable, reactive web and native interfaces.",
  color: "bg-blue-500",
  iconName: "Layout",
  deviconClass: "devicon-react-original colored",
  tree: [
    reactBasics,
    reactHooks,
    reactPerformanceOptimization,
    reactAdvanced,
    reactPatterns,
    reactEcosystem,
    reactInterviewQuestions,
  ],
};

export default react;

// ↑ Each section lives in its own subfolder for easy maintenance:
//   basics/      → components.ts, props.ts, state.ts, events.ts
//   advanced/    → context.ts, effects.ts, performance.ts, patterns.ts
//   ecosystem/   → routing.ts, query.ts
