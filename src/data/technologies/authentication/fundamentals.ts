import type { TopicNode } from "@/data/types";

export const authFundamentals: TopicNode = {
  id: "auth-fundamentals",
  title: "Authentication vs Authorisation",
  iconName: "Lock",
  link: "https://auth0.com/docs/get-started/identity-fundamentals",
  theory:
    "Authentication (AuthN) answers 'who are you?' — it verifies identity. Authorisation (AuthZ) answers 'what are you allowed to do?' — it enforces access control. These two concerns are distinct and must be designed separately. Getting either wrong is a top cause of security breaches.",
  theoryDetail: {
    keyConcepts: [
      "Session-based auth: server stores session data; client holds a session ID cookie — stateful, requires sticky sessions or a shared store like Redis",
      "Token-based auth (JWT): server issues a signed token the client stores and sends with each request — stateless, scales horizontally without shared state",
      "OAuth 2.0: an authorisation framework — the user grants a third-party app (your app) access to their resources on another server (Google, GitHub) via access tokens",
      "OIDC (OpenID Connect): an identity layer on top of OAuth 2.0 — adds ID tokens and a /userinfo endpoint, enabling single sign-on (SSO)",
      "RBAC (Role-Based Access Control): users are assigned roles (admin, editor, viewer); permissions are attached to roles, not users",
      "ABAC (Attribute-Based Access Control): access is decided by attributes (user.department, resource.owner, time.now) — more flexible than RBAC for complex rules",
      "MFA (Multi-Factor Authentication): combines something you know (password) + something you have (TOTP, passkey) — dramatically reduces account takeover risk",
    ],
    whyItMatters:
      "Authentication bugs are the second most common security vulnerability (OWASP A07). Every application needs it, and the choices you make (sessions vs JWT, where to store tokens, how to verify identity) have long-term architectural and security implications.",
    commonPitfalls: [
      "Storing JWTs in localStorage — JavaScript-accessible storage is vulnerable to XSS; prefer HttpOnly cookies for token storage",
      "Not implementing token expiry — access tokens should expire quickly (15 min); use refresh tokens for session continuation",
      "Rolling your own auth — cryptography is hard to get right; use Auth.js, Clerk, or Auth0 for production apps",
      "Conflating authentication and authorisation — always check both: is this user authenticated? are they allowed to do THIS specific action?",
    ],
    examples: [
      {
        title: "Auth.js (NextAuth) v5 setup in Next.js App Router",
        description:
          "The minimal Auth.js config for Next.js with GitHub OAuth and credential-based login.",
        code: `// auth.ts (project root)
import NextAuth from "next-auth";
import GitHub   from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // ── OAuth — GitHub SSO ────────────────────────────────
    GitHub({
      clientId:     process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),

    // ── Credentials — email + password ────────────────────
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user) return null;
        const valid = await verifyPassword(credentials.password as string, user.passwordHash);
        if (!valid) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],

  callbacks: {
    // Attach role to the JWT
    jwt({ token, user }) {
      if (user) token.role = (user as { role: string }).role;
      return token;
    },
    // Expose role in the session object
    session({ session, token }) {
      session.user.role = token.role as string;
      return session;
    },
  },
});

// app/api/auth/[...nextauth]/route.ts
export { GET, POST } from "@/auth";

// ── Protecting a server component ────────────────────────
// app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  return <div>Welcome, {session.user.name}</div>;
}`,
        language: "typescript",
      },
    ],
  },
};
