import type { TopicNode } from "@/data/types";

export const nodeFundamentals: TopicNode = {
  id: "node-basics",
  title: "Node.js Fundamentals",
  iconName: "BookOpen",
  theory:
    "Node.js lets JavaScript run on the server. Learn how its non-blocking I/O and event loop work to handle thousands of concurrent requests efficiently.",
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
      theory:
        "Node uses CommonJS modules (require/exports) and ESM (import/export). Understanding module resolution is key to structuring Node projects.",
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
      theory:
        "The fs module provides both synchronous and asynchronous file operations. Streams let you process large data without loading it all into memory.",
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
      theory:
        "Node's built-in http module creates web servers. Most projects use Express or Fastify on top of it for routing and middleware.",
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
    {
      id: "node-path-os",
      title: "Path, OS & Environment",
      iconName: "Layers",
      link: "https://nodejs.org/api/path.html",
      theory:
        "The path and os modules provide cross-platform utilities for working with file paths, directories, and system information. process.env gives access to environment variables.",
      theoryDetail: {
        keyConcepts: [
          "path.join() builds paths safely across OS; path.resolve() creates absolute paths",
          "os.cpus() returns CPU info; os.totalmem() returns total system memory",
          "process.env holds environment variables — use dotenv for local development",
        ],
        whyItMatters:
          "Hardcoded paths and assumptions about the OS lead to bugs when deploying across environments. path and os make code portable across Windows, macOS, and Linux.",
        commonPitfalls: [
          "Concatenating paths with string templates instead of path.join() breaking on Windows",
          "Reading process.env without validation — crash early on missing required variables",
          "Embedding secrets in code instead of reading from process.env",
        ],
        examples: [
          {
            title: "Environment variable pattern",
            description: "Safe access to required environment variables at startup.",
            code: `import path from 'node:path';
import { config } from 'dotenv';

config(); // loads .env into process.env

const PORT = process.env.PORT ?? '3000';
const DB_URL = process.env.DATABASE_URL;
if (!DB_URL) throw new Error('DATABASE_URL is required');

const uploadsDir = path.join(process.cwd(), 'uploads');`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-events",
      title: "EventEmitter & Custom Events",
      iconName: "Radio",
      link: "https://nodejs.org/api/events.html",
      theory:
        "Node's EventEmitter is the backbone of its event-driven architecture. Streams, HTTP servers, and many built-in modules all extend EventEmitter.",
      theoryDetail: {
        keyConcepts: [
          "EventEmitter.on(event, listener) registers a listener; .emit(event, data) fires it",
          "Use .once() for one-time listeners and .removeListener() to clean up",
          "Always listen for the 'error' event — unhandled errors crash the process",
        ],
        whyItMatters:
          "Understanding EventEmitter is key to writing Node-idiomatic code and debugging complex async flows. Streams, sockets, and child processes all use this pattern.",
        commonPitfalls: [
          "Not removing listeners causing memory leaks — default warning at 10 listeners per event",
          "Missing 'error' event handlers causing uncaught exceptions",
          "Emitting events synchronously inside another event handler creating hard-to-trace stacks",
        ],
        examples: [
          {
            title: "Custom EventEmitter",
            description: "Building a typed event-driven service.",
            code: `import { EventEmitter } from 'node:events';

class OrderService extends EventEmitter {
  placeOrder(order) {
    // process order...
    this.emit('order:placed', order);
  }
}

const orders = new OrderService();
orders.on('order:placed', (order) => {
  console.log('Order placed:', order.id);
});
orders.on('error', (err) => console.error('Order error', err));

orders.placeOrder({ id: '123', item: 'Book' });`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
