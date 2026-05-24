import type { TopicNode } from "@/data/types";

export const expressSecurity: TopicNode = {
  id: "express-security",
  title: "Security and Production Hardening",
  iconName: "Shield",
  theory:
    "Express is minimal by design, which means security is your responsibility. A production API needs more than routes and middleware: secure headers, input validation, safe error responses, rate limiting, trusted proxy configuration, and careful secret handling are all part of building a real backend.",
  theoryDetail: {
    keyConcepts: [
      "Use Helmet to set safer HTTP headers such as Content-Security-Policy, X-Content-Type-Options, and frame protections.",
      "Rate limiting helps slow brute-force attacks and abusive clients before they overload your API.",
      "Never leak stack traces, SQL errors, or internal implementation details to public clients in production.",
      "Store secrets in environment variables or a secret manager, not in source code.",
      "When deploying behind a reverse proxy or platform load balancer, configure trust proxy correctly for IP-based features and secure cookies.",
    ],
    whyItMatters:
      "Security mistakes in Express are usually not caused by one dramatic bug but by a series of small defaults left unchanged. Production hardening turns a demo server into a backend that is safe to expose to real users and traffic.",
    commonPitfalls: [
      "Running without Helmet, rate limiting, or payload size limits on public endpoints.",
      "Sending raw error objects to clients, which leaks implementation details.",
      "Using secure cookies in production without setting trust proxy when Express is behind a proxy.",
    ],
    examples: [
      {
        title: "Basic hardening with Helmet and rate limiting",
        description:
          "This is a strong baseline for internet-facing Express APIs and admin panels.",
        code: `import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(helmet());
app.use(express.json({ limit: '100kb' }));

app.use('/api', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.get('/health', (req, res) => {
  res.json({ ok: true });
});`,
        language: "javascript",
      },
      {
        title: "Safe production error responses",
        description:
          "Log detailed errors internally, but return a stable error contract to clients.",
        code: `app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = statusCode >= 500
    ? 'Internal server error'
    : err.message;

  res.status(statusCode).json({
    error: message,
    requestId: req.id,
  });
});`,
        language: "javascript",
      },
    ],
  },
};
