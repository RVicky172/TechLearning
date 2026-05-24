import type { TopicNode } from "@/data/types";

export const debuggingDevtools: TopicNode = {
  id: "react-debugging-devtools",
  title: "Debugging and DevTools",
  iconName: "Bug",
  link: "https://react.dev/learn/react-developer-tools",
  theory:
    "Debugging React effectively means understanding why components render, where state changes originate, and how effects behave over time. React DevTools, Profiler, and disciplined logging are the fastest way to isolate bugs and performance regressions.",
  theoryDetail: {
    keyConcepts: [
      "Use React DevTools Components tab to inspect props, hooks state, and component tree structure",
      "Use Profiler to measure real render cost and identify unnecessary rerenders before optimizing",
      "Track state ownership and update sources first; most bugs come from unclear ownership boundaries",
      "In Strict Mode development, effect mount-cleanup-remount cycles help expose non-idempotent side effects",
      "Debugging strategy: reproduce -> isolate smallest failing subtree -> verify assumptions with instrumentation",
    ],
    whyItMatters:
      "Advanced React work requires fast diagnosis under pressure. Teams that use a consistent debugging workflow resolve incidents faster, avoid speculative fixes, and make safer performance improvements.",
    commonPitfalls: [
      "Optimizing before measuring, which hides root causes and increases complexity",
      "Relying only on console logs without inspecting actual props and hooks in DevTools",
      "Ignoring Strict Mode warnings and treating double-invocation behavior as a React bug",
      "Debugging entire pages at once instead of narrowing to the smallest failing component boundary",
    ],
    examples: [
      {
        title: "Profiler-Driven Optimization Workflow",
        description:
          "Use the Profiler API to capture update cost and emit warnings for slow commits in key subtrees.",
        code: `import { Profiler } from 'react';

function onRender(id, phase, actualDuration) {
  if (actualDuration > 16) {
    console.warn('[Profiler]', id, phase, actualDuration.toFixed(1) + 'ms');
  }
}

export function ProductPage() {
  return (
    <Profiler id="ProductGrid" onRender={onRender}>
      <ProductGrid />
    </Profiler>
  );
}`,
        language: "tsx",
      },
      {
        title: "Detecting Unstable Props During Debugging",
        description:
          "Log prop identity changes to verify whether memoized children rerender due to unstable references.",
        code: `import { useEffect, useRef } from 'react';

function useWhyPropsChanged(name, props) {
  const previous = useRef(props);

  useEffect(() => {
    const keys = Object.keys({ ...previous.current, ...props });
    const changed = keys.filter(key => previous.current[key] !== props[key]);
    if (changed.length > 0) {
      console.log(name, 'changed props:', changed);
    }
    previous.current = props;
  });
}

function Row(props) {
  useWhyPropsChanged('Row', props);
  return <div>{props.label}</div>;
}`,
        language: "tsx",
      },
    ],
  },
};
