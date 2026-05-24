import type { TopicNode } from "@/data/types";

export const expressAuthentication: TopicNode = {
  id: "express-authentication",
  title: "Authentication and Authorization",
  iconName: "Key",
  theory:
    "Authentication answers 'who are you?' and authorization answers 'what are you allowed to do?'. In Express APIs, these concerns usually live inside middleware so protected routes stay consistent, reusable, and easy to reason about.",
  theoryDetail: {
    keyConcepts: [
      "Authentication verifies identity using sessions, cookies, JWTs, API keys, or OAuth providers.",
      "Authorization checks permissions after identity is known, for example admin-only or owner-only routes.",
      "Middleware is the natural place for auth because it can reject requests before the route handler runs.",
      "Attach trusted user data to req after verification so downstream handlers can rely on it.",
      "Prefer short-lived tokens, secure cookie flags, and backend permission checks instead of trusting frontend UI gating.",
    ],
    whyItMatters:
      "Most real Express apps expose private user data, dashboards, or admin actions. Without a clean auth strategy, your API becomes difficult to secure and every route ends up duplicating access-control logic.",
    commonPitfalls: [
      "Checking auth in route handlers instead of a reusable middleware layer.",
      "Trusting decoded token payloads without verifying signatures or expiration.",
      "Treating authorization as a frontend concern; hidden buttons do not protect an API.",
    ],
    examples: [
      {
        title: "JWT authentication middleware",
        description:
          "A common Express pattern is to verify a bearer token once and expose the user on req for later middleware and handlers.",
        code: `import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/api/profile', requireAuth, (req, res) => {
  res.json({ userId: req.user.sub, role: req.user.role });
});`,
        language: "javascript",
      },
      {
        title: "Role-based authorization middleware",
        description:
          "After authentication, authorization middleware can protect admin routes without repeating role checks everywhere.",
        code: `function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
}

app.delete('/api/admin/users/:id', requireAuth, requireRole('admin'), async (req, res) => {
  await deleteUser(req.params.id);
  res.status(204).send();
});`,
        language: "javascript",
      },
    ],
  },
};
