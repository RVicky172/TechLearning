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
    examples: [
      {
        title: "Event loop friendly request handler",
        description:
          "Move blocking work out of the request path and keep handlers async.",
        code: `import { readFile } from 'node:fs/promises';

// Avoid readFileSync in request handlers.
export async function getConfig(req, res) {
  try {
    const raw = await readFile('./config/runtime.json', 'utf8');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(raw);
  } catch (error) {
    res.writeHead(500);
    res.end('config unavailable');
  }
}`,
        language: "javascript",
      },
    ],
  },
  children: [
    {
      id: "node-modules",
      title: "Modules: CommonJS vs ESM",
      iconName: "Package",
      link: "https://nodejs.org/api/packages.html#modules-packages",
      theory:
        "Node.js historically relied on CommonJS (CJS) with 'require()' and 'module.exports'. Today, the ecosystem is shifting entirely to ES Modules (ESM) with 'import' and 'export'. Understanding the mechanical differences between these two module systems is arguably the most important foundational knowledge for modern Node.js development.",
      theoryDetail: {
        keyConcepts: [
          "CommonJS is Synchronous: Modules are loaded, parsed, and executed at runtime when require() is called. This can block the event loop if called dynamically.",
          "ESM is Asynchronous & Phased: Module loading happens in three distinct phases: Construction (finding and parsing), Instantiation (wiring up exports/imports), and Evaluation (running the code).",
          "Strict Mode by Default: ESM files run in strict mode automatically. 'this' at the top level is undefined.",
          "Resolution differences: ESM requires file extensions for relative paths (e.g., import './utils.js'). CommonJS automatically resolves .js and /index.js.",
          "package.json configures the default: Setting 'type': 'module' treats all .js files as ESM. You can force CJS with the .cjs extension, or ESM with the .mjs extension.",
        ],
        whyItMatters:
          "The migration from CJS to ESM has split the Node ecosystem. Many popular packages (like 'node-fetch', 'chalk', 'execa') are now 'ESM-only'. If you build a CJS app, you cannot use 'require()' on these packages. Understanding how to structure your app as ESM, and how to interoperate with older CJS code, will save you hours of debugging 'ERR_REQUIRE_ESM' and 'Cannot use import statement outside a module' errors.",
        commonPitfalls: [
          "ERR_REQUIRE_ESM: Occurs when you try to use require() on an ESM-only package.",
          "Missing File Extensions: Forgetting to add '.js' to relative imports in ESM code.",
          "Missing Global Variables: __dirname, __filename, require, and module are not available in ESM. They must be polyfilled or accessed via import.meta.url.",
        ],
        comparisons: [
          {
            title: "Architectural Differences",
            summary: "How CJS and ESM differ under the hood.",
            points: [
              "Parsing: CJS dependencies are discovered during execution. ESM dependencies are statically analyzed before any code runs.",
              "Caching: Both cache modules after the first load, but ESM exports bindings (live references), while CJS exports a copied object by default.",
              "Top-Level Await: ESM allows 'await' at the root of a file (great for database connections). CJS requires wrapping in an async IIFE.",
            ],
          },
        ],
        examples: [
          {
            title: "Solving the __dirname and __filename problem in ESM",
            description:
              "Because ESM doesn't inject CommonJS variables like __dirname, you must reconstruct them using the 'url' and 'path' modules. This is a very common requirement when serving static files or resolving local paths.",
            code: `// In CommonJS: const filepath = path.join(__dirname, 'templates', 'email.html');

// In ES Modules:
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// import.meta.url is the absolute file:// URL of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const templatePath = join(__dirname, 'templates', 'email.html');
console.log('Template located at:', templatePath);`,
            language: "javascript",
          },
          {
            title: "CJS and ESM Interoperability (The Bridge)",
            description:
              "Sometimes you are writing an ESM application but need to load a legacy CJS module or a JSON file. You can create a custom require function to bridge the gap.",
            code: `import { createRequire } from 'node:module';

// Create a require function bound to the current module's URL
const require = createRequire(import.meta.url);

// 1. Loading JSON (ESM doesn't natively support JSON imports without experimental flags yet)
const config = require('./config.json');

// 2. Loading legacy CommonJS modules safely
const legacyLogger = require('old-enterprise-logger');

legacyLogger.info('App started with config v' + config.version);`,
            language: "javascript",
          },
          {
            title: "Dynamic Imports in CommonJS",
            description:
              "If you are stuck in a legacy CommonJS codebase but MUST use an ESM-only package (like node-fetch v3+), you can use the dynamic import() function, which returns a Promise.",
            code: `// This is a CommonJS file (e.g. index.cjs or 'type': 'commonjs')

async function fetchUserData() {
  // We cannot use require('node-fetch') because it is an ESM-only package.
  // Instead, we use dynamic import():
  const { default: fetch } = await import('node-fetch');
  
  const response = await fetch('https://api.github.com/users/octocat');
  const data = await response.json();
  console.log(data);
}

fetchUserData();`,
            language: "javascript",
          },
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
        examples: [
          {
            title: "Stream large file safely",
            description:
              "Pipe a large file response without loading the entire payload into memory.",
            code: `import { createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

export async function download(req, res) {
  res.writeHead(200, { 'Content-Type': 'application/octet-stream' });
  await pipeline(createReadStream('./archives/report.zip'), res);
}`,
            language: "javascript",
          },
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
        examples: [
          {
            title: "Minimal robust http server",
            description:
              "A baseline pattern that sets status, headers, and always completes responses.",
            code: `import http from 'node:http';

const server = http.createServer((req, res) => {
  if (req.url === '/healthz') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end('{"ok":true}');
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(3000);`,
            language: "javascript",
          },
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
