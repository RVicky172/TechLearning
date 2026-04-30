import type { Technology } from "@/data/types";

const nodejs: Technology = {
  id: "nodejs",
  name: "Node.js",
  description: "Event-driven JavaScript runtime built on Chrome's V8 engine for scalable server-side applications.",
  color: "bg-green-600",
  iconName: "Server",
  deviconClass: "devicon-nodejs-plain colored",
  tree: [
    {
      id: "node-basics",
      title: "Node.js Fundamentals",
      iconName: "BookOpen",
      theory: "Node.js lets JavaScript run on the server. Learn how its non-blocking I/O and event loop work to handle thousands of concurrent requests efficiently.",
      theoryDetail: {
        keyConcepts: [
          "Node.js uses Chrome's V8 engine to run JavaScript outside the browser",
          "Single-threaded but non-blocking — the event loop handles concurrent I/O",
          "npm has 2M+ packages — most Node projects rely heavily on the ecosystem",
        ],
        whyItMatters:
          "Node allows full-stack JavaScript development, letting teams share types, utilities, and logic across client and server without context-switching languages.",
        commonPitfalls: [
          "Running blocking synchronous code in request handlers starving all other requests",
          "Treating Node's environment as identical to the browser — APIs and globals differ",
          "Not handling errors on EventEmitter instances causing silent crashes",
        ],
      },
      children: [
        {
          id: "node-modules",
          title: "Modules & CommonJS",
          iconName: "Package",
          link: "https://nodejs.org/en/docs/guides/",
          theory: "Node uses CommonJS modules (require/exports) and ESM (import/export). Understanding module resolution is key to structuring Node projects.",
          theoryDetail: {
            keyConcepts: [
              "require() is synchronous and uses CommonJS; import/export uses ESM",
              "package.json 'main' points to the entry file; 'exports' field overrides it",
              "Node resolves modules by climbing the directory tree looking in node_modules/",
            ],
            whyItMatters:
              "Understanding modules prevents mysterious 'cannot find module' errors and circular dependency bugs that only appear at runtime.",
            commonPitfalls: [
              "Mixing require() and import/export in the same project without a clear strategy",
              "Circular requires returning partially-initialized module objects",
              "Forgetting 'type': 'module' in package.json when using ESM import syntax",
            ],
          },
        },
        {
          id: "node-fs",
          title: "File System & Streams",
          iconName: "FolderOpen",
          link: "https://nodejs.org/api/fs.html",
          theory: "The fs module provides both synchronous and asynchronous file operations. Streams let you process large data without loading it all into memory.",
          theoryDetail: {
            keyConcepts: [
              "fs.readFile is async; fs.readFileSync blocks the event loop — avoid in servers",
              "Streams process data chunk by chunk — essential for files larger than available memory",
              "The fs/promises API gives a clean async/await interface: await fs.readFile(path, 'utf8')",
            ],
            whyItMatters:
              "File I/O is among the most common server operations. Using async streams prevents bottlenecks when serving multiple simultaneous requests.",
            commonPitfalls: [
              "Using sync methods in HTTP handlers blocking the entire server under load",
              "Not listening for 'error' events on streams causing unhandled exceptions",
              "Opening file handles without closing them — use the async iterator or stream.pipeline()",
            ],
          },
        },
        {
          id: "node-http",
          title: "HTTP Module & APIs",
          iconName: "Globe",
          link: "https://nodejs.org/api/http.html",
          theory: "Node's built-in http module creates web servers. Most projects use Express or Fastify on top of it for routing and middleware.",
          theoryDetail: {
            keyConcepts: [
              "http.createServer(callback) returns a Server; .listen(port) starts it",
              "req is an IncomingMessage readable stream; res is a ServerResponse writable stream",
              "Always set Content-Type headers and status codes before writing the response body",
            ],
            whyItMatters:
              "Knowing the raw HTTP module demystifies frameworks like Express. When frameworks behave unexpectedly, you can drop down to the http module to debug.",
            commonPitfalls: [
              "Forgetting res.end() leaving client connections hanging indefinitely",
              "Not consuming the request body before responding — it's a stream, not a string",
              "Omitting error handling leaving the server vulnerable to crashes on malformed requests",
            ],
          },
        },
      ],
    },
    {
      id: "node-async",
      title: "Async Programming",
      iconName: "Zap",
      theory: "Node's power comes from asynchronous code. Master callbacks, Promises, and async/await to avoid blocking the event loop.",
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
      },
      children: [
        {
          id: "node-promises",
          title: "Promises & async/await",
          iconName: "Clock",
          link: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises",
          theory: "Promises represent future values. async/await is syntactic sugar that makes asynchronous code read like synchronous code.",
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
          },
        },
        {
          id: "node-eventloop",
          title: "The Event Loop",
          iconName: "RefreshCw",
          link: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick",
          theory: "The event loop is how Node handles non-blocking I/O. Understanding phases like timers, poll, and check helps you write performant code.",
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
          },
        },
      ],
    },
  ],
};

export default nodejs;
