import type { TopicNode } from "@/data/types";

export const hookUseEffect: TopicNode = {
  id: "hook-useeffect",
  title: "useEffect",
  iconName: "Zap",
  link: "https://react.dev/reference/react/useEffect",
  theory:
    "useEffect synchronises a component with an external system — an API, a WebSocket, a timer, browser storage, or any other side effect. It runs after the browser has painted the screen, making it safe for DOM reads and async operations.",
  theoryDetail: {
    keyConcepts: [
      "useEffect(setup, [deps]) — runs setup after every render where at least one dep changed",
      "[] as deps → run once after mount; omitting deps → run after every render",
      "Return a cleanup function from setup to cancel subscriptions, clear timers, or abort fetches on unmount",
      "React 18 Strict Mode intentionally mounts → unmounts → remounts in dev to surface missing cleanups",
    ],
    whyItMatters:
      "Without effects, components are pure render functions that can't interact with the world outside React. Effects bridge that gap — data fetching, event listeners, third-party integrations all live here. Correct cleanup prevents memory leaks and ghost state updates.",
    commonPitfalls: [
      "Missing dependencies causing stale closure bugs — the effect captures old state and never updates",
      "Updating state unconditionally inside an effect causing an infinite loop",
      "Fetching without AbortController — response arrives after unmount and updates a stale component",
      "Object/function literals in the dependency array — new references each render cause the effect to re-run infinitely",
    ],
    examples: [
      {
        title: "Data fetch with AbortController",
        description: "Cancel the in-flight request when the component unmounts or the id changes.",
        code: `import { useState, useEffect } from 'react';

function UserCard({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(\`/api/users/\${userId}\`,
          { signal: controller.signal }
        );
        setUser(await res.json());
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();   // cleanup on unmount / dep change
  }, [userId]);

  if (loading) return <p>Loading…</p>;
  return <div>{user?.name}</div>;
}`,
        language: "jsx",
      },
      {
        title: "Event listener with cleanup",
        description: "Attach a window resize listener and remove it when the component unmounts.",
        code: `import { useState, useEffect } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize); // cleanup
  }, []);  // empty → attach once, remove on unmount

  return width;
}

function ResponsiveBanner() {
  const width = useWindowWidth();
  return <p>Window is {width}px wide</p>;
}`,
        language: "jsx",
      },
      {
        title: "Sync state to localStorage",
        description: "Persist a value to localStorage every time it changes.",
        code: `import { useState, useEffect } from 'react';

function usePersisted(key, defaultValue) {
  const [value, setValue] = useState(
    () => JSON.parse(localStorage.getItem(key) ?? 'null') ?? defaultValue
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function App() {
  const [name, setName] = usePersisted('username', '');
  return <input value={name} onChange={e => setName(e.target.value)} />;
}`,
        language: "jsx",
      },
    ],
  },
};
