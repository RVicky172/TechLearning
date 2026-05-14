import type { TopicNode } from "@/data/types";

export const nodeSecurity: TopicNode = {
  id: "node-security",
  title: "Authentication & Security",
  iconName: "Shield",
  theory:
    "Security in Node.js spans authentication, authorization, input validation, and hardening HTTP headers. Getting this right from the start prevents costly data breaches.",
  theoryDetail: {
    keyConcepts: [
      "Authentication verifies who a user is; authorization controls what they can do",
      "Never store plain-text passwords — hash with bcrypt (cost factor 10–12 in production)",
      "HTTP security headers (via helmet) block many common browser-based attacks by default",
    ],
    whyItMatters:
      "Security vulnerabilities in Node.js APIs are responsible for some of the largest data breaches. Authentication bugs, missing authorization checks, and injection vulnerabilities are all preventable with the right patterns.",
    commonPitfalls: [
      "Storing JWT secrets in code — use environment variables and rotate secrets regularly",
      "Not expiring tokens — short-lived access tokens (15m) with refresh tokens are safer than long-lived ones",
      "Missing authorization checks — always verify the authenticated user owns the resource they're accessing",
    ],
    examples: [
      {
        title: "Authorization guard beyond authentication",
        description:
          "Authenticate first, then enforce resource ownership or role-based access.",
        code: `router.patch('/users/:id', requireAuth, async (req, res) => {
  const isOwner = req.user.sub === req.params.id;
  const isAdmin = req.user.roles?.includes('admin');

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const updated = await userService.update(req.params.id, req.body);
  res.json(updated);
});`,
        language: "javascript",
      },
    ],
  },
  children: [
    {
      id: "node-jwt",
      title: "JWT Authentication",
      iconName: "KeyRound",
      link: "https://jwt.io/introduction",
      theory:
        "JSON Web Tokens (JWT) are self-contained, signed tokens used to authenticate API requests. The server signs the token on login; the client sends it in the Authorization header on subsequent requests.",
      theoryDetail: {
        keyConcepts: [
          "JWT structure: base64(header).base64(payload).signature — the signature verifies integrity",
          "Use short-lived access tokens (15m) and longer-lived refresh tokens (7d) stored in httpOnly cookies",
          "Never store sensitive data in the payload — it's base64-encoded, not encrypted",
        ],
        whyItMatters:
          "JWT enables stateless authentication, allowing any server instance to verify a token without a shared session store. This is fundamental to scaling Node APIs horizontally.",
        commonPitfalls: [
          "Using 'none' algorithm — always specify the algorithm explicitly ('HS256' or 'RS256')",
          "Storing tokens in localStorage — they're accessible to JavaScript and vulnerable to XSS",
          "Not validating the 'iss' and 'aud' claims allowing tokens from other services to be accepted",
        ],
        examples: [
          {
            title: "JWT sign and verify",
            description: "Issue a token on login and verify it in auth middleware.",
            code: `import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET; // min 256-bit random string

// On login
function issueToken(userId) {
  return jwt.sign({ sub: userId }, SECRET, {
    expiresIn: '15m',
    algorithm: 'HS256',
  });
}

// In auth middleware
function verifyToken(token) {
  return jwt.verify(token, SECRET, { algorithms: ['HS256'] });
}

// Express middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.slice(7);
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-passwords",
      title: "Password Hashing with bcrypt",
      iconName: "Lock",
      link: "https://www.npmjs.com/package/bcrypt",
      theory:
        "bcrypt is the standard for hashing passwords in Node.js. Its built-in salting and configurable work factor make it resistant to brute-force and rainbow table attacks.",
      theoryDetail: {
        keyConcepts: [
          "bcrypt.hash(password, 12) hashes with salt rounds 12 — higher is slower but safer",
          "bcrypt.compare(plain, hash) safely compares without timing attacks",
          "Never log passwords, even encrypted — treat them as opaque values from the moment they arrive",
        ],
        whyItMatters:
          "If your database is leaked, bcrypt-hashed passwords are infeasible to crack with modern hardware. Plain-text or MD5/SHA1 passwords from leaked databases are cracked in hours.",
        commonPitfalls: [
          "Using low cost factors (< 10) making hashes fast to brute-force",
          "Re-hashing on every read instead of only on registration and password change",
          "Using crypto.createHash('md5') for passwords — MD5 is not a password hashing function",
        ],
        examples: [
          {
            title: "Register and login with bcrypt",
            description: "Hash on registration, compare on login.",
            code: `import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Registration
async function register(email, password) {
  const hash = await bcrypt.hash(password, SALT_ROUNDS);
  return db.user.create({ data: { email, passwordHash: hash } });
}

// Login
async function login(email, password) {
  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw new AppError('Invalid credentials', 401);

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new AppError('Invalid credentials', 401);

  return issueToken(user.id);
}`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-helmet-cors",
      title: "Helmet, CORS & Rate Limiting",
      iconName: "ShieldCheck",
      link: "https://helmetjs.github.io/",
      theory:
        "Helmet sets security-related HTTP headers. CORS controls which origins can call your API. Rate limiting prevents abuse and denial-of-service attacks.",
      theoryDetail: {
        keyConcepts: [
          "helmet() sets headers like Content-Security-Policy, X-Frame-Options, and HSTS",
          "CORS must be configured deliberately — avoid Access-Control-Allow-Origin: * on authenticated APIs",
          "Rate limiting (express-rate-limit) prevents brute force on login and expensive endpoints",
        ],
        whyItMatters:
          "These three middleware handle entire categories of attacks — clickjacking, CSRF, brute force — with a few lines of configuration. Not using them leaves low-hanging fruit for attackers.",
        commonPitfalls: [
          "Wildcard CORS on APIs that use cookies — browsers block credentialed requests to wildcard origins",
          "Setting rate limits only on login — also limit registration, password reset, and expensive routes",
          "Disabling helmet's defaults without understanding what each header protects against",
        ],
        examples: [
          {
            title: "Security middleware setup",
            description: "Apply helmet, CORS, and rate limiting at the top of the Express app.",
            code: `import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

app.use(helmet()); // Security headers

app.use(cors({
  origin: process.env.CLIENT_URL, // Never use '*' for authenticated APIs
  credentials: true,
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Tighter limit for auth routes
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10 });
app.use('/auth', authLimiter);`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "node-env-secrets",
      title: "Environment Variables & Secrets Management",
      iconName: "EyeOff",
      link: "https://12factor.net/config",
      theory:
        "The Twelve-Factor App methodology says all configuration should come from the environment. Secrets like database passwords and API keys must never be committed to version control.",
      theoryDetail: {
        keyConcepts: [
          "Use dotenv for local development; use platform-native secrets in production (AWS Secrets Manager, Vault)",
          "Validate required environment variables at startup — fail fast rather than mid-request",
          "Rotate secrets regularly and use short-lived credentials where possible",
        ],
        whyItMatters:
          "Leaked secrets in git history are among the most common causes of serious security incidents. Proper secrets management is non-negotiable for any production system.",
        commonPitfalls: [
          "Committing .env files — add .env to .gitignore immediately when creating the project",
          "Using the same secrets across environments — each environment needs its own credentials",
          "Logging environment variables on startup exposing secrets in log aggregation systems",
        ],
        examples: [
          {
            title: "Validated environment config",
            description: "Validate all required variables at startup using Zod.",
            code: `import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
});

// Throws at startup if any required variable is missing or invalid
export const env = EnvSchema.parse(process.env);`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
