import type { TopicNode } from "@/data/types";

export const expressValidation: TopicNode = {
  id: "express-validation",
  title: "Request Validation and Sanitization",
  iconName: "CheckCircle",
  theory:
    "Express receives untrusted input from params, query strings, headers, cookies, and request bodies. Validation ensures the shape and meaning of incoming data is correct before business logic runs, while sanitization removes or normalizes dangerous or invalid values.",
  theoryDetail: {
    keyConcepts: [
      "Validate at the API boundary before database writes, third-party API calls, or auth-sensitive actions.",
      "Schema libraries like Zod, Joi, or express-validator keep validation explicit and reusable.",
      "Good validation returns clear 400 responses with machine-readable details instead of generic server errors.",
      "Sanitization can trim strings, normalize emails, coerce numbers, or reject unknown fields.",
      "Validation is not only for forms; route params and query filters also need strict validation.",
    ],
    whyItMatters:
      "Validation prevents bad data from leaking into your system and turning into deeper bugs. It also improves API usability because clients get fast, actionable feedback instead of confusing downstream failures.",
    commonPitfalls: [
      "Assuming TypeScript types validate runtime input. They do not exist at runtime.",
      "Validating only req.body while ignoring req.params and req.query.",
      "Returning inconsistent error shapes that force frontend code to special-case every endpoint.",
    ],
    examples: [
      {
        title: "Validate JSON body with Zod",
        description:
          "Schema-based validation keeps request contracts close to the route and provides structured error details.",
        code: `import express from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

const createUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
  age: z.number().int().positive().optional(),
});

app.post('/api/users', (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.flatten(),
    });
  }

  res.status(201).json({ user: parsed.data });
});`,
        language: "javascript",
      },
      {
        title: "Validate params and query inputs",
        description:
          "Filtering and pagination bugs often start with unvalidated query strings or invalid path params.",
        code: `const listUsersQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  role: z.enum(['admin', 'member']).optional(),
});

app.get('/api/users/:userId', (req, res) => {
  const userId = Number(req.params.userId);
  if (!Number.isInteger(userId)) {
    return res.status(400).json({ error: 'userId must be an integer' });
  }

  const query = listUsersQuery.parse(req.query);
  res.json({ userId, filters: query });
});`,
        language: "javascript",
      },
    ],
  },
};
