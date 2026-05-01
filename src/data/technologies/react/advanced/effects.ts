import type { TopicNode } from "@/data/types";

export const effects: TopicNode = {
  id: "react-effects",
  title: "useEffect & Side Effects",
  iconName: "GitBranch",
  link: "https://react.dev/learn/synchronizing-with-effects",
  theory:
    "Effects let you run code after React has updated the DOM. Use them to synchronize your component with external systems like APIs, timers, browser APIs, or analytics. The dependency array controls when the effect runs — [] means once, empty deps means every render.",
  theoryDetail: {
    keyConcepts: [
      "useEffect(fn, [deps]) runs fn after render whenever any dependency changes",
      "Return a cleanup function to unsubscribe, cancel timers, or abort fetches — prevents memory leaks",
      "Empty dependency array [] runs the effect only once after the first render (like componentDidMount)",
      "Missing dependencies cause stale closure bugs where the effect references old state or props",
      "Effects run after the DOM updates — if you need to run before, use useLayoutEffect (rarely needed)",
    ],
    whyItMatters:
      "Effects are how React syncs with the outside world — APIs, timers, browser events. Without proper cleanup, you get memory leaks and state updates on unmounted components causing console errors.",
    commonPitfalls: [
      "Missing dependencies causing stale closure bugs — the effect captures old state and never updates",
      "Updating state in an effect without a guard causing an infinite re-render loop",
      "Fetching data without an AbortController leading to state updates after the component unmounts",
      "Not returning a cleanup function from intervals or subscriptions causing memory leaks",
    ],
    examples: [
      {
        title: "Basic Data Fetching",
        description: "Fetch data when component mounts.",
        code: `import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchUser = async () => {
      try {
        const res = await fetch(\`/api/users/\${userId}\`);
        const data = await res.json();
        if (isMounted) setUser(data);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchUser();
    
    return () => {
      isMounted = false;  // Cleanup to prevent memory leak
    };
  }, [userId]);
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return <div>{user.name}</div>;
}`,
        language: "jsx",
      },
      {
        title: "Timer with Cleanup",
        description: "Clean up interval timers to prevent memory leaks.",
        code: `import { useState, useEffect } from 'react';

function StopWatch() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    if (!isRunning) return;  // Don't start interval if not running
    
    const intervalId = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
    
    // Cleanup: clear the interval when effect cleans up
    return () => clearInterval(intervalId);
  }, [isRunning]);
  
  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Browser Event Listener",
        description: "Add and clean up a window event listener.",
        code: `import { useEffect } from 'react';

function WindowSize() {
  const [width, setWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <p>Window width: {width}px</p>;
}`,
        language: "jsx",
      },
      {
        title: "Fetch with AbortController",
        description: "Cancel fetch requests when component unmounts.",
        code: `import { useState, useEffect } from 'react';

function SearchResults({ query }) {
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchResults = async () => {
      try {
        const res = await fetch(\`/api/search?q=\${query}\`, {
          signal: controller.signal
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Fetch error:', err);
        }
      }
    };
    
    fetchResults();
    
    return () => {
      controller.abort();  // Cancel ongoing request
    };
  }, [query]);
  
  return <ul>{results.map(r => <li key={r.id}>{r.title}</li>)}</ul>;
}`,
        language: "jsx",
      },
    ],
  },
};
