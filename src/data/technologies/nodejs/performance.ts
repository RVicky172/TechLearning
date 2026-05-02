import type { TopicNode } from "@/data/types";

export const nodePerformance: TopicNode = {
  id: "node-performance",
  title: "Performance & Production",
  iconName: "Gauge",
  theory:
    "Taking a Node.js app to production requires clustering for CPU utilization, structured logging for observability, graceful shutdown to avoid dropped requests, and profiling to find bottlenecks.",
  theoryDetail: {
    keyConcepts: [
      "Node is single-threaded — use the cluster module or PM2 to use all available CPU cores",
      "Structured JSON logs (Pino, Winston) are machine-parseable and integrate with log aggregation systems",
      "Graceful shutdown: stop accepting new requests, finish in-flight ones, then close DB connections",
    ],
    whyItMatters:
      "An app that performs well under load and recovers cleanly from failures is production-ready. Without clustering, logging, and graceful shutdown, even a correct app will be fragile at scale.",
    commonPitfalls: [
      "Running a single Node process on a multi-core machine — you're wasting most of your CPU",
      "Using console.log in production — it's synchronous and blocks the event loop under high throughput",
      "Killing the server with SIGKILL instead of SIGTERM, dropping all in-flight requests",
    ],
  },
  children: [
    {
      id: "node-clustering",
      title: "Clustering & Worker Threads",
      iconName: "Cpu",
      link: "https://nodejs.org/api/cluster.html",
      theory:
        "The cluster module spawns multiple worker processes sharing the same port. Worker Threads provide true parallelism for CPU-intensive tasks without blocking the event loop.",
      theoryDetail: {
        keyConcepts: [
          "cluster.fork() creates a child process that shares the server port — use one per CPU core",
          "Worker Threads share memory via SharedArrayBuffer and communicate via postMessage",
          "Use worker threads for CPU-bound work (image processing, ML inference) not I/O-bound tasks",
        ],
        whyItMatters:
          "A single Node process uses one CPU core. A 16-core production server without clustering serves the same throughput as a laptop. Clustering is table-stakes for production Node APIs.",
        commonPitfalls: [
          "Using Worker Threads for I/O tasks — async/await is more efficient for I/O than threads",
          "Not restarting crashed workers — the primary should listen for 'exit' events and respawn",
          "Storing session state in process memory — it won't be shared across cluster workers",
        ],
        examples: [
          {
            title: "Basic cluster setup",
            description: "Fork one worker per CPU core and auto-restart on crash.",
            code: `import cluster from 'node:cluster';
import os from 'node:os';

if (cluster.isPrimary) {
  const cpuCount = os.cpus().length;
  console.log(\`Primary \${process.pid} starting \${cpuCount} workers\`);

  for (let i = 0; i < cpuCount; i++) cluster.fork();

  cluster.on('exit', (worker, code) => {
    console.log(\`Worker \${worker.process.pid} died (code \${code}), restarting...\`);
    cluster.fork();
  });
} else {
  // Worker process — start the Express app
  const { startServer } = await import('./server.js');
  startServer();
  console.log(\`Worker \${process.pid} started\`);
}`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-logging",
      title: "Structured Logging with Pino",
      iconName: "FileText",
      link: "https://getpino.io/",
      theory:
        "Pino is the fastest JSON logger for Node.js. Structured logs (JSON objects with consistent fields) are searchable in log aggregation systems like Datadog, CloudWatch, and Splunk.",
      theoryDetail: {
        keyConcepts: [
          "Log levels: trace < debug < info < warn < error < fatal — set level via LOG_LEVEL env var",
          "Always include a request ID in every log line for a request — use cls-rtracer or similar",
          "pino-http auto-logs every request with method, URL, status, and response time",
        ],
        whyItMatters:
          "Unstructured console.log output is impossible to query at scale. Structured logs let you filter by user ID, trace ID, or error code across millions of lines in seconds.",
        commonPitfalls: [
          "Logging at 'debug' level in production — set LOG_LEVEL=info to avoid log volume explosion",
          "Logging sensitive data (passwords, tokens, PII) — always redact before logging",
          "Using console.log synchronously — Pino writes asynchronously to avoid blocking",
        ],
        examples: [
          {
            title: "Pino with pino-http",
            description: "Structured request logging with automatic correlation IDs.",
            code: `import Pino from 'pino';
import pinoHttp from 'pino-http';
import { randomUUID } from 'node:crypto';

export const logger = Pino({
  level: process.env.LOG_LEVEL ?? 'info',
  redact: ['req.headers.authorization', 'body.password'],
});

export const httpLogger = pinoHttp({
  logger,
  genReqId: () => randomUUID(),
});

// In Express
app.use(httpLogger);

// In route handlers — req.log is bound to the request's ID
app.get('/users/:id', (req, res) => {
  req.log.info({ userId: req.params.id }, 'Fetching user');
});`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-graceful-shutdown",
      title: "Graceful Shutdown",
      iconName: "PowerOff",
      link: "https://nodejs.org/api/process.html#signal-events",
      theory:
        "Graceful shutdown ensures in-flight requests finish, database connections are closed cleanly, and the process exits with code 0. This is required for zero-downtime deployments.",
      theoryDetail: {
        keyConcepts: [
          "Listen for SIGTERM (container stop) and SIGINT (Ctrl+C) — don't use SIGKILL (un-catchable)",
          "server.close() stops accepting new connections but waits for existing ones to finish",
          "Set a shutdown timeout (5–10 seconds) — force-exit if connections don't drain in time",
        ],
        whyItMatters:
          "Without graceful shutdown, rolling deploys drop in-flight requests, leaving clients with connection errors. Kubernetes and load balancers send SIGTERM before stopping — you must handle it.",
        commonPitfalls: [
          "Not closing database connections on shutdown causing connection pool exhaustion on restart",
          "Infinite hang when keep-alive connections don't close — set server.keepAliveTimeout appropriately",
          "Catching SIGTERM but not actually calling process.exit() leaving the process as a zombie",
        ],
        examples: [
          {
            title: "Production graceful shutdown",
            description: "Handle SIGTERM and SIGINT with a configurable drain timeout.",
            code: `const server = app.listen(env.PORT, () =>
  logger.info(\`Server listening on port \${env.PORT}\`)
);

async function shutdown(signal) {
  logger.info({ signal }, 'Received shutdown signal');

  server.close(async () => {
    logger.info('HTTP server closed');
    await db.$disconnect();
    await redis.quit();
    logger.info('Shutdown complete');
    process.exit(0);
  });

  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT',  () => shutdown('SIGINT'));`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-profiling",
      title: "Profiling & Debugging",
      iconName: "Search",
      link: "https://nodejs.org/en/docs/guides/simple-profiling",
      theory:
        "Node.js provides built-in profiling via --prof and the V8 inspector. Clinic.js and 0x offer flame graphs to identify CPU hotspots and event loop bottlenecks.",
      theoryDetail: {
        keyConcepts: [
          "--inspect flag enables the Chrome DevTools debugger for live Node processes",
          "node --prof generates a V8 tick profile; node --prof-process makes it human-readable",
          "Clinic.js Doctor identifies event-loop blocking, memory leaks, and I/O issues automatically",
        ],
        whyItMatters:
          "Performance problems in production are expensive. Profiling tools let you find the 20% of code causing 80% of latency before users start filing complaints.",
        commonPitfalls: [
          "Profiling in development with different data sizes than production — results won't match",
          "Fixing symptoms (adding caches) without understanding root causes from the profile",
          "Not using --inspect-brk for debugging startup code — the debugger must attach before execution continues",
        ],
        examples: [
          {
            title: "Attach Chrome DevTools to Node",
            description: "Start a server in debug mode and connect Chrome DevTools.",
            code: `# Start with inspector
node --inspect src/server.js

# Break on first line (useful for startup debugging)
node --inspect-brk src/server.js

# Open chrome://inspect in Chrome -> click "Open dedicated DevTools for Node"
# Set breakpoints, inspect memory, record CPU profiles

# Generate a V8 CPU profile
node --prof src/server.js
node --prof-process isolate-*.log > profile.txt`,
            language: "bash",
          },
        ],
      },
    },
  ],
};
