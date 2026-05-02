import type { TopicNode } from "@/data/types";

export const hydration: TopicNode = {
  id: "react-hydration",
  title: "Hydration",
  iconName: "Droplets",
  link: "https://react.dev/reference/react-dom/client/hydrateRoot",
  theory:
    "Hydration is the process where React attaches event handlers and client-side behavior to server-rendered HTML. Instead of rebuilding the initial markup from scratch, React reuses server output and makes it interactive.",
  theoryDetail: {
    keyConcepts: [
      "SSR sends HTML first for faster initial paint and better SEO",
      "hydrateRoot connects React to existing DOM generated on the server",
      "Server and client initial render output must match to avoid hydration warnings",
      "After hydration, updates continue normally through React's render and commit cycle",
    ],
    whyItMatters:
      "Hydration is central to frameworks like Next.js. Knowing how it works helps you avoid mismatches, improve perceived performance, and design components that work correctly in both server and client environments.",
    commonPitfalls: [
      "Rendering non-deterministic values on first paint (Date.now, Math.random) causing mismatch",
      "Using browser-only APIs (window, localStorage) during server render",
      "Conditionally rendering different initial markup on server vs client",
      "Ignoring hydration warnings in development that can hide real runtime bugs",
    ],
    examples: [
      {
        title: "Safe Client-Only Value After Hydration",
        description: "Defer browser-specific values until after mount to keep server/client markup consistent.",
        code: `import { useEffect, useState } from 'react';

function CurrentTimezone() {
  const [tz, setTz] = useState('UTC');

  useEffect(() => {
    setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return <p>Timezone: {tz}</p>;
}`,
        language: "jsx",
      },
    ],
  },
};
