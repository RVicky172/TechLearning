import type { TopicNode } from "@/data/types";

export const securityAttacks: TopicNode = {
  id: "security-attacks",
  title: "XSS, CSRF & Injection",
  iconName: "ShieldAlert",
  link: "https://owasp.org/www-community/attacks/",
  theory:
    "XSS, CSRF, and injection attacks are the three most commonly exploited vulnerability classes in web applications. Each has a specific attack vector and a specific set of defences. Understanding both sides — how the attack works and how to prevent it — is the foundation of secure coding.",
  theoryDetail: {
    keyConcepts: [
      "XSS (Cross-Site Scripting): attacker injects malicious script into a page that runs in victims' browsers — steals cookies, session tokens, or performs actions as the victim",
      "Stored XSS: malicious script is persisted in the database and rendered to all users who view the page",
      "Reflected XSS: malicious script in a URL parameter is reflected back in the response — victim must click a crafted link",
      "CSRF (Cross-Site Request Forgery): attacker tricks an authenticated user into making an unintended request (e.g. clicking a link that deletes their account)",
      "SQL Injection: unsanitised user input is concatenated into a SQL query — attacker can read, modify, or delete data",
      "Command Injection: user input is passed to a shell command — attacker can execute arbitrary OS commands",
      "IDOR (Insecure Direct Object Reference): API accepts user-supplied IDs without checking ownership — GET /api/orders/12345 works even if you didn't place order 12345",
    ],
    whyItMatters:
      "These are not theoretical. XSS attacks happen against major platforms. SQL injection was responsible for breaches exposing billions of records. CSRF led to major financial fraud cases. Understanding them makes you write more secure code automatically.",
    commonPitfalls: [
      "Sanitising on input instead of encoding on output — XSS is prevented by HTML-encoding at render time, not by stripping on the way in",
      "Building SQL queries with string concatenation — always use parameterised queries or a query builder; never ever concatenate user input into SQL",
      "Relying solely on CORS for CSRF protection — CORS controls what origins can read responses, not what origins can send requests; use CSRF tokens for state-changing requests",
    ],
    examples: [
      {
        title: "SQL injection prevention and CSRF protection",
        description:
          "Parameterised queries prevent injection; double-submit cookie pattern prevents CSRF.",
        code: `// ── SQL Injection — ALWAYS use parameterised queries ────────
import { Pool } from "pg";
const pool = new Pool();

// ❌ DANGEROUS — do not do this
async function getUser_BAD(id: string) {
  // If id = "1 OR 1=1" — returns ALL users
  return pool.query(\`SELECT * FROM users WHERE id = \${id}\`);
}

// ✅ SAFE — parameterised query ($1 placeholder)
async function getUser(id: string) {
  return pool.query("SELECT * FROM users WHERE id = $1", [id]);
}

// ✅ SAFE — ORM (Prisma always uses parameterised queries internally)
const user = await prisma.user.findUnique({ where: { id } });

// ── CSRF protection — csurf middleware (Express) ──────────
import csrf from "csurf";
import cookieParser from "cookie-parser";

app.use(cookieParser());
const csrfProtection = csrf({ cookie: { httpOnly: true, sameSite: "strict" } });

// Routes that change state must be CSRF-protected
app.get("/form",        csrfProtection, (req, res) => {
  // Embed token in the form / send to SPA
  res.json({ csrfToken: req.csrfToken() });
});
app.post("/transfer",   csrfProtection, handleTransfer);
app.delete("/account",  csrfProtection, handleDeleteAccount);

// ── XSS — React auto-escapes JSX values ──────────────────
// React's JSX renderer HTML-encodes by default — you get XSS protection for free
// Only dangerouslySetInnerHTML bypasses this — NEVER use it with user-supplied content
// If you must render HTML, use DOMPurify to sanitise first:
import DOMPurify from "dompurify";

function SafeHTML({ html }: { html: string }) {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}`,
        language: "typescript",
      },
    ],
  },
};
