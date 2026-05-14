import type { TopicNode } from "@/data/types";

export const nodeAsync: TopicNode = {
  id: "node-async",
  title: "Async Programming",
  iconName: "Zap",
  theory:
    "Node's power comes from asynchronous code. Master callbacks, Promises, and async/await to avoid blocking the event loop.",
  theoryDetail: {
    keyConcepts: [
      "The event loop phases: timers → I/O callbacks → poll → check (setImmediate) → close",
      "process.nextTick() fires before the next iteration; setImmediate() fires in the check phase",
      "Unhandled promise rejections terminate the process in Node 15+",
    ],
    whyItMatters:
      "All of Node's performance advantages rely on async code done right. Blocking the event loop even briefly degrades every concurrent request being served.",
    commonPitfalls: [
      "CPU-intensive synchronous code (parsing huge JSON) blocking the loop for all requests",
      "Creating Promises without attaching .catch() or try/catch causing silent failures",
      "Over-parallelizing connections exhausting OS file descriptors or database connection pools",
    ],
    examples: [
      {
        title: "Bounded concurrency pattern",
        description:
          "Limit parallel async work to protect database pools and external APIs.",
        code: `import pLimit from 'p-limit';

const limit = pLimit(10); // max 10 concurrent tasks
const jobs = ids.map((id) =>
  limit(async () => {
    const user = await getUser(id);
    return enrichUser(user);
  })
);

const results = await Promise.all(jobs);`,
        language: "javascript",
      },
    ],
  },
  children: [
    {
      id: "node-promises",
      title: "Promises & async/await",
      iconName: "Clock",
      link: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises",
      theory:
        "Promises represent future values. async/await is syntactic sugar that makes asynchronous code read like synchronous code.",
      theoryDetail: {
        keyConcepts: [
          "Promise states: pending → fulfilled or rejected — transitions are final",
          "Promise.all([p1, p2]) runs in parallel and resolves when all succeed",
          "async functions always return a Promise; await pauses execution inside them",
        ],
        whyItMatters:
          "Promises eliminated callback hell. async/await makes async code read sequentially, dramatically reducing the cognitive overhead of concurrent operations.",
        commonPitfalls: [
          "Forgetting await — the function returns a Promise object instead of the resolved value",
          "Sequential awaits in a loop — use Promise.all() for independent parallel operations",
          "Not wrapping await in try/catch — unhandled rejections crash Node 15+ processes",
        ],
        examples: [
          {
            title: "Promise.all for parallel fetches",
            description: "Run independent async operations in parallel instead of sequentially.",
            code: `// Sequential — slow (each awaits the previous)
const user = await getUser(id);
const orders = await getOrders(id);

// Parallel — fast (both start at the same time)
const [user, orders] = await Promise.all([
  getUser(id),
  getOrders(id),
]);`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-eventloop",
      title: "The Event Loop",
      iconName: "RefreshCw",
      link: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick",
      theory:
        "The event loop is how Node handles non-blocking I/O. Understanding phases like timers, poll, and check helps you write performant code.",
      theoryDetail: {
        keyConcepts: [
          "Phases cycle: timers (setTimeout) → pending I/O → idle → poll → check (setImmediate) → close",
          "The poll phase blocks waiting for I/O when the timer queue is empty",
          "process.nextTick() always fires before returning to the loop — use sparingly",
        ],
        whyItMatters:
          "Understanding loop phases lets you predict execution order, diagnose latency spikes, and write code that cooperates with Node's concurrency model rather than fighting it.",
        commonPitfalls: [
          "Blocking the poll phase with synchronous operations preventing other callbacks from running",
          "Recursive process.nextTick() calls starving I/O callbacks entirely",
          "Assuming setTimeout(fn, 0) fires immediately — it fires in the timers phase after I/O",
        ],
        examples: [
          {
            title: "Execution order probe",
            description:
              "A quick script to reason about nextTick, promises, timers, and immediates.",
            code: `console.log('start');

setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise microtask'));
process.nextTick(() => console.log('nextTick'));

console.log('end');

// Typical order:
// start
// end
// nextTick
// promise microtask
// timeout / immediate (context-dependent)`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-error-handling",
      title: "Error Handling Patterns",
      iconName: "ShieldAlert",
      link: "https://nodejs.org/api/errors.html",
      theory:
        "Node.js errors come in three flavors: sync exceptions, rejected Promises, and EventEmitter 'error' events. Each needs its own handling strategy.",
      theoryDetail: {
        keyConcepts: [
          "Sync code: wrap in try/catch; async code: use try/catch with await or .catch()",
          "Domain-specific error classes (extend Error) add context and enable instanceof checks",
          "process.on('uncaughtException') and process.on('unhandledRejection') are last-resort handlers",
        ],
        whyItMatters:
          "Poor error handling is the leading cause of unexpected Node.js crashes in production. Consistent error boundaries prevent one bad request from taking down the entire server.",
        commonPitfalls: [
          "Swallowing errors with empty catch blocks masking real bugs",
          "Not differentiating between operational errors (invalid input) and programmer errors (bugs)",
          "Using process.on('uncaughtException') to recover from errors instead of fixing the root cause",
        ],
        examples: [
          {
            title: "Operational vs programmer errors",
            description: "Classify errors to decide whether to recover or crash.",
            code: `class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// Operational: safe to send to client
throw new AppError('User not found', 404);

// Programmer error: crash and let the process manager restart
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION', err);
  process.exit(1);
});`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-streams-advanced",
      title: "Streams & Pipelines",
      iconName: "Workflow",
      link: "https://nodejs.org/api/stream.html",
      theory:
        "Streams are one of Node's most powerful abstractions. Use stream.pipeline() to compose Readable, Transform, and Writable streams safely with proper error propagation.",
      theoryDetail: {
        keyConcepts: [
          "Four types: Readable, Writable, Duplex, Transform — all extend EventEmitter",
          "stream.pipeline() automatically handles teardown and error propagation across all streams",
          "Backpressure prevents fast producers from overwhelming slow consumers — .pipe() handles it automatically",
        ],
        whyItMatters:
          "Processing gigabyte files, compressing responses, or proxying uploads all require streams. Without them, you'd load all data into memory and crash on large inputs.",
        commonPitfalls: [
          "Using .pipe() without error handling — prefer stream.pipeline() which auto-cleans up",
          "Not implementing _transform() correctly in custom Transform streams causing data loss",
          "Ignoring backpressure signals — if .write() returns false, pause the source until 'drain'",
        ],
        examples: [
          {
            title: "stream.pipeline() with gzip compression",
            description: "Compress a file efficiently without loading it into memory.",
            code: `import { createReadStream, createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';

await pipeline(
  createReadStream('input.txt'),
  createGzip(),
  createWriteStream('input.txt.gz'),
);
console.log('Compression complete');`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
