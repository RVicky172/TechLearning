import type { TopicNode } from "@/data/types";

export const expressAsyncBehavior: TopicNode = {
  id: "express-async",
  title: "Async Behavior & Error Handling",
  iconName: "Zap",
  theory:
    "Express.js was originally designed before Promises and async/await became the standard in JavaScript. By default, Express middleware and route handlers expect synchronous execution. If an asynchronous operation (like a database call) throws an error, Express will not catch it natively in version 4.",
  theoryDetail: {
    keyConcepts: [
      "Synchronous Error Handling: Express automatically catches synchronous errors thrown inside a route and passes them to the default error handler.",
      "Asynchronous Error Handling: Express 4 DOES NOT automatically catch errors (unhandled promise rejections) in async functions. You must pass them manually via next(err).",
      "Express 5: Express 5 natively supports returning promises from route handlers and catches async errors automatically.",
      "Global Error Handler: A middleware with exactly 4 arguments: (err, req, res, next) that catches all errors passed to next().",
    ],
    whyItMatters:
      "Unhandled promise rejections are the #1 cause of hanging API requests. A full-stack developer must know how to safely wrap async database calls or external API requests so that failures result in clean 500 status responses rather than a silent crash or an infinitely spinning loading state on the frontend.",
    commonPitfalls: [
      "Throwing in an async route: Throwing an error inside an async/await block without a try/catch will crash the Node.js process (or hang the request depending on the Node version).",
      "Defining the error handler in the wrong place: The global error handler must be the VERY LAST middleware defined with app.use(), after all other routes and middleware.",
    ],
    comparisons: [
      {
        title: "Express 4 vs Express 5 Async Handling",
        summary: "The shift in how promises are handled internally.",
        points: [
          "Express 4: Requires wrapping every async route in try/catch or using a library like 'express-async-errors' to monkey-patch the router.",
          "Express 5: Automatically catches rejected promises returned from route handlers and passes them directly to next(err)."
        ]
      }
    ],
    examples: [
      {
        title: "The Danger of Unhandled Async Errors",
        description: "What happens when you forget try/catch in Express 4.",
        code: `app.get('/api/users', async (req, res) => {
  // If db.getUsers() fails and throws an error, Express WILL NOT catch it.
  // The request will hang indefinitely, and the frontend will wait forever.
  const users = await db.getUsers(); 
  res.json(users);
});`,
        language: "javascript",
      },
      {
        title: "Correct Async Handling with try/catch",
        description: "Manually catching errors and passing them to Express's error handler.",
        code: `app.get('/api/users', async (req, res, next) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    // Pass the error to the global error handling middleware
    next(error); 
  }
});`,
        language: "javascript",
      },
      {
        title: "Using an Async Wrapper Pattern (Best Practice)",
        description: "A common full-stack pattern to avoid repeating try/catch in every single route.",
        code: `// A higher-order function that catches async errors
const asyncHandler = (fn) => (req, res, next) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

// Now your routes are clean! No try/catch needed here.
app.get('/api/users', asyncHandler(async (req, res) => {
  const users = await db.getUsers(); 
  res.json(users);
}));

// ─── Global Error Handler ───
// This MUST be defined after all routes
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});`,
        language: "javascript",
      }
    ],
  },
  children: [],
};
