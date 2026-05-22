import type { TopicNode } from "@/data/types";

export const nodeEventLoop: TopicNode = {
  id: "node-event-loop",
  title: "The Event Loop Architecture",
  iconName: "Repeat",
  theory: "Node.js is a single-threaded runtime, yet it can handle thousands of concurrent connections. This magic is powered by the Event Loop, a semi-infinite loop that offloads heavy I/O operations to the system kernel.",
  theoryDetail: {
    keyConcepts: [
      "V8 Engine: Executes JavaScript synchronously.",
      "libuv: The C library that provides the event loop and thread pool (default 4 threads) for heavy tasks.",
      "Phases: Timers (setTimeout), Pending Callbacks, Idle/Prepare, Poll (I/O), Check (setImmediate), Close Callbacks.",
      "Microtasks: process.nextTick() and Promises execute IMMEDIATELY after the current operation finishes, before the event loop moves to the next phase."
    ],
    whyItMatters: "Understanding the Event Loop is the difference between a Junior and Senior Node developer. If you don't understand it, you will accidentally block the main thread with heavy CPU calculations, completely freezing your web server.",
    commonPitfalls: [
      "Blocking the Event Loop: Running synchronous crypto functions or huge JSON.parse() on large payloads blocks ALL requests.",
      "Starving the Event Loop: An infinite recursive process.nextTick() will prevent the loop from ever reaching the Timer or Poll phases."
    ],
    examples: [
      {
        title: "Execution Order Interview Question",
        description: "Predict the order of execution. This tests your knowledge of Microtasks vs Macrotasks.",
        code: `console.log("1. Script start");

setTimeout(() => console.log("2. setTimeout"), 0);
setImmediate(() => console.log("3. setImmediate"));

Promise.resolve().then(() => console.log("4. Promise microtask"));

process.nextTick(() => console.log("5. process.nextTick microtask"));

console.log("6. Script end");

/* 
OUTPUT:
1. Script start
6. Script end
5. process.nextTick microtask (Highest priority microtask)
4. Promise microtask (Standard microtask)
2. setTimeout (Timers phase)
3. setImmediate (Check phase)
*/`,
        language: "javascript"
      }
    ]
  },
  children: []
};
