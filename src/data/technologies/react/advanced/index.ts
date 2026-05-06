import type { TopicNode } from "@/data/types";
import { context } from "./context";
import { stateStrategy } from "./stateStrategy";
import { effects } from "./effects";
import { performance } from "./performance";
import { virtualization } from "./virtualization";
import { patterns } from "./patterns";
import { batching } from "./batching";
import { serverComponents } from "./serverComponents";
import { suspenseStreaming } from "./suspenseStreaming";
import { reactCompiler } from "./reactCompiler";
import { typescriptReact } from "./typescriptReact";
import { accessibility } from "./accessibility";
import { securityReact } from "./securityReact";
import { architecture } from "./architecture";
import { optimisticUpdates } from "./optimisticUpdates";
import { urlState } from "./urlState";
import { throttlingDebouncing } from "./throttlingDebouncing";

export const reactAdvanced: TopicNode = {
  id: "react-advanced",
  title: "Advanced Concepts",
  iconName: "Zap",
  theory:
    "Once you understand components, props, and state, React's advanced patterns enable you to build production-grade applications that scale across large teams. These include Server Components, Suspense, the React Compiler, TypeScript integration, performance optimization, architecture, accessibility, and security — everything needed for senior-level React development.",
  theoryDetail: {
    keyConcepts: [
      "Project Architecture: Group files by feature (colocation) rather than by type to ensure scalable, maintainable codebases",
      "React Server Components split your app into server and client code — data fetching on the server, interactivity on the client",
      "Suspense and streaming SSR let pages load progressively instead of blocking on slow data",
      "The React Compiler automatically memoizes components — eliminating manual useMemo/useCallback",
      "TypeScript catches entire categories of bugs at compile time — prop types, event handlers, state shapes",
      "Context API propagates data through the component tree without explicit prop threading at every level",
      "Memoization (React.memo, useMemo, useCallback) trades memory for skipped renders — profile before applying",
    ],
    whyItMatters:
      "Advanced patterns separate maintainable, scalable applications from those that become impossible to modify. Mastering them is required for senior-level front-end work and building systems that teams can confidently modify without fear of bugs.",
    commonPitfalls: [
      "Structuring projects by file type (e.g. 'components', 'hooks') instead of by feature domain",
      "Over-using Context for every piece of state — Context re-renders all consumers on change, which can hurt performance",
      "Adding useEffect without understanding the dependency array — the most common source of subtle bugs",
      "Premature optimization with memoization before profiling — it adds complexity without guaranteed benefit",
      "Creating too many custom hooks too early — let the pattern emerge naturally before abstracting",
      "Ignoring accessibility until the end — it's 10x harder to retrofit than to build in from the start",
    ],
  },
  children: [
    architecture,
    serverComponents,
    suspenseStreaming,
    reactCompiler,
    typescriptReact,
    optimisticUpdates,
    urlState,
    throttlingDebouncing,
    context,
    stateStrategy,
    batching,
    effects,
    performance,
    virtualization,
    patterns,
    accessibility,
    securityReact,
  ],
};
