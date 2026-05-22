import type { TopicNode } from "@/data/types";

export const expressRouting: TopicNode = {
  id: "express-routing",
  title: "Routing & Router",
  iconName: "Map",
  theory:
    "Routing refers to determining how an application responds to a client request to a particular endpoint, which is a URI (or path) and a specific HTTP request method (GET, POST, and so on).",
  theoryDetail: {
    keyConcepts: [
      "Route methods: app.get(), app.post(), app.put(), app.delete() handle specific HTTP methods.",
      "Route paths: Can be strings, string patterns, or regular expressions. E.g., '/users', '/about.text'.",
      "Route parameters: Named URL segments used to capture values. E.g., '/users/:userId'. Accessed via req.params.",
      "Query strings: Key-value pairs appended to the URL after a '?'. Accessed via req.query.",
      "express.Router: A class to create modular, mountable route handlers. Often referred to as a 'mini-app'.",
    ],
    whyItMatters:
      "As an application grows, keeping all routes in a single file becomes unmaintainable. The express.Router allows you to organize routes into separate files by domain (e.g., all user routes in 'users.js', all product routes in 'products.js'), drastically improving code structure and team collaboration.",
    commonPitfalls: [
      "Parameter conflicts: If you define '/users/new' AFTER '/users/:id', Express will think 'new' is an ID. Always define static routes before dynamic parameterized routes.",
      "Trailing slashes: By default, Express treats '/users' and '/users/' differently unless configured otherwise.",
    ],
    examples: [
      {
        title: "Route Parameters and Queries",
        description:
          "Extracting data from the URL path (params) and the URL query string (queries).",
        code: `import express from 'express';
const app = express();

// 1. Route Parameters (req.params)
// GET /api/users/42/books/99
app.get('/api/users/:userId/books/:bookId', (req, res) => {
  const { userId, bookId } = req.params;
  res.json({ user: userId, book: bookId });
});

// 2. Query Strings (req.query)
// GET /api/search?q=javascript&sort=desc
app.get('/api/search', (req, res) => {
  const { q, sort } = req.query;
  res.json({ searchQuery: q, sortOrder: sort });
});

app.listen(3000);`,
        language: "javascript",
      },
      {
        title: "Modular Routing with express.Router",
        description:
          "Splitting routes into separate files for clean architecture.",
        code: `// ─── routes/users.js ───
import { Router } from 'express';
const router = Router();

// These routes are relative to where the router is mounted
router.get('/', (req, res) => res.send('List of users'));
router.post('/', (req, res) => res.send('Create a user'));
router.get('/:id', (req, res) => res.send(\`User \${req.params.id}\`));

export default router;

// ─── app.js ───
import express from 'express';
import userRoutes from './routes/users.js';

const app = express();

// Mount the user router at the '/api/users' path
// So 'router.get("/")' becomes 'GET /api/users/'
app.use('/api/users', userRoutes);

app.listen(3000);`,
        language: "javascript",
      },
    ],
  },
  children: [],
};
