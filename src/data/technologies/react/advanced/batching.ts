import type { TopicNode } from "@/data/types";

export const batching: TopicNode = {
  id: "react-batching",
  title: "Batching & State Updates",
  iconName: "Zap",
  demoComponentKey: "reactBatching",
  link: "https://react.dev/learn/queueing-a-series-of-state-updates",
  theory:
    "Batching combines multiple state updates into a single render and commit cycle, reducing renders and improving performance. React 18 automatically batches updates in most cases (events, promises, timers), but sometimes you need to flush updates synchronously with flushSync() or see updates individually.",
  theoryDetail: {
    keyConcepts: [
      "Automatic batching (React 18+): Multiple setState calls in event handlers, promises, and timers combine into one render",
      "Before React 18: Only event handlers batched; async updates (setTimeout, fetch.then) triggered separate renders",
      "flushSync(): Escape batching to force immediate render and commit of pending state updates",
      "Batching reduces renders: Each render → reconciliation → commit is expensive; fewer renders = better performance",
      "Batching changes observable behavior: setState is still asynchronous, but batch happens after all updates queued",
      "Not all updates can batch: If you need intermediate states, use startTransition or separate effects",
    ],
    whyItMatters:
      "Batching is a performance optimization that reduced unnecessary renders. Understanding it explains why console.log(state) shows old values after setState, why multiple setState calls only trigger one render, and when to use flushSync() for immediate updates.",
    commonPitfalls: [
      "Assuming setState updates immediately — batching delays render until event handler completes",
      "Expecting sequential renders when multiple setState calls exist — they batch into one render",
      "Mixing batched updates with un-batched flushSync calls, causing hard-to-debug state inconsistencies",
      "Using flushSync in performance-critical code — it breaks batching, can cause jank",
      "Misunderstanding that batching is invisible to the component — functional correctness shouldn't change",
    ],
    examples: [
      {
        title: "React 18: Automatic Batching in Events, Promises, and Timers",
        description: "Multiple setState calls within the same scope batch into one render.",
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  const [toggle, setToggle] = useState(false);
  
  const handleClick = () => {
    // React 18: Both updates batch into ONE render
    setCount(c => c + 1);
    setToggle(t => !t);
    // Only 1 render after event handler completes
  };
  
  const handleAsync = async () => {
    // React 18: Promise callbacks also batch!
    const data = await fetch('/api/data').then(r => r.json());
    setCount(c => c + 1);
    setToggle(t => !t);
    // 1 render, not 2
  };
  
  const handleTimer = () => {
    setTimeout(() => {
      // React 18: setTimeout callbacks also batch!
      setCount(c => c + 1);
      setToggle(t => !t);
      // 1 render
    }, 1000);
  };
  
  return (
    <div>
      <p>Count: {count}, Toggle: {toggle ? 'on' : 'off'}</p>
      <button onClick={handleClick}>Click</button>
      <button onClick={handleAsync}>Async</button>
      <button onClick={handleTimer}>Timer</button>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "Before React 18: Only Event Handlers Batched",
        description: "Pre-18 behavior: async updates didn't batch, causing extra renders.",
        code: `// React 17 and earlier:

function Counter() {
  const [count, setCount] = useState(0);
  const [toggle, setToggle] = useState(false);
  
  const handleClick = () => {
    // Batched: 1 render
    setCount(c => c + 1);
    setToggle(t => !t);
  };
  
  const handleAsync = async () => {
    const data = await fetch('/api/data').then(r => r.json());
    setCount(c => c + 1); // Render 1
    setToggle(t => !t);   // Render 2 (not batched!)
  };
  
  const handleTimer = () => {
    setTimeout(() => {
      setCount(c => c + 1); // Render 1
      setToggle(t => !t);   // Render 2 (not batched!)
    }, 1000);
  };
}

// Developers had to manually batch with unstable_batchedUpdates()
// React 18 fixed this by making all updates auto-batch`,
        language: "jsx",
      },
      {
        title: "flushSync(): Break Out of Batching for Immediate Render",
        description: "Force a synchronous render when batching prevents needed intermediate state.",
        code: `import { useState, flushSync } from 'react';

function Form() {
  const [count, setCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Immediately render the "submitted" state before doing expensive work
    flushSync(() => setSubmitted(true));
    
    // Now UI shows loading spinner
    expensiveComputation(); // Blocks, but user sees feedback
    
    setSubmitted(false); // Also batches after expensiveComputation
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {submitted && <p>Loading...</p>}
      <input type="number" value={count} onChange={(e) => setCount(parseInt(e.target.value))} />
      <button type="submit">Submit</button>
    </form>
  );
}

// Without flushSync: spinner doesn't appear until after expensiveComputation`,
        language: "jsx",
      },
      {
        title: "setState is Asynchronous: Batching Explanation",
        description: "Multiple setState calls queue updates that render together after the current code runs.",
        code: `import { useState } from 'react';

function Example() {
  const [x, setX] = useState(0);
  
  const update = () => {
    console.log('Before setState:', x); // 0
    
    setX(1);
    setX(2);
    setX(3);
    
    console.log('After setState:', x); // Still 0! (state hasn't updated yet)
    
    // React's internal queue: [{ x: 1 }, { x: 2 }, { x: 3 }]
    // After this function completes, React merges updates: x = 3
    // Then renders with x = 3
  };
  
  return (
    <div>
      <p>x = {x}</p>
      <button onClick={update}>Update</button>
    </div>
  );
}

// Timeline:
// 1. Click button
// 2. update() runs, queues 3 setX calls
// 3. update() completes
// 4. React processes queue: keeps only final value (x: 3)
// 5. Single render with x = 3`,
        language: "jsx",
      },
      {
        title: "Functional Updates: Accumulating Changes Within a Render",
        description: "Use reducer-style updates to handle multiple state changes that depend on each other.",
        code: `import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  // ✅ Correct: Each setState reads the updated value from previous setters
  const handleMultiple = () => {
    setCount(c => c + 1); // c = 0 + 1 = 1
    setCount(c => c + 1); // c = 1 + 1 = 2 (functional updates are batched in order)
    setCount(c => c + 1); // c = 2 + 1 = 3
    // Final render: count = 3
  };
  
  // ❌ Wrong: Each setter doesn't see changes from earlier setters
  const handleWrong = () => {
    setCount(count + 1); // 0 + 1 = 1
    setCount(count + 1); // 0 + 1 = 1 (count is still 0!)
    setCount(count + 1); // 0 + 1 = 1
    // Final render: count = 1 (all three updates queued as 1, last wins)
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={handleMultiple}>Correct</button>
      <button onClick={handleWrong}>Wrong</button>
    </div>
  );
}`,
        language: "jsx",
      },
      {
        title: "When to Use flushSync(): Handling Immediate Side Effects",
        description: "Force a render if you need DOM updates visible before the next code runs.",
        code: `import { useState, useRef, flushSync } from 'react';

function ChatInput() {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const handleSend = (text) => {
    // Add message and immediately render
    flushSync(() => {
      setMessages(m => [...m, { id: Date.now(), text }]);
    });
    
    // NOW the DOM is updated, scroll to bottom
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div>
      <div ref={scrollRef}>
        {messages.map(msg => (
          <p key={msg.id}>{msg.text}</p>
        ))}
      </div>
      <input 
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend(e.currentTarget.value);
        }}
      />
    </div>
  );
}

// Without flushSync: scrollIntoView runs before message appears in DOM
// With flushSync: message renders, then scroll happens`,
        language: "jsx",
      },
      {
        title: "startTransition: Mark Non-Urgent Updates for Deferral",
        description: "Explicitly tell React which updates can be interrupted for responsiveness.",
        code: `import { useState, startTransition } from 'react';

function SearchResults() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleChange = (e) => {
    const value = e.target.value;
    
    // High priority: input feedback is immediate
    setQuery(value);
    setIsSearching(true);
    
    // Low priority: search can be paused if user types again
    startTransition(() => {
      const matching = expensiveSearch(value);
      setResults(matching);
      setIsSearching(false);
    });
  };
  
  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isSearching && <p>Searching...</p>}
      {results.map(r => <p key={r.id}>{r.title}</p>)}
    </div>
  );
}

// Timeline:
// 1. User types quickly: 'a', 'ab', 'abc'
// 2. Each keystroke: setQuery happens immediately (high priority)
// 3. Each startTransition: search queued but can be preempted
// 4. By keystroke 3, prev search is abandoned, new search starts
// 5. Only final results for 'abc' render`,
        language: "jsx",
      },
    ],
  },
};
