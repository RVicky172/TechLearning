import type { Technology } from "@/data/types";

const nodejs: Technology = {
  id: "nodejs",
  name: "Node.js",
  description: "Event-driven JavaScript runtime built on Chrome's V8 engine for scalable server-side applications.",
  color: "bg-green-600",
  iconName: "Server",
  tree: [
    {
      id: "node-basics",
      title: "Node.js Fundamentals",
      iconName: "BookOpen",
      theory: "Node.js lets JavaScript run on the server. Learn how its non-blocking I/O and event loop work to handle thousands of concurrent requests efficiently.",
      children: [
        {
          id: "node-modules",
          title: "Modules & CommonJS",
          iconName: "Package",
          link: "https://nodejs.org/en/docs/guides/",
          theory: "Node uses CommonJS modules (require/exports) and ESM (import/export). Understanding module resolution is key to structuring Node projects."
        },
        {
          id: "node-fs",
          title: "File System & Streams",
          iconName: "FolderOpen",
          link: "https://nodejs.org/api/fs.html",
          theory: "The fs module provides both synchronous and asynchronous file operations. Streams let you process large data without loading it all into memory."
        },
        {
          id: "node-http",
          title: "HTTP Module & APIs",
          iconName: "Globe",
          link: "https://nodejs.org/api/http.html",
          theory: "Node's built-in http module creates web servers. Most projects use Express or Fastify on top of it for routing and middleware."
        }
      ]
    },
    {
      id: "node-async",
      title: "Async Programming",
      iconName: "Zap",
      theory: "Node's power comes from asynchronous code. Master callbacks, Promises, and async/await to avoid blocking the event loop.",
      children: [
        {
          id: "node-promises",
          title: "Promises & async/await",
          iconName: "Clock",
          link: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises",
          theory: "Promises represent future values. async/await is syntactic sugar that makes asynchronous code read like synchronous code."
        },
        {
          id: "node-eventloop",
          title: "The Event Loop",
          iconName: "RefreshCw",
          link: "https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick",
          theory: "The event loop is how Node handles non-blocking I/O. Understanding phases like timers, poll, and check helps you write performant code."
        }
      ]
    }
  ]
};

export default nodejs;
