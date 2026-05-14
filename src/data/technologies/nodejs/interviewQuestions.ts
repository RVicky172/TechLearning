import type { TopicNode } from "@/data/types";

export const nodeInterviewQuestions: TopicNode = {
  id: "node-interview-questions",
  title: "Interview Questions",
  iconName: "HelpCircle",
  theory:
    "This section focuses on high-frequency Node.js interview questions with practical production reasoning: event loop behavior, scaling, API reliability, and error handling.",
  theoryDetail: {
    keyConcepts: [
      "Explain Node internals clearly: event loop phases, non-blocking I/O, and process lifecycle",
      "Use examples that show resilience under load, not just syntax knowledge",
      "Discuss trade-offs between simplicity, performance, and operational safety",
    ],
    whyItMatters:
      "Node.js interviews often test if you can build stable backend services under real traffic, not just write async/await syntax.",
    commonPitfalls: [
      "Ignoring event-loop blocking when discussing performance",
      "Not distinguishing CPU-bound and I/O-bound workloads",
      "Forgetting graceful shutdown and error handling in API examples",
    ],
    examples: [
      {
        title: "Interview answer framing template",
        description:
          "A reliable structure to answer senior Node.js system questions clearly.",
        code: `1) State assumptions and constraints
2) Explain baseline architecture
3) Identify bottlenecks (CPU, I/O, DB, network)
4) Propose scaling and reliability controls
5) Add security and observability decisions
6) Mention trade-offs and fallback plan`,
        language: "text",
      },
    ],
  },
  children: [
    {
      id: "node-iq-event-loop",
      title: "Event Loop Deep Dive",
      iconName: "RefreshCw",
      theory: "A classic interview area: execution order and how to avoid starving I/O.",
      theoryDetail: {
        examples: [
          {
            title: "Q: setTimeout(0) vs setImmediate vs process.nextTick",
            description:
              "A good answer explains phases and warns that recursive nextTick can starve the loop.",
            code: `setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
process.nextTick(() => console.log('nextTick'));

// nextTick runs before returning to the event loop.
// setTimeout and setImmediate order can vary by context.`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-iq-scaling",
      title: "Scaling & Performance",
      iconName: "Gauge",
      theory: "Interviewers test if you can handle throughput while keeping latency predictable.",
      theoryDetail: {
        examples: [
          {
            title: "Q: How do you scale a Node API?",
            description:
              "Expected answer includes horizontal scaling, clustering/PM2, caching, and observability.",
            code: `// Typical production approach:
// 1) Run multiple Node processes (cluster/PM2 or container replicas)
// 2) Put behind a load balancer
// 3) Add Redis cache for hot reads
// 4) Use async queues for heavy background jobs
// 5) Monitor p95 latency, CPU, memory, and error rates`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-iq-error-handling",
      title: "Error Handling in APIs",
      iconName: "ShieldAlert",
      theory: "Reliable services require consistent error boundaries and graceful process behavior.",
      theoryDetail: {
        examples: [
          {
            title: "Q: How do you prevent crashes from async errors?",
            description:
              "Show centralized middleware, explicit status mapping, and process-level handlers with graceful shutdown.",
            code: `app.use(async (req, res, next) => {
  try {
    await next();
  } catch (err) {
    req.log.error({ err }, 'request failed');
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

process.on('unhandledRejection', (err) => {
  logger.fatal({ err }, 'Unhandled promise rejection');
  shutdownGracefully();
});`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-iq-streams",
      title: "Streams vs Buffers",
      iconName: "Workflow",
      theory: "Interviewers use this to test understanding of memory efficiency at scale.",
      theoryDetail: {
        examples: [
          {
            title: "Q: When would you use a stream instead of reading a file into memory?",
            description:
              "Streams process data chunk-by-chunk. Reading a 5 GB file into memory crashes a Node process; piping it as a stream uses kilobytes.",
            code: `// ❌ Loads entire file into memory
const data = fs.readFileSync('huge.csv');
processData(data);

// ✅ Processes line-by-line without loading into memory
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';

const rl = createInterface({
  input: createReadStream('huge.csv'),
  crlfDelay: Infinity,
});

for await (const line of rl) {
  processLine(line);
}`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-iq-auth",
      title: "Authentication Architecture",
      iconName: "KeyRound",
      theory:
        "A common senior question tests whether you can design a secure, scalable auth system.",
      theoryDetail: {
        examples: [
          {
            title: "Q: Design a JWT auth system",
            description:
              "Short-lived access tokens + httpOnly refresh tokens is the gold standard for stateless API auth.",
            code: `// Login flow
POST /auth/login
→ bcrypt.compare(password, hash)
→ return { accessToken (15m JWT), refreshToken (7d, httpOnly cookie) }

// Authenticated request
GET /users/me
Authorization: Bearer <accessToken>
→ verify JWT signature and expiry
→ return user data

// Token refresh
POST /auth/refresh
Cookie: refreshToken=<value>
→ verify refresh token in DB (allows revocation)
→ return new accessToken

// Logout
POST /auth/logout
→ delete refresh token from DB
→ clear httpOnly cookie`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-iq-databases",
      title: "Database Optimization",
      iconName: "Database",
      theory:
        "Interviewers probe whether you understand the N+1 problem and when to use indexes.",
      theoryDetail: {
        examples: [
          {
            title: "Q: What is the N+1 problem and how do you fix it?",
            description:
              "N+1 queries fetch a list (1 query) then query each item individually (N queries). Fix with JOINs or eager loading.",
            code: `// ❌ N+1 — 1 query for users + 1 per user for their posts
const users = await db.user.findMany();
for (const user of users) {
  user.posts = await db.post.findMany({ where: { userId: user.id } });
}

// ✅ Single query with eager loading (Prisma include)
const users = await db.user.findMany({
  include: { posts: true },
});

// ✅ SQL JOIN equivalent
SELECT u.*, p.*
FROM users u
LEFT JOIN posts p ON p.user_id = u.id;`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-iq-testing",
      title: "Testing Strategy",
      iconName: "TestTube",
      theory:
        "Senior roles require articulating a testing philosophy, not just writing individual tests.",
      theoryDetail: {
        examples: [
          {
            title: "Q: How do you test a Node.js API?",
            description:
              "Describe the testing pyramid: unit tests for business logic, integration tests for route contracts, and a few E2E smoke tests.",
            code: `// Testing pyramid for a Node API:

// 1) Unit tests — fast, isolated, mock dependencies
//    Test: validation logic, business rules, utility functions
describe('calculateDiscount', () => {
  it('returns 20% discount for premium users', () => {
    expect(calculateDiscount('premium', 100)).toBe(80);
  });
});

// 2) Integration tests — test HTTP contract (Supertest + test DB)
//    Test: routing, middleware, serialization, error codes
it('POST /orders returns 201 with valid body', async () => {
  await request(app).post('/orders').send(validOrder).expect(201);
});

// 3) E2E / smoke tests — few, run against staging
//    Test: critical user journeys (register → login → place order)`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
