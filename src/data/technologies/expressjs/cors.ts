import type { TopicNode } from "@/data/types";

export const expressCors: TopicNode = {
  id: "express-cors",
  title: "CORS and Cross-Origin Requests",
  iconName: "Globe",
  theory:
    "CORS stands for Cross-Origin Resource Sharing. It is a browser security mechanism that controls whether frontend code running on one origin can read responses from a backend on another origin. In production systems, CORS is not just about making localhost work. It is about explicitly deciding which frontend URLs are allowed to call your API and rejecting everything else by default.",
  theoryDetail: {
    keyConcepts: [
      "Origin means the combination of protocol, host, and port. http://localhost:3000 and http://localhost:5000 are different origins.",
      "Browsers enforce the Same-Origin Policy. Without explicit permission, frontend JavaScript cannot read responses from another origin.",
      "CORS works through HTTP headers like Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Headers.",
      "Preflight requests are automatic OPTIONS requests the browser sends before certain cross-origin requests to verify server permissions.",
      "The Express 'cors' package is the standard way to configure CORS safely instead of manually writing all headers.",
      "Production APIs should usually use an allowlist (whitelist) of trusted frontend origins instead of enabling every origin.",
      "A good allowlist often comes from environment variables so development, staging, and production can each permit different frontend URLs.",
    ],
    whyItMatters:
      "If you build a React frontend and an Express API separately, you will hit CORS immediately. Understanding it prevents the common mistake of blaming fetch, Axios, or Express routing when the browser is actually blocking the response for security reasons. In production, a proper origin allowlist also reduces accidental exposure of your API to unexpected browser clients.",
    commonPitfalls: [
      "Using app.use(cors()) blindly in production and unintentionally allowing every origin.",
      "Forgetting that CORS is a browser concern; tools like Postman can succeed even when the browser blocks the same request.",
      "Misconfiguring credentialed requests by combining credentials: true with a wildcard origin '*', which browsers reject.",
      "Hardcoding a single localhost origin and forgetting staging or production domains.",
      "Trying to use path-level values like '/app' in an allowlist even though CORS decisions are based on origin, not URL path.",
    ],
    comparisons: [
      {
        title: "Simple request vs preflight request",
        summary: "Not every cross-origin request behaves the same way in the browser.",
        points: [
          "Simple requests (for example basic GET) may skip preflight if they meet browser criteria.",
          "Requests with custom headers, non-simple content types, or certain HTTP methods trigger an OPTIONS preflight first.",
          "If the server does not answer the preflight correctly, the browser blocks the real request before it is sent.",
        ],
      },
      {
        title: "Wildcard CORS vs allowlist CORS",
        summary: "The right production choice is usually explicit origin control, not global access.",
        points: [
          "Wildcard CORS (origin: '*') is fast for public, unauthenticated APIs but too broad for most app backends.",
          "Allowlist CORS explicitly permits only trusted frontend URLs such as app.example.com and admin.example.com.",
          "If credentials or cookies are involved, you must use specific origins instead of '*'.",
        ],
      },
    ],
    examples: [
      {
        title: "Allow a frontend app to access an Express API",
        description:
          "The safest baseline is to explicitly allow the known frontend origin instead of enabling every origin.",
        code: `import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.get('/api/products', (req, res) => {
  res.json([{ id: 1, name: 'Keyboard' }]);
});

app.listen(5000);`,
        language: "javascript",
      },
      {
        title: "Credentialed requests with cookies or session auth",
        description:
          "When the browser must send cookies, you need an explicit origin and credentials enabled on both client and server.",
        code: `import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'https://app.example.com',
  credentials: true,
}));

app.get('/api/me', (req, res) => {
  res.json({ authenticated: true });
});

// Frontend example:
// fetch('https://api.example.com/api/me', {
//   credentials: 'include',
// });`,
        language: "javascript",
      },
      {
        title: "Production-safe origin allowlist (whitelist)",
        description:
          "A common production setup is to keep allowed frontend origins in configuration and reject unknown browser origins by default.",
        code: `import express from 'express';
import cors from 'cors';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'https://staging.example.com',
  'https://app.example.com',
  'https://admin.example.com',
];

app.use(cors({
  origin(origin, callback) {
    // Allow server-to-server tools or same-origin requests with no Origin header.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.listen(5000);`,
        language: "javascript",
      },
      {
        title: "Load allowed origins from environment variables",
        description:
          "This pattern keeps development, staging, and production origin lists configurable without code changes.",
        code: `const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origin not allowed by CORS'));
  },
}));

// Example env value:
// CORS_ALLOWED_ORIGINS=http://localhost:3000,https://staging.example.com,https://app.example.com`,
        language: "javascript",
      },
    ],
  },
};
