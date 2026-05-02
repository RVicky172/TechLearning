import type { TopicNode } from "@/data/types";

export const nodeExpress: TopicNode = {
  id: "node-express",
  title: "Express.js & REST APIs",
  iconName: "Server",
  theory:
    "Express is the most popular Node.js web framework. It wraps the built-in http module with routing, middleware, and request/response helpers that make building APIs fast and readable.",
  theoryDetail: {
    keyConcepts: [
      "Express apps are composed of middleware functions: (req, res, next) => void",
      "Router instances group related routes and can be mounted at a path prefix",
      "Error-handling middleware has four arguments: (err, req, res, next)",
    ],
    whyItMatters:
      "Express is used in millions of production applications. Mastering its middleware model is directly transferable to Fastify, Koa, and Hono since they share the same mental model.",
    commonPitfalls: [
      "Forgetting to call next() in middleware, halting the request pipeline silently",
      "Not having a global error handler — unhandled errors become 500 responses with stack traces in production",
      "Mounting middleware after routes — middleware must be registered before the routes it should affect",
    ],
  },
  children: [
    {
      id: "node-express-basics",
      title: "Setup & Routing",
      iconName: "Map",
      link: "https://expressjs.com/en/guide/routing.html",
      theory:
        "Express routing maps HTTP methods and URL patterns to handler functions. Organize routes with express.Router() to keep large codebases maintainable.",
      theoryDetail: {
        keyConcepts: [
          "app.get/post/put/delete/patch() register route handlers for specific HTTP methods",
          "Route parameters (:id) are available via req.params; query strings via req.query",
          "express.Router() creates a mini-app with its own middleware and routes",
        ],
        whyItMatters:
          "Well-structured routing keeps Express apps maintainable at scale. Routes that grow beyond a single file need to be split into Routers early, before they become tangled.",
        commonPitfalls: [
          "Defining all routes in a single file — split by resource (users, orders, products)",
          "Not validating req.params and req.query — they are always strings, not numbers",
          "Using app.get('*') too broadly, intercepting requests meant for other routes",
        ],
        examples: [
          {
            title: "Basic Express server with Router",
            description: "Minimal Express setup with a modular router.",
            code: `import express from 'express';

const app = express();
app.use(express.json());

const userRouter = express.Router();

userRouter.get('/', async (req, res) => {
  const users = await db.user.findMany();
  res.json(users);
});

userRouter.get('/:id', async (req, res) => {
  const user = await db.user.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(user);
});

app.use('/users', userRouter);
app.listen(3000, () => console.log('Server running on port 3000'));`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-express-middleware",
      title: "Middleware Pipeline",
      iconName: "Layers",
      link: "https://expressjs.com/en/guide/using-middleware.html",
      theory:
        "Middleware functions run in sequence for every request. They can modify req/res, end the request, or call next() to pass control to the next function in the chain.",
      theoryDetail: {
        keyConcepts: [
          "Middleware order matters — register app-level middleware before routes",
          "Third-party middleware: morgan (logging), helmet (security headers), cors (cross-origin)",
          "Route-level middleware can protect specific endpoints (e.g., auth guards)",
        ],
        whyItMatters:
          "Middleware is how cross-cutting concerns like logging, authentication, and rate limiting are applied uniformly without duplicating code in every route handler.",
        commonPitfalls: [
          "Calling next() after sending a response causes a 'headers already sent' error",
          "Placing CORS middleware after routes — it must come first to affect preflight requests",
          "Writing middleware that reads req.body before express.json() middleware runs",
        ],
        examples: [
          {
            title: "Custom auth middleware",
            description: "Protect routes by validating a Bearer token before the handler runs.",
            code: `function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// Apply to all routes in this router
router.use(requireAuth);
// Or to a specific route only
router.delete('/:id', requireAuth, deleteUser);`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-express-validation",
      title: "Input Validation",
      iconName: "CheckSquare",
      link: "https://express-validator.github.io/docs/",
      theory:
        "Always validate and sanitize incoming data before processing. Libraries like Zod, Joi, or express-validator make schema-based validation straightforward.",
      theoryDetail: {
        keyConcepts: [
          "Validate request body, params, and query string — all can contain malicious input",
          "Return structured 400 errors that tell the client what fields are invalid",
          "Zod schemas can be shared between client and server in full-stack TypeScript projects",
        ],
        whyItMatters:
          "Missing input validation is the root cause of injection attacks and unexpected runtime crashes. Validating at the route boundary ensures invalid data never reaches your business logic.",
        commonPitfalls: [
          "Trusting client-provided IDs without checking they belong to the authenticated user",
          "Returning raw validation library error objects instead of clean user-facing messages",
          "Validating only the body but ignoring req.params and req.query",
        ],
        examples: [
          {
            title: "Zod schema validation middleware",
            description: "Parse and validate the request body using a Zod schema.",
            code: `import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
});

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten() });
    }
    req.body = result.data;
    next();
  };
}

router.post('/users', validate(CreateUserSchema), createUser);`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-express-error-handling",
      title: "Error Handling in Express",
      iconName: "AlertTriangle",
      link: "https://expressjs.com/en/guide/error-handling.html",
      theory:
        "Express has a built-in error-handling middleware signature (err, req, res, next). Centralizing error handling ensures every error returns a consistent response shape.",
      theoryDetail: {
        keyConcepts: [
          "Error middleware must have exactly 4 parameters: (err, req, res, next)",
          "Pass errors to it with next(err); Express skips normal middleware and goes straight to error handlers",
          "Distinguish operational errors (404, 400) from unexpected errors (500) for appropriate responses",
        ],
        whyItMatters:
          "A centralized error handler is the safety net for your whole API. Without it, unhandled errors leak stack traces to clients and crash in unpredictable ways.",
        commonPitfalls: [
          "Registering error middleware before routes — it must come last",
          "Not calling next(err) in async handlers — use try/catch or an async wrapper",
          "Sending different error shapes from different routes making client integration difficult",
        ],
        examples: [
          {
            title: "Centralized error handler",
            description: "One middleware that handles all thrown errors consistently.",
            code: `// Async handler wrapper to avoid repetitive try/catch
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

router.get('/:id', asyncHandler(async (req, res) => {
  const item = await db.find(req.params.id);
  if (!item) throw new AppError('Not found', 404);
  res.json(item);
}));

// Global error handler — must be last
app.use((err, req, res, next) => {
  const status = err.statusCode ?? 500;
  const message = err.isOperational ? err.message : 'Internal Server Error';
  res.status(status).json({ error: message });
});`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
