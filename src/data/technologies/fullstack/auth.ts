import type { TopicNode } from "@/data/types";

export const fullstackAuth: TopicNode = {
  id: "fullstack-auth",
  title: "Authentication & Authorization",
  iconName: "ShieldCheck",
  theory:
    "Authentication verifies who a user is (identity); authorization determines what they are allowed to do (permissions). Getting these right is critical — mistakes lead to data breaches and privilege escalation.",
  theoryDetail: {
    keyConcepts: [
      "Authentication: proving identity — login with password, OAuth, passkeys, biometrics",
      "Authorization: enforcing permissions — RBAC (role-based), ABAC (attribute-based), ACL (access control list)",
      "Sessions vs. tokens: sessions store state server-side; JWTs embed claims client-side",
    ],
    whyItMatters:
      "Auth vulnerabilities are consistently in the OWASP Top 10. Misconfigured auth can expose user data, allow account takeovers, or grant unintended admin access. Every developer touching auth code needs to understand these fundamentals.",
    commonPitfalls: [
      "Storing passwords in plain text — always hash with bcrypt, argon2, or scrypt",
      "Putting sensitive data in JWTs — the payload is base64-encoded, not encrypted; anyone can decode it",
      "Not implementing token expiry or refresh — long-lived tokens are a security liability",
    ],
  },
  children: [
    {
      id: "fullstack-sessions-jwt",
      title: "Sessions & JWT",
      iconName: "Key",
      link: "https://jwt.io/introduction",
      theory:
        "Sessions store auth state on the server and give clients a session ID cookie. JWTs (JSON Web Tokens) encode signed claims directly in the token — the server validates the signature without a database lookup.",
      theoryDetail: {
        keyConcepts: [
          "JWT structure: header.payload.signature — the signature is verified with a secret or public key",
          "Access tokens are short-lived (15 min); refresh tokens are long-lived and used to get new access tokens",
          "HttpOnly cookies prevent JavaScript from reading tokens, protecting against XSS",
          "Stateless JWTs cannot be revoked before expiry — use a short TTL or a token deny-list for logout",
        ],
        whyItMatters:
          "Most modern web apps use JWTs for API authentication. Understanding the token lifecycle — issuance, validation, refresh, and revocation — is essential for building secure auth flows.",
        commonPitfalls: [
          "Storing JWTs in localStorage — vulnerable to XSS; prefer HttpOnly cookies",
          "Using the 'none' algorithm (no signature) — always validate the alg header and reject 'none'",
          "Not validating the exp, iss, and aud claims — accept only tokens your server issued",
        ],
        examples: [
          {
            title: "JWT structure and validation",
            description: "Decoding and verifying a JWT in Node.js.",
            code: `import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET!;

// Sign a token (expires in 15 minutes)
const token = jwt.sign(
  { sub: user.id, role: user.role },
  SECRET,
  { expiresIn: '15m', algorithm: 'HS256' }
);

// Verify a token
try {
  const payload = jwt.verify(token, SECRET, { algorithms: ['HS256'] });
  console.log(payload.sub); // user ID
} catch (err) {
  // TokenExpiredError, JsonWebTokenError, etc.
  res.status(401).json({ error: 'Invalid or expired token' });
}`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "fullstack-oauth",
      title: "OAuth 2.0 & OpenID Connect",
      iconName: "UserCheck",
      link: "https://oauth.net/2/",
      theory:
        "OAuth 2.0 is an authorization framework that lets users grant third-party apps limited access to their accounts without sharing passwords. OpenID Connect (OIDC) adds an identity layer on top of OAuth 2.0 for authentication.",
      theoryDetail: {
        keyConcepts: [
          "Authorization Code Flow with PKCE is the recommended flow for web and mobile apps",
          "Scopes define the level of access requested: openid, profile, email, read:repos",
          "ID tokens (OIDC) carry user identity; access tokens authorize API calls",
          "Providers: Google, GitHub, Microsoft, Auth0, Clerk, Supabase Auth",
        ],
        whyItMatters:
          "Social login (Sign in with Google/GitHub) uses OAuth. Most enterprise SSO is built on OIDC. Understanding the flow prevents security mistakes like CSRF attacks on the redirect URI or accepting forged tokens.",
        commonPitfalls: [
          "Not validating the state parameter, leaving the app vulnerable to CSRF attacks",
          "Implementing custom OAuth instead of using a battle-tested library (passport.js, next-auth)",
          "Storing access tokens in localStorage — use HttpOnly cookies or secure server-side storage",
        ],
      },
    },
    {
      id: "fullstack-rbac",
      title: "Role-Based Access Control (RBAC)",
      iconName: "Users",
      link: "https://auth0.com/docs/manage-users/access-control",
      theory:
        "RBAC assigns permissions to roles (admin, editor, viewer) and roles to users. Checking a user's role before executing sensitive operations is the most common authorization pattern.",
      theoryDetail: {
        keyConcepts: [
          "Roles group permissions: 'admin' can delete; 'editor' can write; 'viewer' can only read",
          "Embed role in JWT payload for stateless checks — but validate against DB for sensitive operations",
          "Principle of least privilege: grant only the minimum permissions needed for a task",
        ],
        whyItMatters:
          "RBAC prevents horizontal privilege escalation (user A accessing user B's data) and vertical escalation (a viewer performing admin actions). It's required for any multi-user application.",
        commonPitfalls: [
          "Doing authorization checks only on the frontend — always enforce on the server",
          "Role explosion — creating too many fine-grained roles; prefer ABAC for complex permission models",
          "Not auditing permission changes — log who granted what role to whom and when",
        ],
        examples: [
          {
            title: "RBAC middleware in Express",
            description: "Middleware that restricts routes to specific roles.",
            code: `function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user; // set by JWT middleware
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    next();
  };
}

// Usage
app.delete('/api/posts/:id', authenticate, requireRole('admin', 'editor'), deletePost);
app.get('/api/admin/users', authenticate, requireRole('admin'), listUsers);`,
            language: "javascript",
          },
        ],
      },
    },
  ],
};
