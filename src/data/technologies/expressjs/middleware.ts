import type { TopicNode } from "@/data/types";

export const expressMiddleware: TopicNode = {
  id: "express-middleware",
  title: "Understanding Middleware",
  iconName: "Layers",
  theory:
    "Middleware functions are the absolute backbone of Express. They are functions that execute sequentially during the lifecycle of a request to the Express server. You can think of an Express application as essentially a series of middleware function calls. Each middleware has access to the request and response objects, and the 'next' function to pass control to the following middleware.",
  theoryDetail: {
    keyConcepts: [
      "The Pipeline Pattern: Requests enter the application and pass through middleware one by one until a middleware ends the request (e.g., by calling res.send()).",
      "req, res, next: The three core arguments passed to every standard middleware function.",
      "next(): You MUST call next() to pass the request to the next function. If you don't call next() and don't send a response, the request hangs forever.",
      "Built-in Middleware: Express comes with a few built-in middlewares like express.json() for parsing JSON and express.static() for serving static files.",
      "Third-party Middleware: The Node ecosystem provides thousands of middlewares for tasks like CORS handling, security (Helmet), and logging (Morgan).",
      "Error-handling middleware: A special type of middleware that ALWAYS takes exactly FOUR arguments (err, req, res, next).",
    ],
    whyItMatters:
      "Almost everything in Express is middleware. Body parsing, authentication, logging, CORS handling, and even route definitions themselves are executed as a chain of middleware. Understanding this chain is essential to mastering Express and debugging why a request isn't reaching your route.",
    commonPitfalls: [
      "Hanging requests: Forgetting to call next() or send a response.",
      "Headers already sent: Trying to modify headers or send a response AFTER the response has already been sent to the client (often caused by calling next() after res.send()).",
      "Order matters: Middleware is executed in the exact order it is defined. Putting a global 404 handler before your actual routes will block all traffic.",
    ],
    examples: [
      {
        title: "The Middleware Chain & Third-Party Middleware (CORS)",
        description:
          "In a full-stack application, the backend is often on a different port than the frontend (e.g., React on 3000, Express on 5000). You MUST use the 'cors' middleware to allow the browser to make requests.",
        code: `import express from 'express';
import cors from 'cors';

const app = express();

// 1. Third-party middleware: Enable CORS for frontend requests
app.use(cors({ origin: 'http://localhost:3000' }));

// 2. Built-in middleware: Parse JSON bodies
app.use(express.json());

// 3. Custom middleware: Log the request
app.use((req, res, next) => {
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);
  next(); // Pass to the next middleware
});

// 4. Route handler (which is also just middleware!)
app.get('/api/data', (req, res) => {
  res.json({ message: "CORS and JSON parsing worked!" });
});

app.listen(5000);`,
        language: "javascript",
      },
      {
        title: "Authentication Middleware & Passing Data",
        description:
          "Protecting specific routes using middleware that checks for valid credentials before allowing the request to proceed. Middleware can also modify the 'req' object to pass data downstream.",
        code: `import express from 'express';
const app = express();

// A mock authentication middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (authHeader === 'Bearer secret-token') {
    // Attach data to the req object for downstream routes to use
    req.user = { id: 1, role: 'admin' };
    next(); // Valid! Proceed to the route.
  } else {
    // Invalid! Terminate the request here. Do NOT call next().
    res.status(401).json({ error: 'Unauthorized access' });
  }
};

// Apply the middleware ONLY to this specific route
app.get('/api/dashboard', requireAuth, (req, res) => {
  // We know req.user exists because requireAuth verified it
  res.json({ message: \`Welcome to the secure dashboard, user \${req.user.id}\` });
});

app.listen(3000);`,
        language: "javascript",
      },
      {
        title: "Built-in Middleware: Serving Static Files",
        description: "Express can act as a static file server for images, CSS, or even built React apps.",
        code: `import express from 'express';
import path from 'path';

const app = express();

// Serve everything inside the 'public' folder at the root URL
// E.g., placing 'logo.png' in 'public' makes it available at http://localhost:3000/logo.png
app.use(express.static(path.join(process.cwd(), 'public')));

app.listen(3000);`,
        language: "javascript",
      }
    ],
  },
  children: [],
};
