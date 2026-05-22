import type { TopicNode } from "@/data/types";

export const fullstackAuth: TopicNode = {
  id: "fullstack-auth",
  title: "Authentication & Authorization",
  iconName: "ShieldCheck",
  theory:
    "Authentication verifies who a user is (identity); authorization determines what they are allowed to do (permissions). Getting these right is critical — mistakes lead to data breaches, account takeover, and privilege escalation.",
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
    {
      id: "fullstack-auth-methods",
      title: "Real-World Authentication Methods",
      iconName: "Fingerprint",
      link: "https://auth0.com/docs/authenticate",
      theory:
        "Production systems rarely rely on a single login method. Real applications mix passwords, magic links, one-time codes, social login, enterprise SSO, MFA, passkeys, and device trust depending on the audience and security level required.",
      theoryDetail: {
        keyConcepts: [
          "Password-based login is still common, but it should be combined with strong hashing, login throttling, and optional MFA.",
          "Magic links and OTPs reduce password handling but shift risk to email and SMS channels.",
          "OAuth and OIDC support social login and enterprise identity providers without storing the user's primary password yourself.",
          "Passkeys based on WebAuthn are increasingly important because they resist phishing better than passwords and SMS codes.",
          "MFA combines factors such as something you know, have, or are to reduce account takeover risk.",
        ],
        whyItMatters:
          "Choosing the wrong auth method creates friction for users or weak security for the business. Modern engineers need to understand when to use sessions, JWTs, passkeys, SSO, MFA, service accounts, and API keys in the real world.",
        commonPitfalls: [
          "Using SMS as the only second factor for high-risk systems even though it is vulnerable to SIM-swap attacks.",
          "Treating API keys like user authentication instead of machine credentials with scope and rotation.",
          "Building custom auth flows when a proven provider or library would reduce security risk.",
        ],
        comparisons: [
          {
            title: "When each auth method fits",
            summary: "Pick the method based on user type, risk, and operational complexity.",
            points: [
              "Passwords: easy to understand, weakest user experience and phishing resistance",
              "Magic links or OTP: simpler onboarding, depends on email or phone security",
              "OAuth or OIDC: ideal for social login and enterprise SSO",
              "Passkeys: strongest phishing resistance and improving user experience",
              "API keys and service tokens: for machine-to-machine access, not end-user login",
            ],
          },
        ],
        examples: [
          {
            title: "How Magic Links Work",
            description: "A passwordless flow where the user receives a unique, short-lived token via email.",
            code: `// 1. User enters email -> Server generates token
const token = crypto.randomBytes(32).toString('hex');
const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
await db.VerificationToken.create({ email, token, expires });

// 2. Server sends email
await sendEmail(email, \`Click here to login: https://app.com/verify?token=\${token}\`);

// 3. User clicks link -> Server verifies token
app.get('/verify', async (req, res) => {
  const record = await db.VerificationToken.find({ token: req.query.token });
  if (!record || record.expires < new Date()) {
    return res.status(401).send('Token expired or invalid');
  }
  // Log user in, create session, delete token
  createSession(record.email);
  await db.VerificationToken.delete({ token });
});`,
            language: "javascript",
          },
          {
            title: "OAuth 2.0 / Social Login Flow",
            description: "How 'Sign in with Google' works at a high level.",
            code: `// 1. App redirects user to Google
const googleAuthUrl = \`https://accounts.google.com/o/oauth2/v2/auth?client_id=\${CLIENT_ID}&redirect_uri=\${REDIRECT_URI}&response_type=code&scope=email profile\`;
res.redirect(googleAuthUrl);

// 2. Google redirects back to your app with a "code"
// E.g., https://app.com/callback?code=4/P7q7W91a-oMsCeLvIa-1m_k

// 3. Your backend exchanges the code for an Access/ID Token
const response = await fetch('https://oauth2.googleapis.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    code: req.query.code,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code'
  })
});
const { access_token, id_token } = await response.json();

// 4. Decode id_token to get user email/profile, then log them in`,
            language: "javascript",
          },
        ],
      },
    },
    {
      id: "fullstack-auth-attacks",
      title: "Authentication Attacks and Defenses",
      iconName: "AlertTriangle",
      link: "https://owasp.org/www-community/attacks/",
      theory:
        "Authentication systems are a primary attack surface. You need to understand the common attacks used in real systems so you can design mitigations before the first incident rather than after it.",
      theoryDetail: {
        keyConcepts: [
          "Brute-force and credential-stuffing attacks try many passwords or leaked username-password pairs against login endpoints.",
          "Phishing steals credentials or MFA codes by tricking users into logging into a fake site.",
          "Session hijacking steals a valid session or token through XSS, malware, network compromise, or poor cookie handling.",
          "CSRF tricks a logged-in browser into sending unwanted authenticated requests when cookie-based auth is not protected correctly.",
          "JWT and OAuth implementation flaws often come from weak token validation, bad redirect handling, or token storage mistakes.",
        ],
        whyItMatters:
          "Attack explanations make the defensive controls easier to understand. Rate limits, MFA, HttpOnly cookies, CSRF tokens, PKCE, device binding, anomaly detection, and passkeys all make more sense when you know the attack they are stopping.",
        commonPitfalls: [
          "Thinking HTTPS alone prevents phishing, credential stuffing, or token theft.",
          "Using localStorage for long-lived tokens, which exposes them to XSS.",
          "Ignoring account recovery and password reset flows, which attackers often target because they are weaker than the main login flow.",
        ],
        comparisons: [
          {
            title: "Common auth attacks",
            summary: "Each attack targets a different weak point in the identity flow.",
            points: [
              "Brute force: guesses many passwords for one account",
              "Credential stuffing: reuses leaked credentials across many sites",
              "Phishing: tricks users into handing over valid credentials or MFA codes",
              "Session hijacking: steals a session cookie or token after login",
              "CSRF: abuses the browser's automatic cookie sending to trigger actions",
              "Privilege escalation: bypasses authz checks to access higher-privilege resources",
            ],
          },
        ],
        examples: [
          {
            title: "Defense checklist for login flows",
            description: "A practical set of controls for real-world auth endpoints.",
            code: `Recommended defenses:
- hash passwords with argon2id or bcrypt
- apply rate limits and bot detection on login and reset endpoints
- use MFA for sensitive accounts
- store session tokens in Secure, HttpOnly cookies
- use CSRF protection for cookie-based flows
- validate OAuth state, nonce, redirect URIs, and PKCE
- rotate refresh tokens and detect reuse
- log suspicious sign-in activity and impossible travel
- harden account recovery and email change flows`,
            language: "text",
          },
        ],
      },
    },
  ],
};
