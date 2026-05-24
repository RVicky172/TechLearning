import type { TopicNode } from "@/data/types";

export const securityFundamentals: TopicNode = {
  id: "security-fundamentals",
  title: "OWASP Top 10 Overview",
  iconName: "Shield",
  link: "https://owasp.org/www-project-top-ten/",
  theory:
    "The OWASP Top 10 is the most widely referenced list of critical web application security risks, updated every few years based on real-world breach data. Every fullstack developer should be able to recognise, exploit (in a test environment), and prevent each category.",
  theoryDetail: {
    keyConcepts: [
      "A01 Broken Access Control: most common — users accessing resources they shouldn't (IDOR, path traversal, privilege escalation)",
      "A02 Cryptographic Failures: weak encryption, unencrypted data in transit/at rest, weak password hashing (MD5, SHA1 instead of bcrypt/argon2)",
      "A03 Injection: SQL injection, NoSQL injection, command injection — unsanitised user input interpreted as code",
      "A04 Insecure Design: security not considered in the design phase — no threat modelling, no rate limiting, no brute-force protection",
      "A05 Security Misconfiguration: default credentials, open S3 buckets, verbose error messages, unused features enabled, missing security headers",
      "A06 Vulnerable Components: outdated npm/pip packages with known CVEs — run npm audit; use Dependabot or Snyk",
      "A07 Auth Failures: weak passwords, no MFA, insecure session management, exposed tokens in URLs or logs",
      "A09 Security Logging Failures: no audit log, insufficient alerting — you can't detect or respond to breaches you don't log",
      "A10 SSRF (Server-Side Request Forgery): server fetches a URL provided by the user — attacker redirects it to internal services (cloud metadata, Redis, internal APIs)",
    ],
    whyItMatters:
      "Security is not a specialisation — it's a baseline expectation for every developer. A single SQL injection or IDOR vulnerability can expose millions of user records. Security knowledge is increasingly tested in senior engineering interviews and required for fintech, healthtech, and enterprise roles.",
    commonPitfalls: [
      "Security as an afterthought — build security in from the design phase; retrofitting is 10× more expensive",
      "Trusting client-side validation — always re-validate on the server; client validation is UX, not security",
      "Verbose error messages in production — never expose stack traces, SQL errors, or file paths to the client; log them server-side",
      "Not updating dependencies — npm packages accumulate CVEs; run npm audit in CI and fail the build on high-severity issues",
    ],
    examples: [
      {
        title: "Implementing secure HTTP response headers",
        description:
          "Security headers mitigate XSS, clickjacking, MIME sniffing, and info leakage with zero application logic changes.",
        code: `// Express middleware — security headers
import helmet from "helmet";

app.use(
  helmet({
    // Content Security Policy — whitelist allowed script/style/image sources
    contentSecurityPolicy: {
      directives: {
        defaultSrc:     ["'self'"],
        scriptSrc:      ["'self'", "https://cdn.example.com"],
        styleSrc:       ["'self'", "'unsafe-inline'"],  // unsafe-inline needed for some CSS-in-JS
        imgSrc:         ["'self'", "data:", "https:"],
        connectSrc:     ["'self'", "https://api.example.com"],
        fontSrc:        ["'self'", "https://fonts.gstatic.com"],
        objectSrc:      ["'none'"],
        frameAncestors: ["'none'"],  // equivalent to X-Frame-Options: DENY
        upgradeInsecureRequests: [],
      },
    },
    // Strict-Transport-Security — force HTTPS for 1 year
    hsts: { maxAge: 31_536_000, includeSubDomains: true, preload: true },
    // X-Content-Type-Options: nosniff — prevents MIME type sniffing
    noSniff: true,
    // X-Frame-Options: DENY — prevents clickjacking (covered by CSP frameAncestors above)
    frameguard: { action: "deny" },
    // Referrer-Policy — limit referrer info sent to third parties
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);

// In Next.js — next.config.ts headers()
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options",   value: "nosniff" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",       value: "camera=(), microphone=(), geolocation=()" },
];`,
        language: "typescript",
      },
    ],
  },
};
