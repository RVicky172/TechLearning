import type { TopicNode } from "@/data/types";

export const expressInterviewQuestions: TopicNode = {
  id: "express-interview",
  title: "Interview Questions",
  iconName: "HelpCircle",
  theory:
    "Express.js interview questions organized by difficulty. These cover the fundamentals of request handling, middleware, CORS, security, validation, and production backend trade-offs.",
  theoryDetail: {
    keyConcepts: [
      "Easy questions test request-response basics, routing, middleware flow, and core Express terminology.",
      "Medium questions test practical backend concerns such as CORS, validation, auth middleware, and error handling order.",
      "Hard questions test production thinking: stateless APIs, proxy configuration, async failures, scaling, and security trade-offs.",
    ],
    whyItMatters:
      "Express interviews are rarely about syntax alone. Good answers show that you understand HTTP behavior, middleware ordering, production safeguards, and the trade-offs behind API architecture decisions.",
    commonPitfalls: [
      "Answering only with definitions instead of explaining request flow and practical consequences.",
      "Confusing browser-specific problems like CORS with server-side bugs.",
      "Ignoring security, validation, and operational concerns when discussing API design.",
    ],
  },
  children: [
    {
      id: "express-iq-easy",
      title: "Easy",
      iconName: "CircleCheck",
      theory:
        "Foundational Express questions expected from anyone building simple APIs or backend routes.",
      children: [
        {
          id: "express-iq-what-is-express",
          title: "What is Express.js?",
          iconName: "Server",
          theory: "A standard opener that checks whether you understand what Express adds on top of Node.js.",
          theoryDetail: {
            examples: [
              {
                title: "Q: What is Express.js and how is it different from Node's http module?",
                description:
                  "A strong answer compares raw Node boilerplate with Express routing, middleware, and developer ergonomics.",
                code: `// Raw Node.js http requires manual routing, parsing, and response handling.
// Express adds:
// 1) app.get/app.post style routing
// 2) middleware composition
// 3) request/response helpers like res.json()
// 4) modular routers and ecosystem middleware

// Express is still built on top of Node's HTTP server primitives.`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-middleware",
          title: "What is Middleware?",
          iconName: "Layers",
          theory: "Interviewers use this to verify whether you understand the Express request pipeline.",
          theoryDetail: {
            examples: [
              {
                title: "Q: What is middleware in Express?",
                description:
                  "Explain that middleware can run code, mutate req/res, end the request, or forward control with next().",
                code: `app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.get('/health', (req, res) => {
  res.json({ ok: true });
});`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-use-vs-get",
          title: "app.use vs app.get",
          iconName: "GitBranch",
          theory: "Tests whether you understand routing specificity and middleware mounting behavior.",
          theoryDetail: {
            examples: [
              {
                title: "Q: What is the difference between app.use() and app.get()?",
                description:
                  "The expected answer distinguishes generic middleware mounting from method-specific route matching.",
                code: `app.use('/api', authMiddleware); // runs for GET, POST, PATCH, DELETE...
app.get('/api/users', listUsers);   // runs only for GET /api/users`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-router",
          title: "Why use express.Router?",
          iconName: "Map",
          theory: "A practical organization question for growing Express codebases.",
          theoryDetail: {
            examples: [
              {
                title: "Q: Why is express.Router important?",
                description:
                  "The best answer focuses on modular route organization, per-domain middleware, and maintainability.",
                code: `import { Router } from 'express';

const usersRouter = Router();
usersRouter.get('/', listUsers);
usersRouter.post('/', createUser);

app.use('/api/users', usersRouter);`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-404",
          title: "404 handling",
          iconName: "CircleAlert",
          theory: "Checks middleware ordering knowledge and how Express handles unmatched routes.",
          theoryDetail: {
            examples: [
              {
                title: "Q: How do you handle 404 Not Found errors in Express?",
                description:
                  "A strong answer explains the catch-all middleware position at the end of the route chain.",
                code: `app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});`,
                language: "javascript",
              },
            ],
          },
        },
      ],
    },
    {
      id: "express-iq-medium",
      title: "Medium",
      iconName: "CircleDot",
      theory:
        "Mid-level backend questions around CORS, validation, authentication, and safe async request handling.",
      children: [
        {
          id: "express-iq-cors",
          title: "What is CORS?",
          iconName: "Globe",
          theory: "A common full-stack interview question because frontend-backend integration fails here often.",
          theoryDetail: {
            examples: [
              {
                title: "Q: What is CORS and why do we need the cors middleware in Express?",
                description:
                  "Good answers explain the Same-Origin Policy, browser enforcement, cross-origin response headers, and why production apps usually use an explicit allowlist of trusted frontend URLs.",
                code: `import cors from 'cors';

app.use(cors({
  origin(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://app.example.com',
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
}));

// This allows only trusted frontend origins to read the response.`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-error-handler",
          title: "Error-handling middleware",
          iconName: "TriangleAlert",
          theory: "Tests whether you know the special signature and ordering of Express error handlers.",
          theoryDetail: {
            examples: [
              {
                title: "Q: What is the signature of an Express error-handling middleware?",
                description:
                  "Interviewers expect the exact four-argument signature and correct placement after routes.",
                code: `app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-validation",
          title: "Request validation",
          iconName: "CheckCircle",
          theory: "A practical API design question that separates demo apps from production services.",
          theoryDetail: {
            examples: [
              {
                title: "Q: Why is request validation necessary in Express APIs?",
                description:
                  "Strong answers mention untrusted input, 400-level responses, and runtime schema validation.",
                code: `const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const parsed = schema.safeParse(req.body);
if (!parsed.success) {
  return res.status(400).json({ error: 'Validation failed' });
}`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-auth-middleware",
          title: "Authentication middleware",
          iconName: "Key",
          theory: "A core backend interview topic because middleware is where auth logic usually lives.",
          theoryDetail: {
            examples: [
              {
                title: "Q: How do you protect routes in Express?",
                description:
                  "The best answer uses authentication middleware before route handlers and keeps authorization checks reusable.",
                code: `function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

app.get('/api/private', requireAuth, (req, res) => {
  res.json({ ok: true });
});`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-async-errors",
          title: "Async route handling",
          iconName: "Zap",
          theory: "Checks whether you understand rejected promises and request hangs in Express 4 style apps.",
          theoryDetail: {
            examples: [
              {
                title: "Q: How does Express handle asynchronous errors?",
                description:
                  "A strong answer contrasts Express 4 manual handling with Express 5 promise-aware behavior.",
                code: `app.get('/api/users', async (req, res, next) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
});`,
                language: "javascript",
              },
            ],
          },
        },
      ],
    },
    {
      id: "express-iq-hard",
      title: "Hard / Advanced",
      iconName: "Flame",
      theory:
        "Senior-level Express questions about production hardening, scaling, proxies, and architectural trade-offs.",
      children: [
        {
          id: "express-iq-security",
          title: "Production security",
          iconName: "Shield",
          theory: "Evaluates whether you think beyond routes and into operational API safety.",
          theoryDetail: {
            examples: [
              {
                title: "Q: How would you harden an Express API for production?",
                description:
                  "The best answers mention Helmet, validation, rate limiting, safe errors, auth, and secret management.",
                code: `app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Internal server error' });
});`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-trust-proxy",
          title: "trust proxy and deployment",
          iconName: "Waypoints",
          theory: "A deployment-focused question that appears in senior backend and DevOps-adjacent interviews.",
          theoryDetail: {
            examples: [
              {
                title: "Q: Why does trust proxy matter in deployed Express apps?",
                description:
                  "Interviewers want to hear about reverse proxies, secure cookies, client IPs, and load balancers.",
                code: `app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    secure: true,
    httpOnly: true,
  },
}));`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-scaling",
          title: "Scaling Express services",
          iconName: "Scaling",
          theory: "Tests architectural thinking for stateless APIs and horizontally scaled Node services.",
          theoryDetail: {
            examples: [
              {
                title: "Q: How do you scale an Express application?",
                description:
                  "A strong answer covers stateless design, external session stores, caching, queues, and horizontal scaling.",
                code: `// Scaling checklist:
// 1) Keep app instances stateless
// 2) Move sessions/cache to Redis or external stores
// 3) Run behind a load balancer
// 4) Offload heavy jobs to queues/workers
// 5) Add structured logging and health checks`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-rest-design",
          title: "REST API design trade-offs",
          iconName: "Network",
          theory: "This reveals whether a candidate can reason about route structure, status codes, and API evolution.",
          theoryDetail: {
            examples: [
              {
                title: "Q: What makes a well-designed REST API in Express?",
                description:
                  "The expected answer covers resource naming, status codes, validation, idempotency, versioning, and consistent error contracts.",
                code: `// Examples of good API design decisions:
// GET    /api/users
// GET    /api/users/:id
// POST   /api/users
// PATCH  /api/users/:id
// DELETE /api/users/:id

// Use consistent JSON responses and meaningful HTTP status codes.`,
                language: "javascript",
              },
            ],
          },
        },
        {
          id: "express-iq-cookies-vs-jwt",
          title: "Cookies vs JWT",
          iconName: "Cookie",
          theory: "A classic backend trade-off question around auth models and operational complexity.",
          theoryDetail: {
            examples: [
              {
                title: "Q: When would you choose cookie sessions vs JWT in Express?",
                description:
                  "Strong answers mention CSRF, statelessness, revocation strategy, infrastructure, and browser behavior.",
                code: `// Cookie sessions:
// - simpler for browser apps
// - easier token rotation and revocation with server-side session store

// JWT:
// - more stateless across services
// - requires careful expiry, refresh, and invalidation strategy

// Choose based on architecture, not trend.`,
                language: "javascript",
              },
            ],
          },
        },
      ],
    },
  ],
};
